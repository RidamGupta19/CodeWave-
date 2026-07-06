const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pc = require('../controllers/profileController');

router.use(protect);

router.get('/course', pc.getCourseDetails);
router.get('/batch', pc.getBatchDetails);
router.get('/schedule', pc.getScheduleDetails);

module.exports = router;
