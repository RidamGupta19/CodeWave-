const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const urc = require('../controllers/userRoadmapController');

router.use(protect);

router.get('/me', authorize('student'), urc.getMyRoadmap);

module.exports = router;
