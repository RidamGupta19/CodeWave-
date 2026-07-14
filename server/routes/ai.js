const express = require('express');
const router = express.Router();
const c = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { checkFeature } = require('../middleware/featureFlagMiddleware');

router.use(protect);

// generate-roadmap does not require ai_doubt_solver because it is a core onboarding feature
router.post('/generate-roadmap', c.generateRoadmap);

// The remaining AI routes do require the ai_doubt_solver feature flag
router.post('/chat', checkFeature('ai_doubt_solver'), c.chat);
router.get('/performance-insights', checkFeature('ai_doubt_solver'), c.getPerformanceInsights);
router.get('/history', checkFeature('ai_doubt_solver'), c.getChatHistory);
router.delete('/history', checkFeature('ai_doubt_solver'), c.clearHistory);

module.exports = router;
