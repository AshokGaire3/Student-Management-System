import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all grades
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    let grades = await db.getAllGrades();

    // Students can only see their own grades
    if (user.role === 'student') {
      // Find student by user ID (email match)
      const student = await db.getAllStudents();
      const studentRecord = student.find(s => s.email === user.email);
      if (studentRecord) {
        grades = grades.filter(grade => grade.studentId.toString() === studentRecord._id.toString());
      } else {
        grades = [];
      }
    }
    // Instructors can only see grades for their courses
    else if (user.role === 'instructor') {
      const allCourses = await db.getAllCourses();
      const instructorCourses = allCourses.filter(course => course.instructorId.toString() === user.id);
      const courseIds = instructorCourses.map(c => c._id.toString());
      grades = grades.filter(grade => courseIds.includes(grade.courseId.toString()));
    }

    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get grades by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = req.user;

    // Students can only view their own grades
    if (user.role === 'student') {
      const student = await db.getStudentById(studentId);
      if (!student || student.email !== user.email) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const grades = await db.getGradesByStudent(studentId);
    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get grade by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.getGradeById(id);
    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    console.error('Error fetching grade:', error);
    res.status(500).json({ error: 'Failed to fetch grade' });
  }
});

// Create grade (admin, instructor only)
router.post('/', authorizeRoles('admin', 'instructor'), async (req, res) => {
  try {
    const gradeData = req.body;
    // Convert date string to Date if needed
    if (gradeData.dateAssigned && typeof gradeData.dateAssigned === 'string') {
      gradeData.dateAssigned = new Date(gradeData.dateAssigned);
    }
    const newGrade = await db.createGrade(gradeData);
    res.status(201).json(newGrade);
  } catch (error) {
    console.error('Error creating grade:', error);
    res.status(500).json({ error: error.message || 'Failed to create grade' });
  }
});

// Update grade (admin, instructor only)
router.put('/:id', authorizeRoles('admin', 'instructor'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Convert date string to Date if needed
    if (updates.dateAssigned && typeof updates.dateAssigned === 'string') {
      updates.dateAssigned = new Date(updates.dateAssigned);
    }

    const updatedGrade = await db.updateGrade(id, updates);
    if (!updatedGrade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json(updatedGrade);
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: error.message || 'Failed to update grade' });
  }
});

// Delete grade (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteGrade(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

export default router;
