const express = require('express');
const router = express.Router();
const c = require('../controllers/adminSettingsController');
const { protect, authorize, checkPermission } = require('../middleware/auth');

// All settings routes require JWT authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Base Settings
router.get('/', c.getSettings);

// Sub-Tab settings configuration updates
router.put('/profile', checkPermission('manage_settings'), c.updateProfile);
router.put('/academic', checkPermission('manage_settings'), c.updateAcademic);
router.put('/auth', checkPermission('manage_settings'), c.updateAuth);
router.put('/storage', checkPermission('manage_settings'), c.updateStorage);
router.put('/smtp', checkPermission('manage_settings'), c.updateSMTP);
router.post('/smtp/test', checkPermission('manage_settings'), c.testSMTP);
router.put('/alerts', checkPermission('manage_settings'), c.updateAlerts);
router.put('/system', checkPermission('manage_settings'), c.updateSystem);

// Storage utilities
router.get('/storage/analytics', c.getStorageAnalytics);
router.post('/storage/cleanup', checkPermission('manage_settings'), c.cleanupStorage);

// Audit Logging
router.get('/audit-logs', c.getAuditLogs);

// Role-Based Permissions
router.get('/permissions', c.getPermissions);
router.put('/permissions', checkPermission('manage_settings'), c.updatePermissions);

// Session Management
router.get('/sessions', c.getActiveSessions);
router.post('/sessions/terminate', checkPermission('manage_settings'), c.terminateSession);
router.post('/sessions/terminate-all', checkPermission('manage_settings'), c.terminateAllSessions);

module.exports = router;
