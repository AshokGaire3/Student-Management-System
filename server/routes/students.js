import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all students (admin, instructor only)
router.get('/', authorizeRoles('admin', 'instructor'), async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Students can only view their own profile
    if (user.role === 'student' && user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await db.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create student (admin only)
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const studentData = req.body;
    // Convert date strings to Date objects if needed
    if (studentData.dateOfBirth) {
      studentData.dateOfBirth = new Date(studentData.dateOfBirth);
    }
    if (studentData.enrollmentDate) {
      studentData.enrollmentDate = new Date(studentData.enrollmentDate);
    }
    const newStudent = await db.createStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: error.message || 'Failed to create student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const updates = req.body;

    // Students can only update their own profile
    if (user.role === 'student' && user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Convert date strings to Date objects if needed
    if (updates.dateOfBirth) {
      updates.dateOfBirth = new Date(updates.dateOfBirth);
    }
    if (updates.enrollmentDate) {
      updates.enrollmentDate = new Date(updates.enrollmentDate);
    }

    const updatedStudent = await db.updateStudent(id, updates);
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message || 'Failed to update student' });
  }
});

// Delete student (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteStudent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;

