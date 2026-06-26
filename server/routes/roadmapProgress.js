const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pc = require('../controllers/roadmapProgressController');

// All routes are protected by JWT authentication
router.use(protect);

// Student endpoints
router.get('/my', authorize('student'), pc.getMyProgress);
router.post('/submit-attempt', authorize('student'), pc.submitAssessmentAttempt);

// Administrative endpoints
router.put('/configure-passing', authorize('admin', 'teacher'), pc.adminConfigurePassingPercentage);
router.post('/reset', authorize('admin', 'teacher'), pc.adminResetProgress);
router.get('/student/:studentId', authorize('admin', 'teacher'), pc.adminGetStudentProgress);

module.exports = router;
