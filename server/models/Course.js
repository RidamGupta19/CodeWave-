const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  fees: {
    type: Number,
    required: true,
    default: 0
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
