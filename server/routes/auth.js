const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  googleLogin,
  getStudentProfile,
  updateStudentProfile,
  changePassword,
  getTeacherProfile,
  updateTeacherProfile,
  uploadAvatar
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatarSingle } = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.get('/student-profile', protect, getStudentProfile);
router.put('/student-profile', protect, updateStudentProfile);
router.get('/teacher-profile', protect, getTeacherProfile);
router.put('/teacher-profile', protect, updateTeacherProfile);
router.put('/change-password', protect, changePassword);

// Secure avatar upload route
router.post('/upload-avatar', protect, uploadAvatarSingle('avatar'), uploadAvatar);

module.exports = router;
