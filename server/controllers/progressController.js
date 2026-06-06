const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Badge = require('../models/Badge');
const Certificate = require('../models/Certificate');
const WebDevProject = require('../models/WebDevProject');

// Helper function to map database slugs to domainsProgress keys
const getProgressKey = (slug) => {
  if (!slug) return 'dsa';
  const lowercaseSlug = slug.toLowerCase();
  if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
  if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
  if (lowercaseSlug === 'devops') return 'devops';
  if (lowercaseSlug === 'dsa') return 'dsa';
  // Fallback mappings for other possible seed domains
  if (lowercaseSlug.includes('web') || lowercaseSlug.includes('ui-ux')) return 'webdev';
  if (lowercaseSlug.includes('open') || lowercaseSlug.includes('git')) return 'opensource';
  if (lowercaseSlug.includes('dsa') || lowercaseSlug.includes('data')) return 'dsa';
  return 'devops';
};

// Helper function to safely retrieve and initialize domain progress
const getSafeDomainProgress = (user, key) => {
  if (!user.domainsProgress) {
    user.domainsProgress = {};
  }
  if (!user.domainsProgress[key]) {
    user.domainsProgress[key] = {
      xp: 0,
      currentPhase: 1,
      overallProgress: 0,
      completedTopics: [],
      startedTopics: [],
      testResults: [],
      codeSubmissions: [],
      dsaStats: {
        totalProblemsSolved: 0,
        currentStreak: 0,
        bestStreak: 0,
        strongestTopic: '',
        weakestTopic: '',
      }
    };
  }
  if (!user.domainsProgress[key].completedTopics) {
    user.domainsProgress[key].completedTopics = [];
  }
  if (!user.domainsProgress[key].startedTopics) {
    user.domainsProgress[key].startedTopics = [];
  }
  if (!user.domainsProgress[key].testResults) {
    user.domainsProgress[key].testResults = [];
  }
  if (!user.domainsProgress[key].codeSubmissions) {
    user.domainsProgress[key].codeSubmissions = [];
  }
  if (!user.domainsProgress[key].dsaStats) {
    user.domainsProgress[key].dsaStats = {
      totalProblemsSolved: 0,
      currentStreak: 0,
      bestStreak: 0,
      strongestTopic: '',
      weakestTopic: '',
    };
  }
  return user.domainsProgress[key];
};

// Helper function to update DSA stats (internal)
const updateDSAStats = (user) => {
  const dsaProgress = getSafeDomainProgress(user, 'dsa');
  if (!dsaProgress || !dsaProgress.completedTopics || dsaProgress.completedTopics.length === 0) return;
  
  const dsaTopics = dsaProgress.completedTopics.filter(ct => ct.difficultyFeedback);
  if (dsaTopics.length === 0) return;

  // Track counts for strongest/weakest calculation
  const performanceMap = {};
  
  dsaTopics.forEach(ct => {
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

  dsaProgress.dsaStats.strongestTopic = strongest.name || 'Foundations';
  dsaProgress.dsaStats.weakestTopic = weakest.name || 'Recursion';
  dsaProgress.dsaStats.totalProblemsSolved = dsaTopics.length;
};

// @desc    Select domain for student
// @route   POST /api/progress/select-domain
exports.selectDomain = async (req, res) => {
  try {
    const { domainId } = req.body;
    const user = await User.findById(req.user._id);
    
    const domain = await Domain.findById(domainId);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });

    user.activeDomain = domainId;
    if (user.profile) {
      user.profile.isProfileComplete = false;
    }

    // Initialize domain-specific phase if not set
    const key = getProgressKey(domain.slug);
    if (user.domainsProgress && user.domainsProgress[key]) {
      if (!user.domainsProgress[key].currentPhase || user.domainsProgress[key].currentPhase === 0) {
        user.domainsProgress[key].currentPhase = 1;
        domain.enrolledCount = (domain.enrolledCount || 0) + 1;
        await domain.save();
      }
    }

    user.markModified(`domainsProgress.${key}`);
    user.markModified('profile');
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
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    const alreadyStarted = domainProgress.startedTopics.find(t => t.topicId.toString() === topicId);
    if (alreadyStarted) {
      return res.json({ success: true, message: 'Topic already started' });
    }

    domainProgress.startedTopics.push({ topicId, startedAt: new Date() });
    user.markModified(`domainsProgress.${key}`);
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
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    const alreadyCompleted = domainProgress.completedTopics.find(t => t.topicId.toString() === topicId);
    if (alreadyCompleted) {
      return res.json({ 
        success: true, 
        message: 'Topic already completed',
        data: {
          overallProgress: domainProgress.overallProgress,
          dailyStreak: user.dailyStreak,
          xp: domainProgress.xp,
          totalXP: user.totalXP
        }
      });
    }

    domainProgress.completedTopics.push({
      topicId,
      completedAt: new Date(),
      studyTimeMinutes: studyTimeMinutes || 0,
      notes: notes || '',
      difficultyFeedback,
      confidenceLevel,
      revisionNeeded: !!revisionNeeded
    });

    // Update DSA Stats if applicable
    if (difficultyFeedback && difficultyFeedback !== 'unsolved' && key === 'dsa') {
      domainProgress.dsaStats.totalProblemsSolved += 1;
      domainProgress.dsaStats.lastSolvedAt = new Date();
    }

    // Update study minutes globally, XP domain-specifically with Streak Multiplier
    let xpGain = 50;
    if (user.dailyStreak >= 30) {
      xpGain = 100; // Master Multiplier
    } else if (user.dailyStreak >= 7) {
      xpGain = 75; // Dedicated Multiplier
    }
    
    user.totalStudyMinutes += (studyTimeMinutes || 0);
    domainProgress.xp = (domainProgress.xp || 0) + xpGain;

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

    const newlyEarnedBadges = [];
    let newlyEarnedCertificate = null;

    // 1. Topic completion badge (One video = One badge)
    let topicBadge = await Badge.findOne({ topicId });
    if (!topicBadge) {
      const topicObj = await Topic.findById(topicId);
      topicBadge = await Badge.create({
        name: `Mastered: ${topicObj ? topicObj.title : 'Topic'}`,
        description: 'Successfully completed the lecture and code exercises.',
        icon: '🎖️',
        type: 'topic-completion',
        topicId: topicId,
        domainId: user.activeDomain._id
      });
    }

    if (topicBadge) {
      const alreadyEarned = user.earnedBadges.some(b => b.badgeId.toString() === topicBadge._id.toString());
      if (!alreadyEarned) {
        user.earnedBadges.push({ badgeId: topicBadge._id, earnedAt: new Date() });
        newlyEarnedBadges.push(topicBadge);
      }
    }

    // Calculate overall progress and auto-advance phase
    const totalTopicsInDomain = await Topic.countDocuments({ domainId: user.activeDomain._id, isActive: true });
    const completedTopicsInDomain = await Topic.countDocuments({
      _id: { $in: domainProgress.completedTopics.map(t => t.topicId) },
      domainId: user.activeDomain._id,
      isActive: true
    });
    domainProgress.overallProgress = totalTopicsInDomain > 0 ? Math.round((completedTopicsInDomain / totalTopicsInDomain) * 100) : 0;

    // Check if current phase is complete
    const currentPhase = await Phase.findOne({ domainId: user.activeDomain._id, phaseNumber: domainProgress.currentPhase });
    if (currentPhase) {
      const topicsInPhase = await Topic.find({ phaseId: currentPhase._id, isActive: true });
      const completedInPhase = domainProgress.completedTopics.filter(ct => 
        topicsInPhase.some(tp => tp._id.toString() === ct.topicId.toString())
      );

      const averageConfidence = completedInPhase.length > 0 
        ? completedInPhase.reduce((acc, curr) => acc + (curr.confidenceLevel || 3), 0) / completedInPhase.length 
        : 0;

      if (completedInPhase.length === topicsInPhase.length && topicsInPhase.length > 0) {
        // Phase complete! Advance to next phase
        domainProgress.currentPhase += 1;
        domainProgress.xp = (domainProgress.xp || 0) + 500; // Bonus XP for phase completion
        
        // Award phase badge if exists
        const badge = await Badge.findOne({ phaseId: currentPhase._id });
        if (badge) {
          const alreadyEarned = user.earnedBadges.some(b => b.badgeId.toString() === badge._id.toString());
          if (!alreadyEarned) {
            user.earnedBadges.push({ badgeId: badge._id, earnedAt: new Date() });
            newlyEarnedBadges.push(badge);
          }
        }
      } else if (averageConfidence >= 4.5 && completedInPhase.length >= topicsInPhase.length * 0.7) {
        domainProgress.xp = (domainProgress.xp || 0) + 100; // Fast-track bonus
      }
    }

    // Check if domain is fully completed (overallProgress === 100)
    if (domainProgress.overallProgress >= 100) {
      const existingCert = await Certificate.findOne({ userId: user._id, domainId: user.activeDomain._id });
      if (!existingCert) {
        const domainObj = await Domain.findById(user.activeDomain._id);
        const cert = await Certificate.create({
          userId: user._id,
          domainId: user.activeDomain._id,
          title: `${domainObj.name} Completion Certificate`,
          description: `Successfully completed the full course of ${domainObj.name} including all phases, coding exercises, and assessments.`,
          completionPercentage: 100
        });
        newlyEarnedCertificate = cert;
      }
    }

    if (key === 'dsa') {
      updateDSAStats(user);
    }

    user.markModified(`domainsProgress.${key}`);
    await user.save();

    res.json({ 
      success: true, 
      message: 'Topic completed', 
      data: { 
        overallProgress: domainProgress.overallProgress, 
        dailyStreak: user.dailyStreak,
        xp: domainProgress.xp,
        totalXP: user.totalXP,
        newlyEarnedBadges,
        newlyEarnedCertificate,
        topicBadge
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
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    const existingAttempt = domainProgress.testResults.filter(t => t.assessmentId.toString() === assessmentId);
    
    domainProgress.testResults.push({
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

    user.markModified(`domainsProgress.${key}`);
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
      .populate('activeDomain')
      .populate('earnedBadges.badgeId');

    const activeDomain = user.activeDomain;
    const key = activeDomain ? getProgressKey(activeDomain.slug) : 'dsa';
    const domainProgress = user.domainsProgress[key] || {
      xp: 0,
      currentPhase: 1,
      overallProgress: 0,
      completedTopics: [],
      startedTopics: [],
      dsaStats: {}
    };

    if (activeDomain && activeDomain.slug === 'dsa') {
      updateDSAStats(user);
      user.markModified('domainsProgress.dsa');
      await user.save();
    }

    // Populate completed topics title/details for dashboard compatibility
    const completedWithDetails = [];
    for (const item of (domainProgress.completedTopics || [])) {
      const topic = await Topic.findById(item.topicId);
      completedWithDetails.push({
        ...item.toObject ? item.toObject() : item,
        topicId: topic
      });
    }

    let currentPhaseData = null;
    let upcomingAssessment = null;

    if (activeDomain) {
      currentPhaseData = await Phase.findOne({ 
        domainId: activeDomain._id, 
        phaseNumber: domainProgress.currentPhase || 1
      });

      upcomingAssessment = await require('../models/Assessment').findOne({
        domainId: activeDomain._id,
        isActive: true
      }).sort('order');
    }

    const testsPassed = (domainProgress.testResults || []).filter(t => t.passed).length;
    const totalBadges = user.earnedBadges.length;

    res.json({
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          profile: user.profile,
          selectedDomain: activeDomain,
          activeDomain: activeDomain,
          currentPhase: domainProgress.currentPhase || 1,
          overallProgress: domainProgress.overallProgress || 0,
          dailyStreak: user.dailyStreak,
          totalStudyMinutes: user.totalStudyMinutes,
          xp: domainProgress.xp || 0,
          totalXP: user.totalXP,
          dsaStats: domainProgress.dsaStats || {},
          earnedBadges: user.earnedBadges,
          completedTopics: completedWithDetails,
          domainsProgress: user.domainsProgress
        },
        currentPhaseData,
        upcomingAssessment,
        testsPassed,
        totalBadges,
        completedTopicsCount: completedWithDetails.length,
        activityLog: user.activityLog.slice(-365),
        recentActivity: completedWithDetails.slice(-5)
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

// @desc    Submit code playground attempt
// @route   POST /api/progress/submit-code
exports.submitCode = async (req, res) => {
  try {
    const { topicId, code, language, status, passedCount, totalCount, runtime } = req.body;
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    if (!domainProgress.codeSubmissions) {
      domainProgress.codeSubmissions = [];
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

    domainProgress.codeSubmissions.push(newSubmission);

    // If status is 'Accepted', reward 100 XP and mark the topic as completed in database
    if (status === 'Accepted') {
      const alreadyCompleted = domainProgress.completedTopics.find(t => t.topicId.toString() === topicId);
      if (!alreadyCompleted) {
        domainProgress.completedTopics.push({
          topicId,
          completedAt: new Date(),
          studyTimeMinutes: 15,
          notes: 'Solved via LeetCode IDE playground!',
          difficultyFeedback: 'medium',
          confidenceLevel: 4,
          revisionNeeded: false
        });

        // Increment DSA Stats
        if (key === 'dsa') {
          domainProgress.dsaStats.totalProblemsSolved += 1;
          domainProgress.dsaStats.lastSolvedAt = new Date();
        }
        domainProgress.xp = (domainProgress.xp || 0) + 100; // 100 XP coding award!
      } else {
        // Just add 10 XP for re-submitting correct solution
        domainProgress.xp = (domainProgress.xp || 0) + 10;
      }
    }

    if (key === 'dsa') {
      updateDSAStats(user);
    }

    user.markModified(`domainsProgress.${key}`);
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
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.json({ success: true, data: [] });
    }
    const key = getProgressKey(user.activeDomain.slug);
    const submissions = (user.domainsProgress[key]?.codeSubmissions || []).filter(
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

// @desc    Skip a whole level (phase)
// @route   POST /api/progress/skip-phase
exports.skipPhase = async (req, res) => {
  try {
    const { phaseId } = req.body;
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    const phase = await Phase.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    if (phase.domainId.toString() !== user.activeDomain._id.toString()) {
      return res.status(400).json({ success: false, message: 'Phase does not belong to selected domain' });
    }

    if (phase.phaseNumber !== domainProgress.currentPhase) {
      return res.status(400).json({ success: false, message: 'You can only skip your current active level' });
    }

    const topicsInPhase = await Topic.find({ phaseId: phase._id, isActive: true });

    const now = new Date();
    let topicsCompletedCount = 0;
    topicsInPhase.forEach(topic => {
      const alreadyCompleted = domainProgress.completedTopics.find(t => t.topicId.toString() === topic._id.toString());
      if (!alreadyCompleted) {
        domainProgress.completedTopics.push({
          topicId: topic._id,
          completedAt: now,
          studyTimeMinutes: 0,
          notes: 'Skipped as part of a level skip.',
          confidenceLevel: 3,
          revisionNeeded: false
        });
        topicsCompletedCount++;

        if (key === 'dsa') {
          domainProgress.dsaStats.totalProblemsSolved += 1;
        }
      }
    });

    if (key === 'dsa' && topicsCompletedCount > 0) {
      domainProgress.dsaStats.lastSolvedAt = now;
    }

    domainProgress.currentPhase += 1;
    domainProgress.xp = (domainProgress.xp || 0) + 500;

    const newlyEarnedBadges = [];
    const badge = await Badge.findOne({ phaseId: phase._id });
    if (badge) {
      const alreadyEarned = user.earnedBadges.some(b => b.badgeId.toString() === badge._id.toString());
      if (!alreadyEarned) {
        user.earnedBadges.push({ badgeId: badge._id, earnedAt: now });
        newlyEarnedBadges.push(badge);
      }
    }

    const totalTopicsInDomain = await Topic.countDocuments({ domainId: user.activeDomain._id, isActive: true });
    const completedTopicsInDomain = await Topic.countDocuments({
      _id: { $in: domainProgress.completedTopics.map(t => t.topicId) },
      domainId: user.activeDomain._id,
      isActive: true
    });
    domainProgress.overallProgress = totalTopicsInDomain > 0 ? Math.round((completedTopicsInDomain / totalTopicsInDomain) * 100) : 0;

    let newlyEarnedCertificate = null;
    if (domainProgress.overallProgress >= 100) {
      const existingCert = await Certificate.findOne({ userId: user._id, domainId: user.activeDomain._id });
      if (!existingCert) {
        const domainObj = await Domain.findById(user.activeDomain._id);
        const cert = await Certificate.create({
          userId: user._id,
          domainId: user.activeDomain._id,
          title: `${domainObj.name} Completion Certificate`,
          description: `Successfully completed the full course of ${domainObj.name} including all phases, coding exercises, and assessments.`,
          completionPercentage: 100
        });
        newlyEarnedCertificate = cert;
      }
    }

    if (key === 'dsa') {
      updateDSAStats(user);
    }

    user.markModified(`domainsProgress.${key}`);
    await user.save();

    res.json({
      success: true,
      message: 'Level skipped successfully',
      data: {
        currentPhase: domainProgress.currentPhase,
        overallProgress: domainProgress.overallProgress,
        xp: domainProgress.xp,
        newlyEarnedBadges,
        newlyEarnedCertificate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save active learning state / video progress for a domain
// @route   POST /api/progress/video-progress
exports.saveVideoProgress = async (req, res) => {
  try {
    const { checkpointId, timestamp, lastOpenedTopic, currentCheckpoint } = req.body;
    const user = await User.findById(req.user._id).populate('activeDomain');
    if (!user.activeDomain) {
      return res.status(400).json({ success: false, message: 'No active domain selected' });
    }

    const key = getProgressKey(user.activeDomain.slug);
    const domainProgress = getSafeDomainProgress(user, key);

    if (checkpointId !== undefined && timestamp !== undefined) {
      domainProgress.videoProgress = { checkpointId, timestamp };
    }
    if (lastOpenedTopic) {
      domainProgress.lastOpenedTopic = lastOpenedTopic;
    }
    if (currentCheckpoint) {
      domainProgress.currentCheckpoint = currentCheckpoint;
    }

    user.markModified(`domainsProgress.${key}`);
    await user.save();

    res.json({ success: true, message: 'Video and learning state updated', data: domainProgress.videoProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save Web Dev Project files
// @route   POST /api/progress/webdev-project
exports.saveWebDevProject = async (req, res) => {
  try {
    const { topicId, files } = req.body;
    
    let project = await WebDevProject.findOne({ userId: req.user._id, topicId });
    
    if (project) {
      project.files = files;
      project.version += 1;
      project.lastSavedAt = Date.now();
      await project.save();
    } else {
      project = await WebDevProject.create({
        userId: req.user._id,
        topicId,
        files
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Web Dev Project files
// @route   GET /api/progress/webdev-project/:topicId
exports.getWebDevProject = async (req, res) => {
  try {
    const project = await WebDevProject.findOne({ 
      userId: req.user._id, 
      topicId: req.params.topicId 
    });
    
    res.json({ success: true, data: project || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
