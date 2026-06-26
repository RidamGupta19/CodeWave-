const express = require('express');
const router = express.Router();
const c = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/domain/:domainId', protect, c.getAssessmentsByDomain);
router.get('/:id/launch', protect, c.launchAssessment);
router.get('/', protect, authorize('admin'), c.getAllAssessments);
router.post('/', protect, authorize('admin'), c.createAssessment);
router.put('/:id', protect, authorize('admin'), c.updateAssessment);
router.delete('/:id', protect, authorize('admin'), c.deleteAssessment);

module.exports = router;
