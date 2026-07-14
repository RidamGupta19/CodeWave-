const express = require('express');
const router = express.Router();
const fc = require('../controllers/featureController');
const { protect, authorize } = require('../middleware/auth');

// Super Admin access check middleware
const isSuperAdmin = (req, res, next) => {
  if (req.user && (req.user.isSuperAdmin || req.user.email === 'admin@codewavesolution.com' || req.user.email === 'omshivhare666@gmail.com')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Only Super Admin can change feature status.'
  });
};

// Public/student-accessible endpoint to synchronize feature states
router.get('/feature-flags', protect, fc.getFeatureFlags);

// Admin-only endpoints
router.get('/admin/feature-flags/logs', protect, authorize('admin'), fc.getFeatureAuditLogs);
router.put('/admin/feature-flags/bulk', protect, authorize('admin'), isSuperAdmin, fc.bulkUpdateFeatureFlags);
router.put('/admin/feature-flags/:featureKey', protect, authorize('admin'), isSuperAdmin, fc.updateFeatureFlag);

module.exports = router;
