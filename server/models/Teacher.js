const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: '',
    trim: true
  },
  subjects: [{
    type: String,
    default: []
  }],
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default: []
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  qualification: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  salary: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
