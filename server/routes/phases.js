const express = require('express');
const router = express.Router();
const c = require('../controllers/phaseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/domain/:domainId', c.getPhasesByDomain);
router.get('/:id', c.getPhase);
router.post('/', protect, authorize('admin'), c.createPhase);
router.put('/:id', protect, authorize('admin'), c.updatePhase);
router.delete('/:id', protect, authorize('admin'), c.deletePhase);

module.exports = router;
