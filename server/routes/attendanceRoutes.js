const express = require('express');
const router = express.Router();
const c = require('../controllers/instituteController');
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');

// Protect all routes with JWT authentication
router.use(protect);

// Helper middleware to restrict students to only their own attendance data
const restrictToOwnAttendance = async (req, res, next) => {
  if (req.user.role === 'student') {
    try {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student || student._id.toString() !== req.params.studentId) {
        return res.status(403).json({ success: false, message: 'Access denied. You can only view your own attendance records.' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  next();
};

// 1. Mark or update attendance logs (Admin / Teacher only)
router.post('/', authorize('admin', 'teacher'), c.markAttendance);

// 2. Update a single attendance log by ID (Admin / Teacher only)
router.put('/:id', authorize('admin', 'teacher'), c.updateAttendanceById);

// 3. Get student attendance report (Admin / Teacher / Authorized Student)
router.get('/student/:studentId', restrictToOwnAttendance, c.getAttendanceByStudent);

// 4. Get batch attendance logs (Admin / Teacher only)
router.get('/batch/:batchId', authorize('admin', 'teacher'), c.getAttendanceByBatch);

// 5. Get course attendance logs (Admin / Teacher only)
router.get('/course/:courseId', authorize('admin', 'teacher'), c.getAttendanceByCourse);

// 6. Get general aggregated attendance report (Admin / Teacher only)
router.get('/report', authorize('admin', 'teacher'), c.getGeneralAttendanceReport);

module.exports = router;
