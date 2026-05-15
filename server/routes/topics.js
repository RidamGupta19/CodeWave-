const express = require('express');
const router = express.Router();
const c = require('../controllers/topicController');
const { protect, authorize } = require('../middleware/auth');

router.get('/phase/:phaseId', c.getTopicsByPhase);
router.get('/all', protect, authorize('admin'), c.getAllTopics);
router.get('/:id', c.getTopic);
router.post('/', protect, authorize('admin'), c.createTopic);
router.put('/:id', protect, authorize('admin'), c.updateTopic);
router.delete('/:id', protect, authorize('admin'), c.deleteTopic);

module.exports = router;
