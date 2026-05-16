const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Badge = require('../models/Badge');
const Certificate = require('../models/Certificate');

// @desc    Select domain for student
// @route   POST /api/progress/select-domain
exports.selectDomain = async (req, res) => {
  try {
    const { domainId } = req.body;
    const user = await User.findById(req.user._id);
    
    const domain = await Domain.findById(domainId);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });

    user.selectedDomain = domainId;
    user.currentPhase = 1;
    user.overallProgress = 0;
    user.completedTopics = [];
    user.startedTopics = [];
    user.testResults = [];

    // Increment enrolled count
    domain.enrolledCount = (domain.enrolledCount || 0) + 1;
    await domain.save();
    await user.save();

    res.json({ success: true, message: 'Domain selected', data: { selectedDomain: domain } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark topic as started
// @route   POST /api/progress/start-topic
exports.startTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyStarted = user.startedTopics.find(t => t.topicId.toString() === topicId);
    if (alreadyStarted) {
      return res.json({ success: true, message: 'Topic already started' });
    }

    user.startedTopics.push({ topicId, startedAt: new Date() });
    await user.save();

    res.json({ success: true, message: 'Topic started' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark topic as completed
// @route   POST /api/progress/complete-topic
exports.completeTopic = async (req, res) => {
  try {
    const { topicId, studyTimeMinutes, notes } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyCompleted = user.completedTopics.find(t => t.topicId.toString() === topicId);
    if (alreadyCompleted) {
      return res.json({ success: true, message: 'Topic already completed' });
    }

    user.completedTopics.push({
      topicId,
      completedAt: new Date(),
      studyTimeMinutes: studyTimeMinutes || 0,
      notes: notes || ''
    });

    // Update total study minutes and XP
    user.totalStudyMinutes += (studyTimeMinutes || 0);
    user.xp = (user.xp || 0) + 50;

    // Update activity log
    const today = new Date().toISOString().split('T')[0];
    const todayLog = user.activityLog.find(l => l.date === today);
    if (todayLog) {
      todayLog.minutes += (studyTimeMinutes || 0);
      todayLog.topicsCompleted += 1;
    } else {
      user.activityLog.push({ date: today, minutes: studyTimeMinutes || 0, topicsCompleted: 1 });
    }

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const hadActivityYesterday = user.activityLog.find(l => l.date === yesterday);
    if (user.lastActiveDate) {
      const lastActive = user.lastActiveDate.toISOString().split('T')[0];
      if (lastActive === yesterday) {
        user.dailyStreak += 1;
      } else if (lastActive !== today) {
        user.dailyStreak = 1;
      }
    } else {
      user.dailyStreak = 1;
    }
    user.lastActiveDate = new Date();

    // Calculate overall progress and auto-advance phase
    if (user.selectedDomain) {
      const totalTopicsInDomain = await Topic.countDocuments({ domainId: user.selectedDomain, isActive: true });
      user.overallProgress = totalTopicsInDomain > 0 ? Math.round((user.completedTopics.length / totalTopicsInDomain) * 100) : 0;

      // Check if current phase is complete
      const currentPhase = await Phase.findOne({ domainId: user.selectedDomain, phaseNumber: user.currentPhase });
      if (currentPhase) {
        const topicsInPhase = await Topic.find({ phaseId: currentPhase._id, isActive: true });
        const completedInPhase = user.completedTopics.filter(ct => 
          topicsInPhase.some(tp => tp._id.toString() === ct.topicId.toString())
        );

        if (completedInPhase.length === topicsInPhase.length && topicsInPhase.length > 0) {
          // Phase complete! Advance to next phase
          user.currentPhase += 1;
          user.xp = (user.xp || 0) + 500; // Bonus XP for phase completion
          
          // Award phase badge if exists
          const badge = await Badge.findOne({ phaseId: currentPhase._id });
          if (badge) {
            const alreadyEarned = user.earnedBadges.some(b => b.badgeId.toString() === badge._id.toString());
            if (!alreadyEarned) {
              user.earnedBadges.push({ badgeId: badge._id, earnedAt: new Date() });
            }
          }
        }
      }
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Topic completed', 
      data: { 
        overallProgress: user.overallProgress, 
        dailyStreak: user.dailyStreak 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment result
// @route   POST /api/progress/submit-assessment
exports.submitAssessment = async (req, res) => {
  try {
    const { assessmentId, score, passed } = req.body;
    const user = await User.findById(req.user._id);

    const existingAttempt = user.testResults.filter(t => t.assessmentId.toString() === assessmentId);
    
    user.testResults.push({
      assessmentId,
      score,
      passed,
      attemptedAt: new Date(),
      attemptNumber: existingAttempt.length + 1
    });

    // Update activity log
    const today = new Date().toISOString().split('T')[0];
    const todayLog = user.activityLog.find(l => l.date === today);
    if (todayLog && passed) {
      todayLog.assessmentsPassed += 1;
    } else if (passed) {
      user.activityLog.push({ date: today, minutes: 0, topicsCompleted: 0, assessmentsPassed: 1 });
    }

    await user.save();

    res.json({ success: true, message: passed ? 'Assessment passed!' : 'Keep trying!', data: { passed, score } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student dashboard data
// @route   GET /api/progress/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('selectedDomain')
      .populate('earnedBadges.badgeId')
      .populate('completedTopics.topicId')
      .populate('startedTopics.topicId');

    let currentPhaseData = null;
    let upcomingAssessment = null;

    if (user.selectedDomain) {
      currentPhaseData = await Phase.findOne({ 
        domainId: user.selectedDomain._id, 
        phaseNumber: user.currentPhase 
      });

      upcomingAssessment = await require('../models/Assessment').findOne({
        domainId: user.selectedDomain._id,
        isActive: true
      }).sort('order');
    }

    const testsPassed = user.testResults.filter(t => t.passed).length;
    const totalBadges = user.earnedBadges.length;

    res.json({
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          profile: user.profile,
          selectedDomain: user.selectedDomain,
          currentPhase: user.currentPhase,
          overallProgress: user.overallProgress,
          dailyStreak: user.dailyStreak,
          totalStudyMinutes: user.totalStudyMinutes,
          xp: user.xp || 0
        },
        currentPhaseData,
        upcomingAssessment,
        testsPassed,
        totalBadges,
        completedTopicsCount: user.completedTopics.length,
        activityLog: user.activityLog.slice(-365),
        recentActivity: user.completedTopics.slice(-5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get heatmap data
// @route   GET /api/progress/heatmap
exports.getHeatmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user.activityLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add study time
// @route   POST /api/progress/study-time
exports.addStudyTime = async (req, res) => {
  try {
    const { minutes } = req.body;
    const user = await User.findById(req.user._id);
    user.totalStudyMinutes += minutes;

    const today = new Date().toISOString().split('T')[0];
    const todayLog = user.activityLog.find(l => l.date === today);
    if (todayLog) {
      todayLog.minutes += minutes;
    } else {
      user.activityLog.push({ date: today, minutes, topicsCompleted: 0 });
    }

    await user.save();
    res.json({ success: true, message: 'Study time added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
