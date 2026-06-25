const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  timing: {
    type: String,
    required: true,
    trim: true
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  capacity: {
    type: Number,
    default: 30
  },
  academicSession: {
    type: String,
    default: '2026-2027'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
