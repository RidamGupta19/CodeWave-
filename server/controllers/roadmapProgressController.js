const RoadmapProgress = require('../models/RoadmapProgress');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const Assessment = require('../models/Assessment');

/**
 * Recalculate student progression state and update RoadmapProgress in the DB.
 */
const recalculateProgress = async (studentId, courseId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student profile not found');

  const course = await Course.findById(courseId).populate('subjects');
  if (!course) throw new Error('Course not found');

  // Find or create RoadmapProgress document
  let progress = await RoadmapProgress.findOne({ student: student._id, course: course._id });
  if (!progress) {
    progress = new RoadmapProgress({
      student: student._id,
      user: student.userId,
      course: course._id,
      subjectProgress: [],
      assessmentStatus: [],
      passingPercentage: 70
    });
  }

  // 1. Get all active videos for this course
  const videoQuery = {
    course: course._id,
    isActive: true
  };
  if (student.batch) {
    videoQuery.$or = [
      { batch: student.batch },
      { batch: { $exists: false } },
      { batch: null }
    ];
  }
  const videos = await Video.find(videoQuery);

  // 2. Get all completed video progress logs for this student
  const videoProgresses = await VideoProgress.find({ user: student.userId });
  const completedVideoIds = new Set(
    videoProgresses.filter(p => p.isCompleted).map(p => p.video.toString())
  );

  // 3. Get all published assessments for this course
  const assessmentQuery = {
    course: course._id,
    isActive: true,
    isPublished: true
  };
  if (student.batch) {
    assessmentQuery.$or = [
      { batch: student.batch },
      { batch: { $exists: false } },
      { batch: null }
    ];
  }
  const assessments = await Assessment.find(assessmentQuery);

  // 4. Update assessments in the progress document (without losing past attempt history)
  const updatedAssessmentStatus = [];
  for (const ass of assessments) {
    let existingStatus = progress.assessmentStatus.find(
      s => s.assessmentId.toString() === ass._id.toString()
    );
    if (!existingStatus) {
      existingStatus = {
        assessmentId: ass._id,
        subjectName: ass.subject || '',
        isUnlocked: false,
        isPassed: false,
        bestScore: 0,
        attemptsCount: 0,
        attempts: []
      };
    } else {
      // Keep subjectName updated in case it changed
      existingStatus.subjectName = ass.subject || '';
    }
    updatedAssessmentStatus.push(existingStatus);
  }
  progress.assessmentStatus = updatedAssessmentStatus;

  // 5. Update subject progress and compute lock status sequentially
  const subjectsList = course.subjects || [];
  const updatedSubjectProgress = [];

  for (let i = 0; i < subjectsList.length; i++) {
    const subject = subjectsList[i];
    const subjectName = subject.subjectName;

    // Filter videos by subject
    const subjectVideos = videos.filter(v => v.subject === subjectName);
    let completionPercentage = 0;
    let isCompleted = false;

    if (subjectVideos.length === 0) {
      // If there are no videos for this subject, default to completed
      completionPercentage = 100;
      isCompleted = true;
    } else {
      const completedCount = subjectVideos.filter(v => completedVideoIds.has(v._id.toString())).length;
      completionPercentage = Math.min(100, Math.round((completedCount / subjectVideos.length) * 100));
      isCompleted = completionPercentage === 100;
    }

    // Determine subject lock status
    let isUnlocked = false;
    if (i === 0) {
      isUnlocked = true; // The first module/subject is unlocked by default
    } else {
      // Subsequent subject is unlocked if the previous subject's assessments are passed.
      const prevSubjectName = subjectsList[i - 1].subjectName;
      const prevAssessments = progress.assessmentStatus.filter(a => a.subjectName === prevSubjectName);

      if (prevAssessments.length === 0) {
        // If the previous subject had no assessments, unlock if the previous subject's lectures are complete
        const prevSubProg = updatedSubjectProgress.find(p => p.subjectName === prevSubjectName);
        isUnlocked = prevSubProg ? prevSubProg.isCompleted : false;
      } else {
        // Must pass ALL assessments associated with the previous subject
        isUnlocked = prevAssessments.every(a => a.isPassed);
      }
    }

    updatedSubjectProgress.push({
      subjectName,
      isUnlocked,
      isCompleted,
      completionPercentage
    });
  }
  progress.subjectProgress = updatedSubjectProgress;

  // 6. Update assessment lock status based on subject unlock state and lecture completion
  for (const status of progress.assessmentStatus) {
    const subProg = progress.subjectProgress.find(sp => sp.subjectName === status.subjectName);
    if (subProg) {
      // Unlocked if the parent subject module is unlocked AND its lectures are 100% completed
      status.isUnlocked = subProg.isUnlocked && subProg.isCompleted;
    } else {
      status.isUnlocked = false;
    }
  }

  await progress.save();
  return progress;
};

// @desc    Get current student's roadmap progression
// @route   GET /api/roadmap-progress/my
// @access  Private (Student only)
exports.getMyProgress = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (!student.course) {
      return res.status(400).json({ success: false, message: 'No course assigned to this student.' });
    }

    const progress = await recalculateProgress(student._id, student.course);
    
    // Populate assessment details for response readability
    const populatedProgress = await RoadmapProgress.findById(progress._id)
      .populate('assessmentStatus.assessmentId');

    res.json({ success: true, data: populatedProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment attempt and update progress state
// @route   POST /api/roadmap-progress/submit-attempt
// @access  Private (Student only)
exports.submitAssessmentAttempt = async (req, res) => {
  try {
    const { assessmentId, score } = req.body;
    if (!assessmentId || score === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide assessmentId and score.' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    let progress = await RoadmapProgress.findOne({ student: student._id, course: student.course });
    if (!progress) {
      progress = await recalculateProgress(student._id, student.course);
    }

    // Find assessment status
    const statusIndex = progress.assessmentStatus.findIndex(
      s => s.assessmentId.toString() === assessmentId.toString()
    );

    if (statusIndex === -1) {
      return res.status(404).json({ success: false, message: 'Assessment not found in your course roadmap.' });
    }

    const status = progress.assessmentStatus[statusIndex];
    if (!status.isUnlocked) {
      return res.status(400).json({ success: false, message: 'This assessment is locked. Complete all lectures first.' });
    }

    const numericScore = Number(score);
    const passed = numericScore >= progress.passingPercentage;

    // Log attempt
    status.attemptsCount += 1;
    status.bestScore = Math.max(status.bestScore, numericScore);
    status.attempts.push({
      score: numericScore,
      passed,
      attemptedAt: new Date()
    });

    if (passed) {
      status.isPassed = true;
    }

    await progress.save();

    // Sync assessment result with UserRoadmap
    try {
      const { syncAssessmentAttempt } = require('./userRoadmapController');
      await syncAssessmentAttempt(req.user._id, assessmentId, passed);
    } catch (e) {
      console.error('Failed to sync assessment with UserRoadmap:', e.message);
    }

    // Recalculate progression downstream
    const updatedProgress = await recalculateProgress(student._id, student.course);
    const populatedProgress = await RoadmapProgress.findById(updatedProgress._id)
      .populate('assessmentStatus.assessmentId');

    res.json({
      success: true,
      message: passed ? 'Congratulations! You passed the assessment and unlocked the next module!' : 'Assessment attempted. Score below passing threshold.',
      passed,
      data: populatedProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Configure passing percentage for a student's progress tracker
// @route   PUT /api/roadmap-progress/configure-passing
// @access  Private (Admin/Teacher only)
exports.adminConfigurePassingPercentage = async (req, res) => {
  try {
    const { studentId, passingPercentage } = req.body;
    if (!studentId || passingPercentage === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide studentId and passingPercentage.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    let progress = await RoadmapProgress.findOne({ student: student._id, course: student.course });
    if (!progress) {
      progress = await recalculateProgress(student._id, student.course);
    }

    progress.passingPercentage = Number(passingPercentage);
    await progress.save();

    // Recalculate progress to adjust pass/fail statuses based on new threshold
    for (const status of progress.assessmentStatus) {
      status.isPassed = status.bestScore >= progress.passingPercentage;
    }
    await progress.save();

    const updatedProgress = await recalculateProgress(student._id, student.course);
    const populatedProgress = await RoadmapProgress.findById(updatedProgress._id)
      .populate('assessmentStatus.assessmentId');

    res.json({ success: true, message: 'Passing percentage updated successfully.', data: populatedProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Reset roadmap progress for a student
// @route   POST /api/roadmap-progress/reset
// @access  Private (Admin/Teacher only)
exports.adminResetProgress = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Please provide studentId.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // 1. Delete RoadmapProgress document
    await RoadmapProgress.deleteOne({ student: student._id, course: student.course });

    // 2. Clear all VideoProgress documents for this student
    await VideoProgress.deleteMany({ user: student.userId });

    // 3. Initialize fresh progress
    const freshProgress = await recalculateProgress(student._id, student.course);
    const populatedProgress = await RoadmapProgress.findById(freshProgress._id)
      .populate('assessmentStatus.assessmentId');

    res.json({ success: true, message: 'Roadmap and lecture watching progress reset successfully.', data: populatedProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get student roadmap metrics
// @route   GET /api/roadmap-progress/student/:studentId
// @access  Private (Admin/Teacher only)
exports.adminGetStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const progress = await recalculateProgress(student._id, student.course);
    const populatedProgress = await RoadmapProgress.findById(progress._id)
      .populate('assessmentStatus.assessmentId');

    res.json({ success: true, data: populatedProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export helper for use in video progress changes
exports.recalculateProgress = recalculateProgress;
