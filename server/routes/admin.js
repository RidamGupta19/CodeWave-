const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), c.getAdminStats);
router.get('/users', protect, authorize('admin'), c.getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), c.updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), c.deleteUser);

// Mentor routes
router.get('/mentor/students', protect, authorize('mentor'), c.getAssignedStudents);
router.post('/mentor/feedback', protect, authorize('mentor'), c.sendFeedback);
router.get('/feedback/my', protect, c.getMyFeedback);

module.exports = router;
