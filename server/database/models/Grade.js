import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
  },
  points: {
    type: Number,
    required: true,
    min: 0,
    max: 4
  },
  dateAssigned: {
    type: Date,
    required: true,
    default: Date.now
  },
  assignment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
gradeSchema.index({ studentId: 1, courseId: 1 });

export default mongoose.model('Grade', gradeSchema);


