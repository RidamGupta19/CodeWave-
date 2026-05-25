const express = require('express');
const router = express.Router();
const c = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/select-domain', protect, c.selectDomain);
router.post('/start-topic', protect, c.startTopic);
router.post('/complete-topic', protect, c.completeTopic);
router.post('/submit-assessment', protect, c.submitAssessment);
router.post('/study-time', protect, c.addStudyTime);
router.post('/submit-code', protect, c.submitCode);
router.get('/submissions/:topicId', protect, c.getSubmissions);
router.get('/dashboard', protect, c.getDashboard);
router.get('/heatmap', protect, c.getHeatmap);
router.post('/skip-phase', protect, c.skipPhase);

module.exports = router;
