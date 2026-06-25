const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const um = require('../controllers/userManagementController');
const { protect, authorize, checkPermission } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), c.getAdminStats);
router.get('/users', protect, authorize('admin'), c.getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), c.updateUserRole);
router.put('/users/:id/progress', protect, authorize('admin'), c.updateUserProgress);
router.delete('/users/:id', protect, authorize('admin'), c.deleteUser);

// Student management routes
router.get('/users/students', protect, authorize('admin'), checkPermission('manage_students'), um.getStudents);
router.post('/users/students', protect, authorize('admin'), checkPermission('manage_students'), um.createStudent);
router.put('/users/students/:id', protect, authorize('admin'), checkPermission('manage_students'), um.updateStudent);
router.delete('/users/students/:id', protect, authorize('admin'), checkPermission('manage_students'), um.deleteStudent);
router.put('/users/students/:id/status', protect, authorize('admin'), checkPermission('manage_students'), um.toggleStudentStatus);
router.put('/users/students/:id/reset-password', protect, authorize('admin'), checkPermission('manage_students'), um.resetStudentPassword);
router.post('/users/students/import', protect, authorize('admin'), checkPermission('manage_students'), um.importStudents);

// Teacher management routes
router.get('/users/teachers', protect, authorize('admin'), checkPermission('manage_teachers'), um.getTeachers);
router.post('/users/teachers', protect, authorize('admin'), checkPermission('manage_teachers'), um.createTeacher);
router.put('/users/teachers/:id', protect, authorize('admin'), checkPermission('manage_teachers'), um.updateTeacher);
router.delete('/users/teachers/:id', protect, authorize('admin'), checkPermission('manage_teachers'), um.deleteTeacher);
router.put('/users/teachers/:id/assign', protect, authorize('admin'), checkPermission('manage_teachers'), um.assignTeacherBatchesAndSubjects);
router.put('/users/teachers/:id/status', protect, authorize('admin'), checkPermission('manage_teachers'), um.toggleTeacherStatus);

// Sub-admin management routes
router.get('/users/sub-admins', protect, authorize('admin'), checkPermission('manage_subadmins'), um.getSubAdmins);
router.post('/users/sub-admins', protect, authorize('admin'), checkPermission('manage_subadmins'), um.createSubAdmin);
router.put('/users/sub-admins/:id', protect, authorize('admin'), checkPermission('manage_subadmins'), um.updateSubAdmin);
router.delete('/users/sub-admins/:id', protect, authorize('admin'), checkPermission('manage_subadmins'), um.deleteSubAdmin);

// Bulk actions & Export routes
router.post('/users/bulk-action', protect, authorize('admin'), um.bulkAction);
router.get('/users/export', protect, authorize('admin'), um.exportData);

// Mentor routes
router.get('/mentor/students', protect, authorize('mentor'), c.getAssignedStudents);
router.post('/mentor/feedback', protect, authorize('mentor'), c.sendFeedback);
router.get('/feedback/my', protect, c.getMyFeedback);

module.exports = router;
