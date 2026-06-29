const Leaderboard = require('../models/Leaderboard');
const PointTransaction = require('../models/PointTransaction');
const GamificationSettings = require('../models/GamificationSettings');
const Notification = require('../models/Notification');
const User = require('../models/User');
const gamificationService = require('../services/gamificationService');

/**
 * Helper to assign ranks dynamically based on sorted arrays
 */
const assignLocalRanks = (entries) => {
  return entries.map((entry, index) => {
    const raw = entry.toObject ? entry.toObject() : entry;
    return {
      ...raw,
      localRank: index + 1
    };
  });
};

/**
 * GET /api/leaderboard/global
 */
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const standings = await Leaderboard.find()
      .populate('userId', 'fullName email profileImage role')
      .populate('courseId', 'courseName')
      .populate('batchId', 'batchName')
      .sort({ rank: 1 })
      .limit(100);

    res.json({ success: true, data: standings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/leaderboard/course/:courseId
 */
exports.getCourseLeaderboard = async (req, res) => {
  try {
    const standings = await Leaderboard.find({ courseId: req.params.courseId })
      .populate('userId', 'fullName email profileImage role')
      .populate('courseId', 'courseName')
      .populate('batchId', 'batchName')
      .sort({
        points: -1,
        averageAssessmentScore: -1,
        totalStudyTime: -1,
        codingProblemsSolved: -1,
        loginStreak: -1
      })
      .limit(100);

    res.json({ success: true, data: assignLocalRanks(standings) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/leaderboard/batch/:batchId
 */
exports.getBatchLeaderboard = async (req, res) => {
  try {
    const standings = await Leaderboard.find({ batchId: req.params.batchId })
      .populate('userId', 'fullName email profileImage role')
      .populate('courseId', 'courseName')
      .populate('batchId', 'batchName')
      .sort({
        points: -1,
        averageAssessmentScore: -1,
        totalStudyTime: -1,
        codingProblemsSolved: -1,
        loginStreak: -1
      })
      .limit(100);

    res.json({ success: true, data: assignLocalRanks(standings) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/leaderboard/weekly
 * Aggregates points from point transactions in the last 7 days
 */
exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const aggregated = await PointTransaction.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$userId', weeklyPoints: { $sum: '$points' } } },
      { $sort: { weeklyPoints: -1 } },
      { $limit: 100 }
    ]);

    // Populate user profiles manually to keep it fast
    const standings = [];
    const Student = require('../models/Student');
    for (let i = 0; i < aggregated.length; i++) {
      const user = await User.findById(aggregated[i]._id).select('fullName email avatar role');
      if (user && user.role === 'student') {
        const student = await Student.findOne({ userId: user._id })
          .populate('course', 'courseName')
          .populate('batch', 'batchName');

        standings.push({
          userId: user._id,
          name: user.fullName,
          profileImage: user.avatar || '',
          courseId: student ? student.course : null,
          batchId: student ? student.batch : null,
          points: aggregated[i].weeklyPoints,
          localRank: i + 1
        });
      }
    }

    res.json({ success: true, data: standings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/leaderboard/monthly
 * Aggregates points from point transactions in the last 30 days
 */
exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const aggregated = await PointTransaction.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$userId', monthlyPoints: { $sum: '$points' } } },
      { $sort: { monthlyPoints: -1 } },
      { $limit: 100 }
    ]);

    const standings = [];
    const Student = require('../models/Student');
    for (let i = 0; i < aggregated.length; i++) {
      const user = await User.findById(aggregated[i]._id).select('fullName email avatar role');
      if (user && user.role === 'student') {
        const student = await Student.findOne({ userId: user._id })
          .populate('course', 'courseName')
          .populate('batch', 'batchName');

        standings.push({
          userId: user._id,
          name: user.fullName,
          profileImage: user.avatar || '',
          courseId: student ? student.course : null,
          batchId: student ? student.batch : null,
          points: aggregated[i].monthlyPoints,
          localRank: i + 1
        });
      }
    }

    res.json({ success: true, data: standings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/leaderboard/me
 */
exports.getMyLeaderboardRecord = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user details populated with badges
    const user = await User.findById(userId).populate('earnedBadges.badgeId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get or initialize leaderboard entry
    let entry = await Leaderboard.findOne({ userId })
      .populate('badges.badgeId');

    if (!entry) {
      const Student = require('../models/Student');
      const student = await Student.findOne({ userId });
      entry = new Leaderboard({
        userId,
        name: user.fullName,
        profileImage: user.avatar || '',
        courseId: student ? student.course : null,
        batchId: student ? student.batch : null
      });
      await entry.save();
      await gamificationService.recalculateRankings();
      entry = await Leaderboard.findOne({ userId }).populate('badges.badgeId');
    }

    // Level Target Math
    const levelInfo = gamificationService.calculateLevel(entry.points);
    let levelProgressPercentage = 0;
    if (levelInfo.nextTarget) {
      const range = levelInfo.nextTarget - levelInfo.prevTarget;
      const progress = entry.points - levelInfo.prevTarget;
      levelProgressPercentage = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    } else {
      levelProgressPercentage = 100; // Max level
    }

    // Progress to Next Rank (overtaking the person immediately ahead)
    let pointsNeededForNextRank = 0;
    let userAhead = null;
    if (entry.rank > 1) {
      userAhead = await Leaderboard.findOne({ rank: entry.rank - 1 });
      if (userAhead) {
        pointsNeededForNextRank = Math.max(1, userAhead.points - entry.points);
      }
    }

    res.json({
      success: true,
      data: {
        entry,
        levelInfo: {
          currentLevel: entry.level,
          nextLevelTarget: levelInfo.nextTarget,
          pointsEarnedInLevel: entry.points - levelInfo.prevTarget,
          pointsNeededForNextLevel: levelInfo.nextTarget ? (levelInfo.nextTarget - entry.points) : 0,
          percentage: levelProgressPercentage
        },
        rankProgress: {
          currentRank: entry.rank,
          pointsNeededForNextRank,
          nextRankUser: userAhead ? userAhead.name : null
        },
        badges: user.earnedBadges
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/leaderboard/recalculate
 */
exports.recalculateRankings = async (req, res) => {
  try {
    await gamificationService.recalculateRankings();
    res.json({ success: true, message: 'Rankings successfully recalculated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/leaderboard/reset
 */
exports.resetStandings = async (req, res) => {
  try {
    const { timeframe } = req.body;
    if (timeframe !== 'weekly' && timeframe !== 'monthly') {
      return res.status(400).json({ success: false, message: 'Invalid timeframe. Specify weekly or monthly.' });
    }

    await gamificationService.resetTimeboundRankings(timeframe);
    res.json({ success: true, message: `Successfully reset ${timeframe} leaderboard standings.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/leaderboard/settings
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await gamificationService.getGamificationSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/leaderboard/settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const settings = await gamificationService.getGamificationSettings();
    if (req.body.pointsConfig) {
      settings.pointsConfig = {
        ...settings.pointsConfig.toObject(),
        ...req.body.pointsConfig
      };
    }
    await settings.save();
    res.json({ success: true, message: 'Gamification rules updated successfully', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/leaderboard/analytics
 */
exports.getGamificationAnalytics = async (req, res) => {
  try {
    // 1. Most active students (by study time)
    const active = await Leaderboard.find()
      .populate('userId', 'fullName email profileImage')
      .sort({ totalStudyTime: -1 })
      .limit(10);

    // 2. Highest scoring students
    const highScorers = await Leaderboard.find()
      .populate('userId', 'fullName email profileImage')
      .sort({ points: -1 })
      .limit(10);

    // 3. Most improved students (top points in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const aggregated = await PointTransaction.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$userId', pointsEarned: { $sum: '$points' } } },
      { $sort: { pointsEarned: -1 } },
      { $limit: 10 }
    ]);

    const improved = [];
    for (const item of aggregated) {
      const user = await User.findById(item._id).select('fullName email profileImage');
      if (user) {
        improved.push({
          user,
          pointsEarned: item.pointsEarned
        });
      }
    }

    // 4. Students at risk (no point transactions in last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const activeUserIds = await PointTransaction.distinct('userId', {
      createdAt: { $gte: fourteenDaysAgo }
    });

    const atRisk = await User.find({
      role: 'student',
      status: 'active',
      _id: { $nin: activeUserIds }
    })
    .select('fullName email profileImage course batch')
    .populate('course', 'courseName')
    .populate('batch', 'batchName')
    .limit(15);

    res.json({
      success: true,
      data: {
        active,
        highScorers,
        improved,
        atRisk
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
