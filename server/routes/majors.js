import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all majors
router.get('/', async (req, res) => {
  try {
    const majors = await db.getAllMajors();
    res.json(majors);
  } catch (error) {
    console.error('Error fetching majors:', error);
    res.status(500).json({ error: 'Failed to fetch majors' });
  }
});

// Get major by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const major = await db.getMajorById(id);
    if (!major) {
      return res.status(404).json({ error: 'Major not found' });
    }
    res.json(major);
  } catch (error) {
    console.error('Error fetching major:', error);
    res.status(500).json({ error: 'Failed to fetch major' });
  }
});

// Create major (admin only)
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const majorData = req.body;
    const newMajor = await db.createMajor(majorData);
    res.status(201).json(newMajor);
  } catch (error) {
    console.error('Error creating major:', error);
    res.status(500).json({ error: error.message || 'Failed to create major' });
  }
});

// Update major (admin only)
router.put('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedMajor = await db.updateMajor(id, updates);
    if (!updatedMajor) {
      return res.status(404).json({ error: 'Major not found' });
    }

    res.json(updatedMajor);
  } catch (error) {
    console.error('Error updating major:', error);
    res.status(500).json({ error: error.message || 'Failed to update major' });
  }
});

// Delete major (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteMajor(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Major not found' });
    }
    res.json({ message: 'Major deleted successfully' });
  } catch (error) {
    console.error('Error deleting major:', error);
    res.status(500).json({ error: 'Failed to delete major' });
  }
});

export default router;
