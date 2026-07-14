const Leaderboard = require('../models/Leaderboard');
const PointTransaction = require('../models/PointTransaction');
const GamificationSettings = require('../models/GamificationSettings');
const Notification = require('../models/Notification');
const User = require('../models/User');
const UserActivity = require('../models/UserActivity');
const Badge = require('../models/Badge');

/**
 * Get or initialize global point settings
 */
const getGamificationSettings = async () => {
  let settings = await GamificationSettings.findOne();
  if (!settings) {
    settings = new GamificationSettings();
    await settings.save();
  }
  return settings;
};

/**
 * Seed 10 automatic gamification badges in the Badge collection if missing
 */
const seedDefaultBadges = async () => {
  const defaults = [
    { name: 'First Login', icon: '🚀', color: '#6366f1', type: 'special', unlockCondition: 'Log in for the first time' },
    { name: '7 Day Streak', icon: '🔥', color: '#10b981', type: 'streak', unlockCondition: 'Maintain a 7-day study streak' },
    { name: '30 Day Streak', icon: '👑', color: '#f59e0b', type: 'streak', unlockCondition: 'Maintain a 30-day study streak' },
    { name: '100 Hours Studied', icon: '⏳', color: '#8b5cf6', type: 'special', unlockCondition: 'Study for 100 hours on the platform' },
    { name: 'Top Performer', icon: '🥇', color: '#ef4444', type: 'special', unlockCondition: 'Reach Rank #1 on any leaderboard' },
    { name: 'Coding Champion', icon: '🏆', color: '#ec4899', type: 'special', unlockCondition: 'Solve 10 coding problems' },
    { name: 'Assessment Master', icon: '🎓', color: '#06b6d4', type: 'assessment', unlockCondition: 'Pass 5 assessments' },
    { name: 'Perfect Attendance', icon: '📅', color: '#3b82f6', type: 'special', unlockCondition: 'Achieve perfect attendance in 10 classes' },
    { name: 'Video Completion Master', icon: '🎬', color: '#10b981', type: 'special', unlockCondition: 'Complete 10 video lectures' },
    { name: 'Roadmap Finisher', icon: '🏁', color: '#14b8a6', type: 'special', unlockCondition: 'Complete any course roadmap 100%' }
  ];

  for (const item of defaults) {
    let exists = await Badge.findOne({ name: item.name });
    if (!exists) {
      const newBadge = new Badge(item);
      await newBadge.save();
    }
  }
};

/**
 * Helper to dispatch private notifications to users
 */
const createNotification = async (userId, type, title, message, metadata = {}) => {
  try {
    const notification = new Notification({ userId, type, title, message, metadata });
    await notification.save();
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

/**
 * Helper to compute student level based on points
 */
const calculateLevel = (points) => {
  if (points <= 100) return { level: 1, nextTarget: 101, prevTarget: 0 };
  if (points <= 300) return { level: 2, nextTarget: 301, prevTarget: 101 };
  if (points <= 600) return { level: 3, nextTarget: 601, prevTarget: 301 };
  if (points <= 1000) return { level: 4, nextTarget: 1001, prevTarget: 601 };
  if (points <= 1500) return { level: 5, nextTarget: 1501, prevTarget: 1001 };
  return { level: 6, nextTarget: null, prevTarget: 1501 };
};

/**
 * Award points automatically with duplicate checks
 */
const awardPoints = async (userId, reason, referenceId = null, dateStr = null) => {
  try {
    const settings = await getGamificationSettings();
    const config = settings.pointsConfig;

    // Map point reason to points quantity
    let pointsToAdd = 0;
    switch (reason) {
      case 'login': pointsToAdd = config.dailyLogin; break;
      case 'video': pointsToAdd = config.completeVideo; break;
      case 'roadmap': pointsToAdd = config.completeRoadmapModule; break;
      case 'assessment': pointsToAdd = config.passAssessment; break;
      case 'assessment_bonus': pointsToAdd = config.score90PlusBonus; break;
      case 'assignment': pointsToAdd = config.submitAssignment; break;
      case 'problem': pointsToAdd = config.solveCodingProblem; break;
      case 'streak': pointsToAdd = config.maintainDailyStreak; break;
      case 'attendance': pointsToAdd = config.perfectAttendance; break;
      default: return null;
    }

    if (pointsToAdd === 0) return null;

    // Check for duplicate point allocation
    const query = { userId, reason };
    if (referenceId) query['metadata.referenceId'] = referenceId;
    if (dateStr) query['metadata.dateStr'] = dateStr;

    const duplicate = await PointTransaction.findOne(query);
    if (duplicate) return null; // Prevent double awarding

    // Record the transaction
    const transaction = new PointTransaction({
      userId,
      points: pointsToAdd,
      reason,
      metadata: { referenceId, dateStr }
    });
    await transaction.save();

    // Fetch student profile details
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') return null;

    const Student = require('../models/Student');
    const student = await Student.findOne({ userId });

    // Get or initialize Leaderboard entry
    let entry = await Leaderboard.findOne({ userId });
    if (!entry) {
      entry = new Leaderboard({
        userId,
        name: user.fullName,
        profileImage: user.avatar || '',
        courseId: student ? student.course : null,
        batchId: student ? student.batch : null
      });
    }

    // Update name / profile image in case they changed
    entry.name = user.fullName;
    entry.profileImage = user.avatar || '';
    if (student) {
      entry.courseId = student.course || entry.courseId;
      entry.batchId = student.batch || entry.batchId;
    }

    // Update points
    const previousPoints = entry.points;
    entry.points += pointsToAdd;

    // Check level boundaries
    const prevLevel = entry.level;
    const currentLevelDetails = calculateLevel(entry.points);
    entry.level = currentLevelDetails.level;

    if (entry.level > prevLevel) {
      await createNotification(
        userId, 
        'level_up', 
        '🎉 Level Up!', 
        `Awesome! You leveled up from Level ${prevLevel} to Level ${entry.level}! Keep studying!`
      );
    }

    // Sync latest user activity metrics
    const activity = await UserActivity.findOne({ userId });
    if (activity) {
      entry.totalStudyTime = activity.totalTimeSpentInSeconds || 0;
      entry.totalLoginCount = activity.totalLoginCount || 0;
      entry.loginStreak = activity.currentLoginStreak || 0;
      entry.videosCompleted = activity.totalVideosWatched || 0;
      entry.assessmentsAttempted = activity.totalAssessmentsAttempted || 0;
      entry.assessmentsPassed = activity.assessmentAnalytics?.totalPassed || 0;
      entry.averageAssessmentScore = activity.assessmentAnalytics?.averageScore || 0;
      entry.assignmentsSubmitted = activity.totalAssignmentsSubmitted || 0;
    }

    // Load solved coding problems count from UserProgress
    try {
      const UserProgress = require('../models/UserProgress');
      const userProgress = await UserProgress.findOne({ user: userId });
      entry.codingProblemsSolved = userProgress?.solvedProblems?.length || 0;
    } catch (err) {
      console.error('Failed to sync coding problems solved count:', err.message);
      entry.codingProblemsSolved = 0;
    }

    // Check and award automatic badges
    await checkAndAwardBadges(userId, entry);

    entry.lastUpdatedAt = new Date();
    await entry.save();

    // Recalculate standings
    await recalculateRankings();

    return transaction;

  } catch (err) {
    console.error('Error awarding points:', err.message);
    return null;
  }
};

/**
 * Assess qualification thresholds and award default badges
 */
const checkAndAwardBadges = async (userId, leaderboardEntry) => {
  await seedDefaultBadges(); // ensure badges exist in DB
  const user = await User.findById(userId);
  if (!user) return;

  const currentBadgeKeys = user.earnedBadges.map(b => b.badgeId?.toString());
  
  const checkBadgeCondition = async (name) => {
    switch (name) {
      case 'First Login':
        return leaderboardEntry.totalLoginCount >= 1;
      case '7 Day Streak':
        return leaderboardEntry.loginStreak >= 7;
      case '30 Day Streak':
        return leaderboardEntry.loginStreak >= 30;
      case '100 Hours Studied':
        return leaderboardEntry.totalStudyTime >= 100 * 3600; // 100 hours
      case 'Top Performer':
        return leaderboardEntry.rank === 1;
      case 'Coding Champion':
        return leaderboardEntry.codingProblemsSolved >= 10;
      case 'Assessment Master':
        return leaderboardEntry.assessmentsPassed >= 5;
      case 'Perfect Attendance':
        // Simulation or direct attendance count check (e.g. 10 transactions)
        const count = await PointTransaction.countDocuments({ userId, reason: 'attendance' });
        return count >= 10;
      case 'Video Completion Master':
        return leaderboardEntry.videosCompleted >= 10;
      case 'Roadmap Finisher':
        // Checked against overall progress
        return user.overallProgress >= 100;
      default:
        return false;
    }
  };

  const badges = await Badge.find({ isActive: true });
  let saved = false;

  for (const b of badges) {
    if (!currentBadgeKeys.includes(b._id.toString())) {
      const qualified = await checkBadgeCondition(b.name);
      if (qualified) {
        user.earnedBadges.push({ badgeId: b._id, earnedAt: new Date() });
        leaderboardEntry.badges.push({ badgeId: b._id, earnedAt: new Date() });
        saved = true;

        await createNotification(
          userId,
          'badge_earned',
          `🏅 Badge Unlocked: ${b.name}`,
          `You have earned the "${b.name}" badge! ${b.icon}`
        );
      }
    }
  }

  if (saved) {
    await user.save();
  }
};

/**
 * Bulk recalculate and update ranks of all students
 */
const recalculateRankings = async () => {
  const entries = await Leaderboard.find()
    .sort({
      points: -1,
      averageAssessmentScore: -1,
      totalStudyTime: -1,
      codingProblemsSolved: -1,
      loginStreak: -1
    });

  const bulkOps = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const oldRank = entry.rank || 0;
    const newRank = i + 1;

    // Trigger Rank Change Notifications
    if (oldRank !== newRank) {
      if (newRank === 1) {
        await createNotification(
          entry.userId, 
          'rank_change', 
          '👑 Crown Achieved!', 
          'Incredible! You are now Rank #1 globally on CodeWave!'
        );
      } else if (newRank <= 10 && (oldRank > 10 || oldRank === 0)) {
        await createNotification(
          entry.userId, 
          'rank_change', 
          '🚀 Entering the Hall of Fame!', 
          `Congratulations! You climbed into the Top 10 and are now ranked #${newRank}!`
        );
      }
    }

    bulkOps.push({
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { rank: newRank } }
      }
    });
  }

  if (bulkOps.length > 0) {
    await Leaderboard.bulkWrite(bulkOps);
  }
};

/**
 * Reset points transactions inside a specific timeframe
 */
const resetTimeboundRankings = async (timeframe) => {
  const now = new Date();
  let dateLimit = new Date();

  if (timeframe === 'weekly') {
    dateLimit.setDate(now.getDate() - 7);
  } else if (timeframe === 'monthly') {
    dateLimit.setDate(now.getDate() - 30);
  } else {
    throw new Error('Invalid timeframe for reset');
  }

  // Remove matching transactions
  await PointTransaction.deleteMany({
    createdAt: { $gte: dateLimit }
  });

  // Re-sync all leaderboard points from the remaining transaction histories
  const allEntries = await Leaderboard.find();
  for (const entry of allEntries) {
    const activeTransactions = await PointTransaction.find({ userId: entry.userId });
    entry.points = activeTransactions.reduce((sum, tx) => sum + tx.points, 0);
    const levelDetails = calculateLevel(entry.points);
    entry.level = levelDetails.level;
    await entry.save();
  }

  await recalculateRankings();
};

module.exports = {
  getGamificationSettings,
  seedDefaultBadges,
  calculateLevel,
  awardPoints,
  recalculateRankings,
  resetTimeboundRankings
};
