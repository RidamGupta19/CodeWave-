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
  updateTeacherProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

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


module.exports = router;
