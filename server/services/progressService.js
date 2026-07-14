const Badge = require('../models/Badge');
const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

const getProgressKey = (slug) => {
  if (!slug) return 'dsa';
  const lowercaseSlug = slug.toLowerCase();
  if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
  if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
  if (lowercaseSlug === 'devops') return 'devops';
  if (lowercaseSlug === 'dsa') return 'dsa';
  if (lowercaseSlug.includes('web') || lowercaseSlug.includes('ui-ux')) return 'webdev';
  if (lowercaseSlug.includes('open') || lowercaseSlug.includes('git')) return 'opensource';
  if (lowercaseSlug.includes('dsa') || lowercaseSlug.includes('data')) return 'dsa';
  return 'devops';
};

const XP_REWARDS = {
  Easy: 40,
  Medium: 80,
  Hard: 140
};

const toDateKey = (value) => new Date(value).toISOString().split('T')[0];

const ensureProgressDocument = async (userId) => {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) {
    progress = await UserProgress.create({ user: userId });
  }
  return progress;
};

const updateStreakState = (streak = {}, now = new Date()) => {
  const todayKey = toDateKey(now);
  const lastActiveKey = streak.lastActiveDate ? toDateKey(streak.lastActiveDate) : null;

  if (lastActiveKey === todayKey) {
    return {
      currentStreak: streak.currentStreak || 1,
      longestStreak: Math.max(streak.longestStreak || 0, streak.currentStreak || 1),
      lastActiveDate: now
    };
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  const currentStreak = lastActiveKey === yesterdayKey ? (streak.currentStreak || 0) + 1 : 1;

  return {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak || 0, currentStreak),
    lastActiveDate: now
  };
};

const recomputeAggregates = async (progressDoc, user) => {
  const solvedIds = progressDoc.solvedProblems || [];
  const attemptedIds = progressDoc.attemptedProblems || [];

  const [solvedDocs, attemptedDocs, totalsByDomain, completedTopics] = await Promise.all([
    Problem.find({ _id: { $in: solvedIds } }).select('domain topic difficulty'),
    Problem.find({ _id: { $in: attemptedIds } }).select('domain topic difficulty'),
    Problem.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$domain', totalProblems: { $sum: 1 } } }
    ]),
    user?.completedTopics?.length
      ? Topic.find({
          _id: { $in: user.completedTopics.map((entry) => entry.topicId).filter(Boolean) }
        }).select('domainId')
      : []
  ]);

  const completedTopicCountByDomain = new Map();
  completedTopics.forEach((topic) => {
    const domainId = topic.domainId?.toString();
    if (!domainId) return;
    completedTopicCountByDomain.set(
      domainId,
      (completedTopicCountByDomain.get(domainId) || 0) + 1
    );
  });

  const solvedByDomain = new Map();
  solvedDocs.forEach((problem) => {
    const domainId = problem.domain?.toString();
    if (!domainId) return;
    solvedByDomain.set(domainId, (solvedByDomain.get(domainId) || 0) + 1);
  });

  progressDoc.domainProgress = totalsByDomain
    .map((entry) => {
      const domainId = entry._id?.toString();
      const solvedProblems = solvedByDomain.get(domainId) || 0;
      const completedTopicCount = completedTopicCountByDomain.get(domainId) || 0;
      const totalProblems = entry.totalProblems || 0;
      const completionPercentage = totalProblems
        ? Math.round((solvedProblems / totalProblems) * 100)
        : 0;

      return {
        domain: entry._id,
        completedTopics: completedTopicCount,
        solvedProblems,
        totalProblems,
        completionPercentage
      };
    })
    .filter((entry) => entry.totalProblems > 0 || entry.solvedProblems > 0 || entry.completedTopics > 0);

  const topicProgressMap = new Map();
  attemptedDocs.forEach((problem) => {
    const key = `${problem.domain?.toString() || 'unknown'}::${problem.topic}`;
    const current = topicProgressMap.get(key) || {
      domain: problem.domain,
      topic: problem.topic,
      solvedProblems: 0,
      attemptedProblems: 0
    };
    current.attemptedProblems += 1;
    topicProgressMap.set(key, current);
  });

  solvedDocs.forEach((problem) => {
    const key = `${problem.domain?.toString() || 'unknown'}::${problem.topic}`;
    const current = topicProgressMap.get(key) || {
      domain: problem.domain,
      topic: problem.topic,
      solvedProblems: 0,
      attemptedProblems: 0
    };
    current.solvedProblems += 1;
    topicProgressMap.set(key, current);
  });

  progressDoc.topicProgress = Array.from(topicProgressMap.values()).sort((a, b) => {
    if (b.solvedProblems !== a.solvedProblems) {
      return b.solvedProblems - a.solvedProblems;
    }
    return b.attemptedProblems - a.attemptedProblems;
  });

  progressDoc.difficultyStats = solvedDocs.reduce(
    (stats, problem) => {
      if (problem.difficulty === 'Easy') stats.easySolved += 1;
      if (problem.difficulty === 'Medium') stats.mediumSolved += 1;
      if (problem.difficulty === 'Hard') stats.hardSolved += 1;
      return stats;
    },
    { easySolved: 0, mediumSolved: 0, hardSolved: 0 }
  );
};

const syncProgressBadges = async (user, progressDoc) => {
  const badgeNames = [];

  if ((progressDoc.solvedProblems || []).length > 0) {
    badgeNames.push('First Step');
  }
  if ((progressDoc.streak?.currentStreak || 0) >= 7) {
    badgeNames.push('7-Day Streak');
  }
  if ((progressDoc.streak?.currentStreak || 0) >= 30) {
    badgeNames.push('30-Day Streak');
  }

  if (badgeNames.length === 0) {
    return;
  }

  const badges = await Badge.find({ name: { $in: badgeNames } }).select('_id');
  const earnedBadgeIds = new Set(
    (user.earnedBadges || []).map((badge) => badge.badgeId?.toString()).filter(Boolean)
  );

  badges.forEach((badge) => {
    const badgeId = badge._id.toString();
    if (!earnedBadgeIds.has(badgeId)) {
      user.earnedBadges.push({ badgeId: badge._id, earnedAt: new Date() });
    }
  });
};

const updateAfterSubmission = async ({ userId, problem, status }) => {
  const now = new Date();
  const [progressDoc, user] = await Promise.all([
    ensureProgressDocument(userId),
    User.findById(userId)
  ]);

  if (!user) {
    throw new Error('User not found while updating progress.');
  }

  progressDoc.totalSubmissions += 1;

  const attemptedIds = new Set(
    (progressDoc.attemptedProblems || []).map((id) => id.toString())
  );
  if (!attemptedIds.has(problem._id.toString())) {
    progressDoc.attemptedProblems.push(problem._id);
  }

  const solvedIds = new Set(
    (progressDoc.solvedProblems || []).map((id) => id.toString())
  );
  const isFirstAcceptedSolve = status === 'Accepted' && !solvedIds.has(problem._id.toString());

  if (status === 'Accepted') {
    progressDoc.acceptedSubmissions += 1;
    if (isFirstAcceptedSolve) {
      progressDoc.solvedProblems.push(problem._id);
      
      const Domain = require('../models/Domain');
      const domainObj = await Domain.findById(problem.domain);
      const domainSlug = domainObj ? domainObj.slug : 'dsa';
      const key = getProgressKey(domainSlug);
      
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
          codeSubmissions: []
        };
      }
      
      user.domainsProgress[key].xp = (user.domainsProgress[key].xp || 0) + (XP_REWARDS[problem.difficulty] || 50);
      user.markModified(`domainsProgress.${key}`);
      
      try {
        const gamificationService = require('./gamificationService');
        await gamificationService.awardPoints(userId, 'problem', problem._id);
      } catch (err) {
        console.error('Failed to award points for problem solve:', err.message);
      }
    }
  }

  progressDoc.streak = updateStreakState(progressDoc.streak, now);
  progressDoc.recentActivity = [
    {
      problem: problem._id,
      title: problem.title,
      domain: problem.domain,
      topic: problem.topic,
      status,
      submittedAt: now
    },
    ...(progressDoc.recentActivity || [])
  ].slice(0, 20);

  await recomputeAggregates(progressDoc, user);

  user.lastActiveDate = progressDoc.streak.lastActiveDate;
  user.dailyStreak = progressDoc.streak.currentStreak;

  await syncProgressBadges(user, progressDoc);

  await Promise.all([progressDoc.save(), user.save()]);

  return progressDoc;
};

module.exports = {
  ensureProgressDocument,
  updateAfterSubmission
};
