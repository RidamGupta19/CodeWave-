const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const um = require('../controllers/userManagementController');
const cm = require('../controllers/courseManagementController');
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

// Course management routes
router.get('/courses', protect, authorize('admin'), cm.getCourses);
router.post('/courses', protect, authorize('admin'), checkPermission('manage_courses'), cm.createCourse);
router.put('/courses/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.updateCourse);
router.delete('/courses/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.deleteCourse);

// Subject management routes
router.get('/subjects', protect, authorize('admin'), cm.getSubjects);
router.post('/subjects', protect, authorize('admin'), checkPermission('manage_courses'), cm.createSubject);
router.put('/subjects/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.updateSubject);
router.delete('/subjects/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.deleteSubject);

// Batch management routes
router.get('/batches', protect, authorize('admin'), cm.getBatches);
router.post('/batches', protect, authorize('admin'), checkPermission('manage_courses'), cm.createBatch);
router.put('/batches/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.updateBatch);
router.delete('/batches/:id', protect, authorize('admin'), checkPermission('manage_courses'), cm.deleteBatch);
router.put('/batches/:id/assign', protect, authorize('admin'), checkPermission('manage_courses'), cm.assignBatchMembers);

// Mentor routes
router.get('/mentor/students', protect, authorize('mentor'), c.getAssignedStudents);
router.post('/mentor/feedback', protect, authorize('mentor'), c.sendFeedback);
router.get('/feedback/my', protect, c.getMyFeedback);

module.exports = router;
