const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
