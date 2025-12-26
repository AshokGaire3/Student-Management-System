import mongoose from 'mongoose';

const majorSchema = new mongoose.Schema({
  majorName: {
    type: String,
    required: true,
    trim: true
  },
  majorCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    default: ''
  },
  requiredCredits: {
    type: Number,
    required: true,
    min: 0
  },
  degreeType: {
    type: String,
    enum: ['Bachelor', 'Master', 'PhD'],
    default: 'Bachelor'
  }
}, {
  timestamps: true
});

export default mongoose.model('Major', majorSchema);


