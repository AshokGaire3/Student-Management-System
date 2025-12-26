import express from 'express';
import db from '../database/database.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all major change requests
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    let requests = await db.getAllMajorChangeRequests();

    // Students can only see their own requests
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (studentRecord) {
        requests = requests.filter(r => r.studentId.toString() === studentRecord._id.toString());
      } else {
        requests = [];
      }
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching major change requests:', error);
    res.status(500).json({ error: 'Failed to fetch major change requests' });
  }
});

// Get major change request by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const request = await db.getMajorChangeRequestById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Students can only view their own requests
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord || request.studentId.toString() !== studentRecord._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Create major change request
router.post('/', async (req, res) => {
  try {
    const user = req.user;
    const { currentMajorId, requestedMajorId, reason } = req.body;

    // Find student ID if user is student
    let studentId = req.body.studentId;
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord) {
        return res.status(404).json({ error: 'Student record not found' });
      }
      studentId = studentRecord._id.toString();
    }

    // Students can only create requests for themselves
    if (user.role === 'student' && req.body.studentId && req.body.studentId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!currentMajorId || !requestedMajorId || !reason) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Check if student exists
    const student = await db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if there's already a pending request
    const allRequests = await db.getAllMajorChangeRequests();
    const pendingRequest = allRequests.find(r => 
      r.studentId.toString() === studentId && r.status === 'pending'
    );

    if (pendingRequest) {
      return res.status(400).json({ error: 'You already have a pending major change request' });
    }

    const requestData = {
      studentId,
      currentMajorId,
      requestedMajorId,
      reason,
      status: 'pending',
      requestDate: new Date()
    };

    const newRequest = await db.createMajorChangeRequest(requestData);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: error.message || 'Failed to create request' });
  }
});

// Review major change request (admin only)
router.put('/:id/review', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComments } = req.body;

    if (!status || !['approved', 'denied'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const request = await db.getMajorChangeRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const updates = {
      status,
      reviewDate: new Date(),
      reviewedBy: req.user.id,
      adminComments: adminComments || ''
    };

    const updatedRequest = await db.updateMajorChangeRequest(id, updates);

    // If approved, update student's major
    if (status === 'approved') {
      await db.updateStudent(request.studentId.toString(), {
        majorId: request.requestedMajorId
      });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error reviewing request:', error);
    res.status(500).json({ error: error.message || 'Failed to review request' });
  }
});

// Delete major change request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const request = await db.getMajorChangeRequestById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Students can only delete their own pending requests
    if (user.role === 'student') {
      const students = await db.getAllStudents();
      const studentRecord = students.find(s => s.email === user.email);
      if (!studentRecord || request.studentId.toString() !== studentRecord._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ error: 'Can only delete pending requests' });
      }
    }

    const deleted = await db.deleteMajorChangeRequest(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

export default router;
