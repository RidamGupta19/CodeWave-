const express = require('express');
const router = express.Router();
const c = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { checkFeature } = require('../middleware/featureFlagMiddleware');

router.use(protect);
router.use(checkFeature('ai_doubt_solver'));

router.post('/chat', c.chat);
router.post('/generate-roadmap', c.generateRoadmap);
router.get('/performance-insights', c.getPerformanceInsights);
router.get('/history', c.getChatHistory);
router.delete('/history', c.clearHistory);

module.exports = router;
