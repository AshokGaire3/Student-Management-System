import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await db.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (admin, instructor only)
router.post('/', authorizeRoles('admin', 'instructor'), async (req, res) => {
  try {
    const courseData = req.body;
    
    // Set instructor if not provided and user is instructor
    if (req.user.role === 'instructor' && !courseData.instructorId) {
      courseData.instructorId = req.user.id;
      const instructor = await db.findUserById(req.user.id);
      if (instructor) {
        courseData.instructorName = instructor.name;
      }
    }

    const newCourse = await db.createCourse(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: error.message || 'Failed to create course' });
  }
});

// Update course (admin, instructor only)
router.put('/:id', authorizeRoles('admin', 'instructor'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Instructors can only update their own courses
    if (req.user.role === 'instructor') {
      const course = await db.getCourseById(id);
      if (course && course.instructorId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updatedCourse = await db.updateCourse(id, updates);
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: error.message || 'Failed to update course' });
  }
});

// Delete course (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteCourse(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get courses by major
router.get('/major/:majorId', async (req, res) => {
  try {
    const { majorId } = req.params;
    const courses = await db.getCoursesByMajor(majorId);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
