const express = require('express');
const router = express.Router();
const c = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/select-domain', protect, c.selectDomain);
router.post('/start-topic', protect, c.startTopic);
router.post('/complete-topic', protect, c.completeTopic);
router.post('/submit-assessment', protect, c.submitAssessment);
router.post('/study-time', protect, c.addStudyTime);
router.get('/dashboard', protect, c.getDashboard);
router.get('/heatmap', protect, c.getHeatmap);

module.exports = router;
