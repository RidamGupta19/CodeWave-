const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const urc = require('../controllers/userRoadmapController');

router.use(protect);
router.use(authorize('admin'));

router.post('/assign', urc.assignRoadmap);
router.put('/:userId', urc.updateRoadmap);
router.post('/reset/:userId', urc.resetRoadmap);
router.get('/:userId', urc.getRoadmap);

module.exports = router;
