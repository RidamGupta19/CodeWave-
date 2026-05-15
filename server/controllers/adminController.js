const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('selectedDomain');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assigned students (mentor)
exports.getAssignedStudents = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id);
    const students = await User.find({ assignedMentor: req.user._id })
      .select('-password')
      .populate('selectedDomain');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send feedback (mentor)
exports.sendFeedback = async (req, res) => {
  try {
    const { studentId, message, type } = req.body;
    const feedback = await Feedback.create({
      mentorId: req.user._id,
      studentId,
      message,
      type: type || 'feedback'
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get feedback for student
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.user._id })
      .populate('mentorId', 'fullName email')
      .sort('-createdAt');
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const Domain = require('../models/Domain');
    const totalDomains = await Domain.countDocuments();
    const Assessment = require('../models/Assessment');
    const totalAssessments = await Assessment.countDocuments();

    res.json({
      success: true,
      data: { totalUsers, totalStudents, totalMentors, totalDomains, totalAssessments }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
