const UserRoadmap = require('../models/UserRoadmap');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Video = require('../models/Video');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

const getLevelName = (templateType, levelNum) => {
  const prefix = templateType.charAt(0).toUpperCase() + templateType.slice(1);
  const names = [
    'Introduction & Foundations',
    'Core Fundamentals',
    'Advanced Application',
    'Real-World Integration',
    'Capstones & Certifications'
  ];
  return `${prefix} Level ${levelNum}: ${names[levelNum] || 'Module'}`;
};

const getLevelDescription = (templateType, levelNum) => {
  const descs = [
    'Kickstart learning with the baseline concepts and primary materials.',
    'Dive into core topics and standard practical modules.',
    'Solve intermediate projects and tackle core assessments.',
    'Build advanced workflows and real-world system patterns.',
    'Test your skills with capstone challenges and certifications.'
  ];
  return descs[levelNum] || 'Custom learning modules.';
};

const generateTemplateConfig = async (courseId, templateType) => {
  const videos = await Video.find({ course: courseId, isActive: true }).sort({ order: 1, createdAt: 1 });
  const assessments = await Assessment.find({ course: courseId, isActive: true }).sort({ order: 1, createdAt: 1 });

  const levelsCount = 5;
  const config = [];

  for (let i = 0; i < levelsCount; i++) {
    config.push({
      levelNumber: i,
      name: getLevelName(templateType, i),
      description: getLevelDescription(templateType, i),
      videos: [],
      assessments: [],
      isLocked: i === 0 ? false : true
    });
  }

  // Partition videos
  if (videos.length > 0) {
    const chunkSize = Math.max(1, Math.ceil(videos.length / levelsCount));
    videos.forEach((video, idx) => {
      let targetLvl = Math.floor(idx / chunkSize);
      if (targetLvl >= levelsCount) targetLvl = levelsCount - 1;
      config[targetLvl].videos.push(video._id);
    });
  }

  // Partition assessments
  if (assessments.length > 0) {
    const chunkSize = Math.max(1, Math.ceil(assessments.length / levelsCount));
    assessments.forEach((assessment, idx) => {
      let targetLvl = Math.floor(idx / chunkSize);
      if (targetLvl >= levelsCount) targetLvl = levelsCount - 1;
      config[targetLvl].assessments.push(assessment._id);
    });
  }

  return config;
};

const recalculateRoadmapProgress = (roadmap) => {
  const watchedSet = new Set((roadmap.watchedVideos || []).map(id => id.toString()));
  const completedSet = new Set((roadmap.completedAssessments || []).map(id => id.toString()));

  roadmap.customRoadmapConfig.sort((a, b) => a.levelNumber - b.levelNumber);

  const completedLevels = [];
  const unlockedLevels = [0];

  let totalItems = 0;
  let completedItems = 0;

  for (let i = 0; i < roadmap.customRoadmapConfig.length; i++) {
    const lvl = roadmap.customRoadmapConfig[i];
    const lvlVideos = lvl.videos || [];
    const lvlAssessments = lvl.assessments || [];

    totalItems += lvlVideos.length + lvlAssessments.length;

    let lvlCompletedCount = 0;
    lvlVideos.forEach(vId => {
      if (watchedSet.has(vId.toString())) lvlCompletedCount++;
    });
    lvlAssessments.forEach(aId => {
      if (completedSet.has(aId.toString())) lvlCompletedCount++;
    });

    completedItems += lvlCompletedCount;

    const totalLvlItems = lvlVideos.length + lvlAssessments.length;
    // Empty levels are automatically considered completed so they do not block progress
    const isLvlCompleted = totalLvlItems === 0 || lvlCompletedCount === totalLvlItems;

    if (isLvlCompleted) {
      completedLevels.push(lvl.levelNumber);
      if (i + 1 < roadmap.customRoadmapConfig.length) {
        unlockedLevels.push(roadmap.customRoadmapConfig[i + 1].levelNumber);
      }
    }
  }

  const unlockedSet = new Set(unlockedLevels);
  roadmap.customRoadmapConfig.forEach(lvl => {
    lvl.isLocked = !unlockedSet.has(lvl.levelNumber);
  });

  roadmap.completedLevels = completedLevels;
  roadmap.unlockedLevels = unlockedLevels;
  roadmap.roadmapProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  roadmap.currentLevel = Math.max(...unlockedLevels, 0);
};

const createRoadmapForUser = async (userId, courseId, assignedBy, templateType = 'default') => {
  const config = await generateTemplateConfig(courseId, templateType);

  let passingPercentage = 70;
  if (templateType === 'beginner') passingPercentage = 60;
  else if (templateType === 'intermediate') passingPercentage = 70;
  else if (templateType === 'advanced') passingPercentage = 85;

  await UserRoadmap.deleteOne({ userId, courseId });

  const roadmap = new UserRoadmap({
    userId,
    courseId,
    assignedBy,
    templateType,
    customRoadmapConfig: config,
    passingPercentage,
    watchedVideos: [],
    completedAssessments: [],
    completedLevels: [],
    unlockedLevels: [0],
    roadmapProgress: 0,
    currentLevel: 0
  });

  await roadmap.save();
  return roadmap;
};

// @desc    Assign course and create fresh roadmap
// @route   POST /api/admin/roadmap/assign
exports.assignRoadmap = async (req, res) => {
  try {
    const { userId, studentId, courseId, templateType } = req.body;
    let resolvedUserId = userId;

    if (!resolvedUserId && studentId) {
      const stud = await Student.findById(studentId);
      if (stud) resolvedUserId = stud.userId;
    }

    if (!resolvedUserId || !courseId) {
      return res.status(400).json({ success: false, message: 'User ID and Course ID are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Update student's course assignment
    const student = await Student.findOneAndUpdate(
      { userId: resolvedUserId },
      { course: courseId },
      { new: true }
    );

    const roadmap = await createRoadmapForUser(resolvedUserId, courseId, req.user._id, templateType || 'default');

    res.json({
      success: true,
      message: 'Course and roadmap assigned successfully.',
      data: roadmap
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user's assigned roadmap
// @route   GET /api/admin/roadmap/:userId
exports.getRoadmap = async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmap = await UserRoadmap.findOne({ userId })
      .populate('customRoadmapConfig.videos')
      .populate('customRoadmapConfig.assessments')
      .populate('courseId');

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap assigned for this user.' });
    }

    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update/Customize roadmap configuration
// @route   PUT /api/admin/roadmap/:userId
exports.updateRoadmap = async (req, res) => {
  try {
    const { userId } = req.params;
    const { customRoadmapConfig, passingPercentage, templateType } = req.body;

    const roadmap = await UserRoadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found for this user.' });
    }

    if (customRoadmapConfig) {
      roadmap.customRoadmapConfig = customRoadmapConfig;
    }
    if (passingPercentage !== undefined) {
      roadmap.passingPercentage = passingPercentage;
    }
    if (templateType) {
      roadmap.templateType = templateType;
    }

    // Safely recalculate progress following structural modification
    recalculateRoadmapProgress(roadmap);
    await roadmap.save();

    const populated = await UserRoadmap.findById(roadmap._id)
      .populate('customRoadmapConfig.videos')
      .populate('customRoadmapConfig.assessments');

    res.json({
      success: true,
      message: 'Roadmap configuration updated successfully.',
      data: populated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reset roadmap progress
// @route   POST /api/admin/roadmap/reset/:userId
exports.resetRoadmap = async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmap = await UserRoadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    roadmap.watchedVideos = [];
    roadmap.completedAssessments = [];
    roadmap.completedLevels = [];
    roadmap.unlockedLevels = [0];
    roadmap.roadmapProgress = 0;
    roadmap.currentLevel = 0;

    // Reset lock states
    roadmap.customRoadmapConfig.forEach(lvl => {
      lvl.isLocked = lvl.levelNumber !== 0;
    });

    await roadmap.save();

    res.json({
      success: true,
      message: 'Roadmap progress reset successfully.',
      data: roadmap
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current student's roadmap
// @route   GET /api/roadmap/me
exports.getMyRoadmap = async (req, res) => {
  try {
    const roadmap = await UserRoadmap.findOne({ userId: req.user._id })
      .populate('customRoadmapConfig.videos')
      .populate('customRoadmapConfig.assessments')
      .populate('courseId');

    if (!roadmap) {
      // Fallback: If student has a course assigned but no roadmap document, provision one now
      const student = await Student.findOne({ userId: req.user._id });
      if (student && student.course) {
        const fresh = await createRoadmapForUser(req.user._id, student.course, null, 'default');
        const populated = await UserRoadmap.findById(fresh._id)
          .populate('customRoadmapConfig.videos')
          .populate('customRoadmapConfig.assessments')
          .populate('courseId');
        return res.json({ success: true, data: populated });
      }
      return res.status(404).json({ success: false, message: 'No roadmap active. Please contact support.' });
    }

    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Helper to synchronize video watches from video controllers
exports.syncVideoWatch = async (userId, videoId, isCompleted) => {
  try {
    const student = await Student.findOne({ userId });
    if (!student || !student.course) return;

    const roadmap = await UserRoadmap.findOne({ userId, courseId: student.course });
    if (!roadmap) return;

    const vIdStr = videoId.toString();
    const watchedIndex = roadmap.watchedVideos.findIndex(id => id.toString() === vIdStr);

    if (isCompleted && watchedIndex === -1) {
      roadmap.watchedVideos.push(videoId);
    } else if (!isCompleted && watchedIndex !== -1) {
      roadmap.watchedVideos.splice(watchedIndex, 1);
    }

    recalculateRoadmapProgress(roadmap);
    await roadmap.save();
  } catch (err) {
    console.error('Failed to sync video watch with UserRoadmap:', err.message);
  }
};

// Helper to synchronize assessment passes from attempt controllers
exports.syncAssessmentAttempt = async (userId, assessmentId, passed) => {
  try {
    const student = await Student.findOne({ userId });
    if (!student || !student.course) return;

    const roadmap = await UserRoadmap.findOne({ userId, courseId: student.course });
    if (!roadmap) return;

    const aIdStr = assessmentId.toString();
    const completedIndex = roadmap.completedAssessments.findIndex(id => id.toString() === aIdStr);

    if (passed && completedIndex === -1) {
      roadmap.completedAssessments.push(assessmentId);
    } else if (!passed && completedIndex !== -1) {
      roadmap.completedAssessments.splice(completedIndex, 1);
    }

    recalculateRoadmapProgress(roadmap);
    await roadmap.save();
  } catch (err) {
    console.error('Failed to sync assessment completion with UserRoadmap:', err.message);
  }
};

// Export internal functions for migrations
exports.generateTemplateConfig = generateTemplateConfig;
exports.createRoadmapForUser = createRoadmapForUser;
exports.recalculateRoadmapProgress = recalculateRoadmapProgress;
