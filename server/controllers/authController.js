const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: email === 'omshivhare666@gmail.com' ? 'admin' : (role === 'admin' ? 'student' : (role || 'student')) // Grant admin only to specific email
    });

    const token = user.generateToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ success: false, message: `Your account is ${user.status}. Please contact the administrator.` });
    }

    // Force admin approval for specific email
    if (user.email === 'omshivhare666@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = user.generateToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        activeDomain: user.activeDomain,
        selectedDomain: user.activeDomain,
        domainsProgress: user.domainsProgress,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('activeDomain')
      .populate('earnedBadges.badgeId')
      .populate('assignedMentor', 'fullName email');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile (consolidated)
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar, profile } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    
    if (profile) {
      user.profile = { 
        ...(user.profile?.toObject ? user.profile.toObject() : (user.profile || {})), 
        ...profile 
      };
      
      const p = user.profile;
      if (profile.isProfileComplete !== undefined) {
        user.profile.isProfileComplete = profile.isProfileComplete;
      } else {
        user.profile.isProfileComplete = !!(p.currentSkillLevel && p.goal);
      }
    }

    await user.save();

    // Sync student details if student document exists
    if (user.role === 'student') {
      const Student = require('../models/Student');
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        if (fullName) student.fullName = fullName;
        if (phone !== undefined) student.phone = phone;
        if (avatar !== undefined) student.profilePhoto = avatar;
        await student.save();
      }
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        profile: user.profile,
        currentPhase: user.currentPhase,
        overallProgress: user.overallProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student profile details
// @route   GET /api/auth/student-profile
// @access  Private (student only)
exports.getStudentProfile = async (req, res) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ userId: req.user._id })
      .populate('course')
      .populate({
        path: 'batch',
        populate: { path: 'assignedTeacher' }
      });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const user = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      data: {
        user,
        student
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile details
// @route   PUT /api/auth/student-profile
// @access  Private (student only)
exports.updateStudentProfile = async (req, res) => {
  try {
    const { fullName, phone, address, parentName, parentPhone, parentEmail, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const Student = require('../models/Student');
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    if (fullName) student.fullName = fullName;
    if (phone !== undefined) student.phone = phone;
    if (address !== undefined) student.address = address;
    if (parentName !== undefined) student.parentName = parentName;
    if (parentPhone !== undefined) student.parentPhone = parentPhone;
    if (parentEmail !== undefined) student.parentEmail = parentEmail;
    if (avatar !== undefined) student.profilePhoto = avatar;
    await student.save();

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role
        },
        student
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide old and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Login/Signup
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { email, fullName, avatar } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for Google Sign-In' });
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user if not exists
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user = await User.create({
        fullName: fullName || email.split('@')[0],
        email,
        password: randomPassword,
        role: 'student',
        avatar: avatar || ''
      });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        activeDomain: user.activeDomain,
        selectedDomain: user.activeDomain,
        domainsProgress: user.domainsProgress,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get teacher profile details
// @route   GET /api/auth/teacher-profile
// @access  Private (teacher only)
exports.getTeacherProfile = async (req, res) => {
  try {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user._id });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const user = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      data: {
        user,
        teacher
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update teacher profile details
// @route   PUT /api/auth/teacher-profile
// @access  Private (teacher only)
exports.updateTeacherProfile = async (req, res) => {
  try {
    const { fullName, phone, subject, qualification, experience, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    if (fullName) teacher.name = fullName;
    if (phone !== undefined) teacher.phone = phone;
    if (subject !== undefined) teacher.subject = subject;
    if (qualification !== undefined) teacher.qualification = qualification;
    if (experience !== undefined) teacher.experience = experience;
    await teacher.save();

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role
        },
        teacher
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

