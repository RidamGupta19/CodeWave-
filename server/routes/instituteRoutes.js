const express = require('express');
const router = express.Router();
const c = require('../controllers/instituteController');
const vc = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Unified endpoints protected by JWT authentication
router.use(protect);

// 1. Dashboard & Analytics Stats
router.get('/stats/admin', authorize('admin'), c.getAdminStats);
router.get('/dashboard/teacher', authorize('teacher'), c.getTeacherDashboard);
router.get('/dashboard/student', authorize('student'), c.getStudentDashboard);

// 2. Student CRUD
router.get('/students', authorize('admin', 'teacher'), c.getStudents);
router.post('/students', authorize('admin'), c.createStudent);
router.put('/students/:id', authorize('admin'), c.updateStudent);
router.delete('/students/:id', authorize('admin'), c.deleteStudent);

// 3. Teacher CRUD
router.get('/teachers', authorize('admin'), c.getTeachers);
router.post('/teachers', authorize('admin'), c.createTeacher);
router.put('/teachers/:id', authorize('admin'), c.updateTeacher);
router.delete('/teachers/:id', authorize('admin'), c.deleteTeacher);

// 4. Course CRUD
router.get('/courses', c.getCourses);
router.post('/courses', authorize('admin'), c.createCourse);
router.put('/courses/:id', authorize('admin'), c.updateCourse);
router.delete('/courses/:id', authorize('admin'), c.deleteCourse);

// 5. Batch CRUD
router.get('/batches', authorize('admin', 'teacher'), c.getBatches);
router.post('/batches', authorize('admin'), c.createBatch);
router.put('/batches/:id', authorize('admin'), c.updateBatch);
router.delete('/batches/:id', authorize('admin'), c.deleteBatch);

// 6. Attendance API
router.get('/attendance', c.getAttendance);
router.post('/attendance', authorize('admin', 'teacher'), c.markAttendance);
router.get('/attendance/my', authorize('student'), c.getStudentAttendanceStats);
router.get('/attendance/report', authorize('student'), c.getStudentAttendanceReport);

// 7. Fees API
router.get('/fees', c.getFees);
router.put('/fees/:id/pay', authorize('admin'), c.recordFeePayment);

// 8. Notice Board
router.get('/notices', c.getNotices);
router.post('/notices', authorize('admin'), c.createNotice);
router.delete('/notices/:id', authorize('admin'), c.deleteNotice);

// 9. Study Material
router.get('/materials', c.getStudyMaterials);
router.post('/materials', authorize('admin', 'teacher'), c.uploadStudyMaterial);
router.put('/materials/:id', authorize('admin', 'teacher'), c.updateStudyMaterial);
router.delete('/materials/:id', authorize('admin', 'teacher'), c.deleteStudyMaterial);
router.post('/materials/upload', authorize('admin', 'teacher'), uploadSingle('file'), c.uploadFile);
router.post('/materials/:id/download', c.trackDownload);

// 10. Class Scheduler
router.get('/schedules', c.getSchedules);
router.post('/schedules', authorize('admin', 'teacher'), c.createSchedule);
router.delete('/schedules/:id', authorize('admin', 'teacher'), c.deleteSchedule);

// 11. Assignments
router.get('/assignments', c.getAssignments);
router.post('/assignments', authorize('admin', 'teacher'), c.createAssignment);
router.post('/assignments/:id/submit', authorize('student'), c.submitAssignment);
router.put('/assignments/:id/grade', authorize('admin', 'teacher'), c.gradeAssignment);

// 12. Video Lectures
router.get('/videos', vc.getVideos);
router.post('/videos', authorize('admin', 'teacher'), vc.createVideo);
router.delete('/videos/:id', authorize('admin', 'teacher'), vc.deleteVideo);
router.get('/videos/progress', vc.getVideoProgress);
router.post('/videos/:id/progress', vc.saveVideoProgress);
router.post('/videos/:id/complete', vc.toggleVideoComplete);

// 13. Teacher Results
router.get('/results/teacher', authorize('teacher'), c.getTeacherStudentResults);

module.exports = router;
