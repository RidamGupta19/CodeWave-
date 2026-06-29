const express = require('express');
const router = express.Router();
const { 
  getMyActivity, 
  getActivitySummary, 
  getAdminUsersActivity, 
  getUserActivityDetail, 
  heartbeat, 
  endSession 
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

// User specific activity tracking
router.get('/activity/me', protect, getMyActivity);
router.get('/activity/summary', protect, getActivitySummary);
router.post('/activity/heartbeat', protect, heartbeat);
router.post('/activity/session/end', protect, endSession);

// Admin specific activity tracking
router.get('/admin/activity/users', protect, authorize('admin'), getAdminUsersActivity);
router.get('/admin/activity/:userId', protect, authorize('admin'), getUserActivityDetail);

module.exports = router;
