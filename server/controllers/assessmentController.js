const Assessment = require('../models/Assessment');

// @desc    Get assessments for a domain
exports.getAssessmentsByDomain = async (req, res) => {
  try {
    const assessments = await Assessment.find({ domainId: req.params.domainId, isActive: true })
      .populate('phaseId')
      .sort('order');
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate('phaseId')
      .populate('domainId')
      .sort('order');
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create assessment (admin)
exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update assessment (admin)
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete assessment (admin)
exports.deleteAssessment = async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
