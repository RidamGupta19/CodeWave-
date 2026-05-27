const express = require('express');
const {
  getSubmissions,
  getMySubmissions,
  getSubmissionsByProblem,
  getSubmissionsByUser,
  createSubmission
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getSubmissions);
router.get('/my', protect, getMySubmissions);
router.get('/problem/:problemId', protect, getSubmissionsByProblem);
router.get('/user/:userId', protect, getSubmissionsByUser);
router.post('/', protect, createSubmission);

module.exports = router;
