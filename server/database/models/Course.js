import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer', 'Winter'],
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  enrolledStudents: {
    type: Number,
    default: 0,
    min: 0
  },
  maxStudents: {
    type: Number,
    required: true,
    min: 1
  },
  majorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  description: {
    type: String,
    default: ''
  },
  schedule: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);


