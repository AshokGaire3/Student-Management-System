import mongoose from 'mongoose';

const majorChangeRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  currentMajorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  requestedMajorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  reviewDate: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  adminComments: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('MajorChangeRequest', majorChangeRequestSchema);


