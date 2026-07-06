const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const aac = require('../controllers/adminAllocationController');

router.use(protect);
router.use(authorize('admin'));

router.post('/course/assign', aac.assignCourse);
router.put('/course/update', aac.updateCourseAssignment);
router.delete('/course/remove', aac.removeCourse);

router.post('/batch/create', aac.createBatch);
router.put('/batch/update', aac.updateBatch);

router.put('/schedule/update', aac.updateSchedule);

module.exports = router;
