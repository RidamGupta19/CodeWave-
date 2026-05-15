const express = require('express');
const router = express.Router();
const c = require('../controllers/badgeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/domain/:domainId', c.getBadgesByDomain);
router.get('/', c.getAllBadges);
router.post('/', protect, authorize('admin'), c.createBadge);
router.put('/:id', protect, authorize('admin'), c.updateBadge);
router.delete('/:id', protect, authorize('admin'), c.deleteBadge);

module.exports = router;
