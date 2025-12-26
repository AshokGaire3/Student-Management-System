import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    let enrollments = await db.getAllEnrollments();

    // Students can only see their own enrollments
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (studentRecord) {
        enrollments = enrollments.filter(e => e.studentId.toString() === studentRecord._id.toString());
      } else {
        enrollments = [];
      }
    }

    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Get enrollments by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = req.user;

    // Students can only view their own enrollments
    if (user.role === 'student') {
      const student = await db.getStudentById(studentId);
      if (!student || student.email !== user.email) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const enrollments = await db.getEnrollmentsByStudent(studentId);
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Get enrollment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await db.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// Create enrollment
router.post('/', async (req, res) => {
  try {
    const user = req.user;
    const { courseId, studentId } = req.body;

    // Find student ID if user is student
    let targetStudentId = studentId;
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord) {
        return res.status(404).json({ error: 'Student record not found' });
      }
      targetStudentId = studentRecord._id.toString();
    }

    // Students can only enroll themselves
    if (user.role === 'student' && targetStudentId !== studentId && studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if already enrolled
    const existingEnrollment = await db.findEnrollment(targetStudentId, courseId);
    if (existingEnrollment && existingEnrollment.status === 'enrolled') {
      return res.status(400).json({ error: 'Student is already enrolled in this course' });
    }

    // Check course capacity
    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const currentEnrollmentCount = await db.countEnrollmentsByCourse(courseId);
    if (currentEnrollmentCount >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    const enrollmentData = {
      studentId: targetStudentId,
      courseId,
      enrollmentDate: new Date(),
      status: 'enrolled'
    };

    const newEnrollment = await db.createEnrollment(enrollmentData);

    // Update course enrolled count
    await db.updateCourse(courseId, {
      enrolledStudents: currentEnrollmentCount + 1
    });

    res.status(201).json(newEnrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: error.message || 'Failed to create enrollment' });
  }
});

// Update enrollment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;

    const enrollment = await db.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Students can only update their own enrollments
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord || enrollment.studentId.toString() !== studentRecord._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Convert date string to Date if needed
    if (updates.enrollmentDate && typeof updates.enrollmentDate === 'string') {
      updates.enrollmentDate = new Date(updates.enrollmentDate);
    }

    const updatedEnrollment = await db.updateEnrollment(id, updates);

    // Update course enrolled count if status changed
    if (updates.status && updates.status !== enrollment.status) {
      const course = await db.getCourseById(enrollment.courseId.toString());
      if (course) {
        const currentEnrollmentCount = await db.countEnrollmentsByCourse(course._id.toString());
        await db.updateCourse(course._id.toString(), {
          enrolledStudents: currentEnrollmentCount
        });
      }
    }

    res.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: error.message || 'Failed to update enrollment' });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const enrollment = await db.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Students can only delete their own enrollments
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord || enrollment.studentId.toString() !== studentRecord._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const deleted = await db.deleteEnrollment(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Update course enrolled count
    const course = await db.getCourseById(enrollment.courseId.toString());
    if (course) {
      const currentEnrollmentCount = await db.countEnrollmentsByCourse(course._id.toString());
      await db.updateCourse(course._id.toString(), {
        enrolledStudents: currentEnrollmentCount
      });
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

export default router;
