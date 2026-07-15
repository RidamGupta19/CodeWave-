const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave', 'Holiday'],
    required: true,
    default: 'Present'
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Avoid duplicate attendance for a student on the same course, batch, and date
attendanceSchema.index({ studentId: 1, courseId: 1, batchId: 1, date: 1 }, { unique: true });

// Optimize query performance for batch roster loads, reports and date filtering
attendanceSchema.index({ batchId: 1, date: 1 });
attendanceSchema.index({ courseId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
