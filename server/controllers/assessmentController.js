const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Domain = require('../models/Domain');
const Student = require('../models/Student');

const getProgressKey = (slug) => {
  if (!slug) return 'dsa';
  const lowercaseSlug = slug.toLowerCase();
  if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
  if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
  if (lowercaseSlug === 'devops') return 'devops';
  if (lowercaseSlug === 'dsa') return 'dsa';
  return 'dsa';
};

// @desc    Get assessments for a domain
exports.getAssessmentsByDomain = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.domainId);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });

    let query = { domainId: req.params.domainId, isActive: true };

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) {
        return res.status(403).json({ success: false, message: 'Student profile not found. Unauthorized access.' });
      }
      query.isPublished = true;
      query.course = student.course;
      query.batch = student.batch;
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } }
      ];
    }

    const assessments = await Assessment.find(query)
      .populate('phaseId')
      .sort('order');

    const user = await User.findById(req.user._id);
    const key = getProgressKey(domain.slug);
    const completedTopicIds = user?.domainsProgress?.[key]?.completedTopics?.map(t => t.topicId.toString()) || [];

    const assessmentsWithStatus = [];
    for (const ass of assessments) {
      let isLevelCompleted = false;
      let totalTopics = 0;
      let completedTopicsCount = 0;

      if (ass.phaseId) {
        const phaseId = ass.phaseId._id || ass.phaseId;
        const topics = await Topic.find({ phaseId, isActive: true });
        totalTopics = topics.length;
        if (totalTopics > 0) {
          const completedInPhase = topics.filter(t => completedTopicIds.includes(t._id.toString()));
          completedTopicsCount = completedInPhase.length;
          isLevelCompleted = completedTopicsCount === totalTopics;
        } else {
          isLevelCompleted = true;
        }
      } else {
        isLevelCompleted = true;
      }

      assessmentsWithStatus.push({
        ...ass.toObject(),
        isLevelCompleted,
        totalTopics,
        completedTopicsCount
      });
    }

    res.json({ success: true, data: assessmentsWithStatus });
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

// @desc    Launch assessment (validation and secure redirect link)
// @route   GET /api/assessments/:id/launch
exports.launchAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    if (!assessment.isActive || !assessment.isPublished) {
      return res.status(400).json({ success: false, message: 'Assessment is not active or published.' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(403).json({ success: false, message: 'Unauthorized access. Student profile not found.' });
    }

    if (!assessment.course || assessment.course.toString() !== student.course?.toString()) {
      return res.status(400).json({ success: false, message: 'Assessment not assigned: This assessment belongs to a different course.' });
    }

    if (!assessment.batch || assessment.batch.toString() !== student.batch?.toString()) {
      return res.status(400).json({ success: false, message: 'Assessment not assigned: This assessment belongs to a different batch.' });
    }

    if (assessment.expiresAt && new Date() > assessment.expiresAt) {
      return res.status(400).json({ success: false, message: 'Assessment is expired and no longer accepting launches.' });
    }

    res.json({
      success: true,
      data: {
        assessmentLink: assessment.assessmentLink
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
