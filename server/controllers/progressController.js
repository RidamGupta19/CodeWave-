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
    const { topicId, studyTimeMinutes, notes, difficultyFeedback, confidenceLevel, revisionNeeded } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyCompleted = user.completedTopics.find(t => t.topicId.toString() === topicId);
    if (alreadyCompleted) {
      return res.json({ success: true, message: 'Topic already completed' });
    }

    user.completedTopics.push({
      topicId,
      completedAt: new Date(),
      studyTimeMinutes: studyTimeMinutes || 0,
      notes: notes || '',
      difficultyFeedback,
      confidenceLevel,
      revisionNeeded: !!revisionNeeded
    });

    // Update DSA Stats if applicable
    if (difficultyFeedback && difficultyFeedback !== 'unsolved') {
      user.dsaStats.totalProblemsSolved += 1;
      user.dsaStats.lastSolvedAt = new Date();
      
      // Update streak if it's a new day
      const today = new Date().toISOString().split('T')[0];
      const lastSolved = user.dsaStats.lastSolvedAt ? user.dsaStats.lastSolvedAt.toISOString().split('T')[0] : null;
      
      if (lastSolved !== today) {
        // Streak logic is already handled globally, but we can add DSA specific streak if needed
      }
    }

    // Update total study minutes and XP with Streak Multiplier
    let xpGain = 50;
    if (user.dailyStreak >= 30) {
      xpGain = 100; // Master Multiplier
    } else if (user.dailyStreak >= 7) {
      xpGain = 75; // Dedicated Multiplier
    }
    
    user.totalStudyMinutes += (studyTimeMinutes || 0);
    user.xp = (user.xp || 0) + xpGain;

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

        // AI ADAPTATION: If user is doing exceptionally well, they can skip or advance faster
        // If they have high confidence in all topics of current phase, they advance.
        const averageConfidence = completedInPhase.length > 0 
          ? completedInPhase.reduce((acc, curr) => acc + (curr.confidenceLevel || 3), 0) / completedInPhase.length 
          : 0;

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
        } else if (averageConfidence >= 4.5 && completedInPhase.length >= topicsInPhase.length * 0.7) {
          // AI FAST-TRACK: If confidence is very high and 70% topics done, unlock next level
          // But don't increment phase yet, just allow access? 
          // Actually, let's keep it simple: if they are doing great, give more XP.
          user.xp = (user.xp || 0) + 100; // Fast-track bonus
        }
      }
    }

    // Domain specific logic
    const populatedUser = await User.findById(user._id).populate('selectedDomain');
    if (populatedUser.selectedDomain && populatedUser.selectedDomain.slug === 'dsa') {
      updateDSAStats(user);
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Topic completed', 
      data: { 
        overallProgress: user.overallProgress, 
        dailyStreak: user.dailyStreak,
        xp: user.xp
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
    
    if (user.selectedDomain && user.selectedDomain.slug === 'dsa') {
      updateDSAStats(user);
      await user.save();
    }

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

// Helper function to update DSA stats (internal)
const updateDSAStats = (user) => {
  if (!user.completedTopics || user.completedTopics.length === 0) return;
  
  const dsaTopics = user.completedTopics.filter(ct => ct.difficultyFeedback);
  if (dsaTopics.length === 0) return;

  // Track counts for strongest/weakest calculation
  const performanceMap = {};
  
  dsaTopics.forEach(ct => {
    // This assumes topicId is populated or we have a way to get the category
    // For now, we'll use a placeholder or check if topicId.title exists
    const category = ct.topicId?.title ? ct.topicId.title.split(' ')[0] : 'General';
    
    if (!performanceMap[category]) {
      performanceMap[category] = { totalConfidence: 0, count: 0, hardCount: 0 };
    }
    
    performanceMap[category].totalConfidence += (ct.confidenceLevel || 3);
    performanceMap[category].count += 1;
    if (ct.difficultyFeedback === 'hard') performanceMap[category].hardCount += 1;
  });

  let strongest = { name: '', score: -1 };
  let weakest = { name: '', score: 100 };

  Object.keys(performanceMap).forEach(cat => {
    const avgConfidence = performanceMap[cat].totalConfidence / performanceMap[cat].count;
    const hardRatio = performanceMap[cat].hardCount / performanceMap[cat].count;
    const score = avgConfidence - (hardRatio * 2);

    if (score > strongest.score) strongest = { name: cat, score };
    if (score < weakest.score) weakest = { name: cat, score };
  });

  user.dsaStats.strongestTopic = strongest.name || 'Foundations';
  user.dsaStats.weakestTopic = weakest.name || 'Recursion';
  user.dsaStats.totalProblemsSolved = dsaTopics.length;
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

// @desc    Submit code playground attempt
// @route   POST /api/progress/submit-code
exports.submitCode = async (req, res) => {
  try {
    const { topicId, code, language, status, passedCount, totalCount, runtime } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.codeSubmissions) {
      user.codeSubmissions = [];
    }

    const newSubmission = {
      topicId,
      code,
      language,
      status,
      passedCount,
      totalCount,
      runtime: runtime || Math.round(Math.random() * 50 + 10), // mock runtime in ms
      submittedAt: new Date()
    };

    user.codeSubmissions.push(newSubmission);

    // If status is 'Accepted', reward 100 XP and mark the topic as completed in database
    if (status === 'Accepted') {
      const alreadyCompleted = user.completedTopics.find(t => t.topicId.toString() === topicId);
      if (!alreadyCompleted) {
        user.completedTopics.push({
          topicId,
          completedAt: new Date(),
          studyTimeMinutes: 15,
          notes: 'Solved via LeetCode IDE playground!',
          difficultyFeedback: 'medium',
          confidenceLevel: 4,
          revisionNeeded: false
        });

        // Increment DSA Stats
        user.dsaStats.totalProblemsSolved += 1;
        user.dsaStats.lastSolvedAt = new Date();
        user.xp = (user.xp || 0) + 100; // 100 XP coding award!
      } else {
        // Just add 10 XP for re-submitting correct solution
        user.xp = (user.xp || 0) + 10;
      }
    }

    await user.save();
    res.json({ success: true, message: status === 'Accepted' ? 'Expedition Mastered!' : 'Keep refining your code!', data: newSubmission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get code submissions for a specific topic
// @route   GET /api/progress/submissions/:topicId
exports.getSubmissions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const submissions = (user.codeSubmissions || []).filter(
      sub => sub.topicId.toString() === req.params.topicId
    );
    res.json({ 
      success: true, 
      data: submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
