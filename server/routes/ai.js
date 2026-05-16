const express = require('express');
const router = express.Router();
const c = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, c.chat);
router.post('/generate-roadmap', protect, c.generateRoadmap);
router.get('/history', protect, c.getChatHistory);
router.delete('/history', protect, c.clearHistory);

module.exports = router;
