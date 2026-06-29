const UserActivity = require('../models/UserActivity');

/**
 * Parses user agent to retrieve browser and device info
 */
const parseUserAgent = (userAgent) => {
  if (!userAgent) return { browser: 'Unknown', device: 'Unknown' };
  
  let browser = 'Unknown';
  let device = 'Desktop';

  if (/mobile/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/tablet/i.test(userAgent)) {
    device = 'Tablet';
  }

  if (/chrome|crios/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/opr/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  }

  return { browser, device };
};

/**
 * Records user login activity, manages streak calculations, and closes zombie sessions
 */
const recordLogin = async (user, userAgent, ipAddress) => {
  const userId = user._id;
  const role = user.role;
  const today = new Date().toISOString().split('T')[0];
  const { browser, device } = parseUserAgent(userAgent);

  let activity = await UserActivity.findOne({ userId });

  if (!activity) {
    activity = new UserActivity({
      userId,
      role,
      totalLoginCount: 1,
      totalSessions: 1,
      currentSessionStart: new Date(),
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
      currentLoginStreak: 1,
      lastLoginDate: today,
      deviceInfo: device,
      browserInfo: browser,
      ipAddress: ipAddress || '',
      loginDates: [today]
    });
  } else {
    // If there is an existing unclosed session, end it first using lastActiveAt or current time
    if (activity.currentSessionStart) {
      const endTime = activity.lastActiveAt || new Date();
      const sessionDuration = Math.round((endTime - activity.currentSessionStart) / 1000);
      activity.totalTimeSpentInSeconds += Math.max(0, sessionDuration);
      if (sessionDuration > activity.longestSessionDuration) {
        activity.longestSessionDuration = sessionDuration;
      }
    }

    activity.totalLoginCount += 1;
    activity.currentSessionStart = new Date();
    activity.lastLoginAt = new Date();
    activity.lastActiveAt = new Date();
    activity.deviceInfo = device || activity.deviceInfo;
    activity.browserInfo = browser || activity.browserInfo;
    activity.ipAddress = ipAddress || activity.ipAddress;

    // Login streak calculation
    if (activity.lastLoginDate) {
      const lastLogin = new Date(activity.lastLoginDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        activity.currentLoginStreak += 1;
      } else if (diffDays > 1) {
        activity.currentLoginStreak = 1;
      }
      // If diffDays === 0, keep currentStreak
    } else {
      activity.currentLoginStreak = 1;
    }
    activity.lastLoginDate = today;

    // Push login date if not already recorded today
    if (!activity.loginDates.includes(today)) {
      activity.loginDates.push(today);
    }
  }

  await activity.save();

  // Award Daily Login points & Streak points
  if (role === 'student' || (activity.role === 'student')) {
    try {
      const gamificationService = require('./gamificationService');
      await gamificationService.awardPoints(userId, 'login', null, today);
      if (activity.currentLoginStreak > 1) {
        await gamificationService.awardPoints(userId, 'streak', null, today);
      }
    } catch (err) {
      console.error('Gamification login trigger failed:', err.message);
    }
  }

  return activity;
};

/**
 * Records explicit user logout and closes the current active session
 */
const recordLogout = async (userId) => {
  const activity = await UserActivity.findOne({ userId });
  if (activity && activity.currentSessionStart) {
    const sessionDuration = Math.round((new Date() - activity.currentSessionStart) / 1000);
    activity.totalTimeSpentInSeconds += Math.max(0, sessionDuration);
    activity.lastLogoutAt = new Date();
    if (sessionDuration > activity.longestSessionDuration) {
      activity.longestSessionDuration = sessionDuration;
    }
    activity.currentSessionStart = null;
    await activity.save();
  }
  return activity;
};

/**
 * Updates active user session durations, pages visited, and hourly peak patterns
 */
const recordHeartbeat = async (userId, role, pageName, timeSpent, active, isNewVisit) => {
  let activity = await UserActivity.findOne({ userId });
  const today = new Date().toISOString().split('T')[0];

  if (!activity) {
    activity = new UserActivity({
      userId,
      role,
      currentSessionStart: new Date(),
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
      totalLoginCount: 1,
      totalSessions: 1,
      lastLoginDate: today,
      loginDates: [today]
    });
  }

  activity.lastActiveAt = new Date();

  // 1. Update page visit count first if isNewVisit is true
  if (pageName && isNewVisit) {
    let page = activity.pages.find(p => p.pageName === pageName);
    if (!page) {
      activity.pages.push({ pageName, visitCount: 1, timeSpentOnPage: 0 });
    } else {
      page.visitCount += 1;
    }
  }

  // 2. Accumulate active time spent if active is true and timeSpent > 0
  if (active) {
    const secondsToAdd = Number(timeSpent) || 0;
    if (secondsToAdd > 0) {
      activity.totalTimeSpentInSeconds += secondsToAdd;

      // Update daily active minutes/seconds
      let daily = activity.dailyActiveTime.find(d => d.date === today);
      if (!daily) {
        activity.dailyActiveTime.push({ date: today, timeSpentSeconds: secondsToAdd });
      } else {
        daily.timeSpentSeconds += secondsToAdd;
      }

      // Update page time spent
      if (pageName) {
        let page = activity.pages.find(p => p.pageName === pageName);
        if (!page) {
          activity.pages.push({ pageName, visitCount: 0, timeSpentOnPage: secondsToAdd });
        } else {
          page.timeSpentOnPage += secondsToAdd;
        }
      }

      // Update hourly activity density
      const currentHour = new Date().getHours();
      if (!activity.hourlyActivity || activity.hourlyActivity.length !== 24) {
        activity.hourlyActivity = Array(24).fill(0);
      }
      activity.hourlyActivity[currentHour] += 1;
    }
  }

  // Update total pages visited if new visit is true
  if (isNewVisit) {
    activity.totalPagesVisited += 1;
  }

  // Tell mongoose arrays have changed
  activity.markModified('pages');
  activity.markModified('dailyActiveTime');
  activity.markModified('hourlyActivity');

  await activity.save();
  return activity;
};

/**
 * Tracks granular video lecture progress and updates video analytics
 */
const trackVideoActivity = async (userId, videoId, watchTime, completionPercentage, isCompleted) => {
  let activity = await UserActivity.findOne({ userId });
  if (!activity) return;

  if (!activity.videoAnalytics) {
    activity.videoAnalytics = { videosWatched: [], totalWatchTime: 0 };
  }

  let video = activity.videoAnalytics.videosWatched.find(v => v.videoId.toString() === videoId.toString());
  const prevWatchTime = video ? video.watchTime : 0;
  const timeDiff = Math.max(0, watchTime - prevWatchTime);

  if (!video) {
    activity.videoAnalytics.videosWatched.push({
      videoId,
      watchTime,
      completionPercentage,
      isCompleted,
      lastWatched: new Date()
    });
  } else {
    video.watchTime = Math.max(video.watchTime, watchTime);
    video.completionPercentage = Math.max(video.completionPercentage, completionPercentage);
    if (isCompleted) {
      video.isCompleted = true;
    }
  }

  const wasCompletedBefore = video ? video.isCompleted : false;
  if (isCompleted && video) {
    video.isCompleted = true;
  }

  activity.videoAnalytics.totalWatchTime += timeDiff;
  activity.totalVideosWatched = activity.videoAnalytics.videosWatched.filter(v => v.isCompleted).length;

  activity.markModified('videoAnalytics');
  await activity.save();

  // Award points if newly completed
  if (isCompleted && !wasCompletedBefore) {
    try {
      const gamificationService = require('./gamificationService');
      await gamificationService.awardPoints(userId, 'video', videoId);
    } catch (err) {
      console.error('Gamification video complete trigger failed:', err.message);
    }
  }
};

/**
 * Tracks granular assessment attempts and aggregates scores/passed stats
 */
const trackAssessmentActivity = async (userId, assessmentId, score, passed, timeSpentSeconds) => {
  let activity = await UserActivity.findOne({ userId });
  if (!activity) return;

  if (!activity.assessmentAnalytics) {
    activity.assessmentAnalytics = { assessmentsAttempted: [], totalPassed: 0, averageScore: 0, totalTimeSpent: 0 };
  }

  activity.assessmentAnalytics.assessmentsAttempted.push({
    assessmentId,
    score,
    passed,
    timeSpent: timeSpentSeconds || 0,
    attemptedAt: new Date()
  });

  const attempts = activity.assessmentAnalytics.assessmentsAttempted;
  activity.totalAssessmentsAttempted = attempts.length;
  activity.assessmentAnalytics.totalPassed = attempts.filter(a => a.passed).length;

  const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  activity.assessmentAnalytics.averageScore = Math.round(totalScore / attempts.length);
  activity.assessmentAnalytics.totalTimeSpent += (timeSpentSeconds || 0);

  activity.markModified('assessmentAnalytics');
  await activity.save();

  // Award points on passing
  if (passed) {
    try {
      const gamificationService = require('./gamificationService');
      await gamificationService.awardPoints(userId, 'assessment', assessmentId);
      if (score >= 90) {
        await gamificationService.awardPoints(userId, 'assessment_bonus', assessmentId);
      }
    } catch (err) {
      console.error('Gamification assessment trigger failed:', err.message);
    }
  }
};

/**
 * Tracks student assignment submissions count
 */
const trackAssignmentSubmission = async (userId, assignmentId = null) => {
  let activity = await UserActivity.findOne({ userId });
  if (!activity) return;

  activity.totalAssignmentsSubmitted += 1;
  await activity.save();

  // Award points for assignment submission
  try {
    const gamificationService = require('./gamificationService');
    await gamificationService.awardPoints(userId, 'assignment', assignmentId);
  } catch (err) {
    console.error('Gamification assignment trigger failed:', err.message);
  }
};

module.exports = {
  recordLogin,
  recordLogout,
  recordHeartbeat,
  trackVideoActivity,
  trackAssessmentActivity,
  trackAssignmentSubmission
};
