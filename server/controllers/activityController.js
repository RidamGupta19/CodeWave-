const UserActivity = require('../models/UserActivity');
const Student = require('../models/Student');
const activityService = require('../services/activityService');

/**
 * GET /api/activity/me
 * Returns detailed activity logs for the authenticated user
 */
exports.getMyActivity = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email role');
    if (!activity) {
      return res.status(404).json({ success: false, message: 'No activity tracking data found' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/activity/summary
 * Returns summarized activity details for user dashboard panels
 */
exports.getActivitySummary = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.user._id });
    if (!activity) {
      return res.json({
        success: true,
        data: {
          totalHours: 0,
          totalLogins: 0,
          learningStreak: 0,
          videosWatched: 0,
          assessmentsAttempted: 0,
          timeSpentThisWeek: 0,
          timeSpentThisMonth: 0
        }
      });
    }

    // Weekly and Monthly active time aggregates (in minutes)
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const weekAgo = new Date(now.getTime() - 7 * oneDayMs);
    const monthAgo = new Date(now.getTime() - 30 * oneDayMs);

    let timeSpentThisWeek = 0;
    let timeSpentThisMonth = 0;

    if (activity.dailyActiveTime) {
      activity.dailyActiveTime.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= weekAgo) {
          timeSpentThisWeek += entry.timeSpentSeconds;
        }
        if (entryDate >= monthAgo) {
          timeSpentThisMonth += entry.timeSpentSeconds;
        }
      });
    }

    res.json({
      success: true,
      data: {
        totalHours: Number((activity.totalTimeSpentInSeconds / 3600).toFixed(1)),
        totalLogins: activity.totalLoginCount,
        learningStreak: activity.currentLoginStreak,
        videosWatched: activity.totalVideosWatched,
        assessmentsAttempted: activity.totalAssessmentsAttempted,
        timeSpentThisWeek: Math.round(timeSpentThisWeek / 60), // minutes
        timeSpentThisMonth: Math.round(timeSpentThisMonth / 60) // minutes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/activity/users
 * Returns activity summary cards, chart trends, and users table for administrators
 */
exports.getAdminUsersActivity = async (req, res) => {
  try {
    const activities = await UserActivity.find()
      .populate({
        path: 'userId',
        select: 'fullName email role activeDomain',
        populate: { path: 'activeDomain', select: 'name slug' }
      });

    const students = await Student.find().populate('course', 'courseName');
    const studentMap = {};
    students.forEach(s => {
      if (s.userId) {
        studentMap[s.userId.toString()] = s;
      }
    });

    const formattedUsers = activities.map(act => {
      if (!act.userId) return null;

      const user = act.userId;
      const studentProfile = studentMap[user._id.toString()];
      const courseName = studentProfile?.course?.courseName || user.activeDomain?.name || 'General';

      // Find the user's most visited page
      let mostVisitedPage = 'None';
      if (act.pages && act.pages.length > 0) {
        const sortedPages = [...act.pages].sort((a, b) => b.visitCount - a.visitCount);
        mostVisitedPage = sortedPages[0].pageName;
      }

      return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        courseName,
        totalLogins: act.totalLoginCount,
        lastLogin: act.lastLoginAt,
        lastActive: act.lastActiveAt,
        totalTimeSpent: act.totalTimeSpentInSeconds,
        avgSessionDuration: act.totalSessions > 0 ? Math.round(act.totalTimeSpentInSeconds / act.totalSessions) : 0,
        loginStreak: act.currentLoginStreak,
        videosWatched: act.totalVideosWatched,
        assessmentsAttempted: act.totalAssessmentsAttempted,
        mostVisitedPage: mostVisitedPage.charAt(0).toUpperCase() + mostVisitedPage.slice(1)
      };
    }).filter(Boolean);

    // Calculate Admin Dashboard Cards
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const todayStr = now.toISOString().split('T')[0];

    const activeToday = activities.filter(a => a.lastActiveAt && (now - a.lastActiveAt) <= oneDayMs).length;
    const activeThisWeek = activities.filter(a => a.lastActiveAt && (now - a.lastActiveAt) <= 7 * oneDayMs).length;
    const activeThisMonth = activities.filter(a => a.lastActiveAt && (now - a.lastActiveAt) <= 30 * oneDayMs).length;

    let totalSessions = 0;
    let totalTime = 0;
    let sessionsToday = 0;

    activities.forEach(a => {
      totalSessions += a.totalSessions || 0;
      totalTime += a.totalTimeSpentInSeconds || 0;
      if (a.lastLoginAt && a.lastLoginAt.toISOString().split('T')[0] === todayStr) {
        sessionsToday += 1;
      }
    });

    const avgSessionTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

    // Get the most active student accounts
    const mostActiveStudents = formattedUsers
      .filter(u => u.role === 'student')
      .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent)
      .slice(0, 5);

    const cards = {
      dau: activeToday,
      wau: activeThisWeek,
      mau: activeThisMonth,
      avgSessionTime: Math.round(avgSessionTime / 60), // in minutes
      totalSessionsToday: sessionsToday,
      mostActiveStudents
    };

    // Calculate Login Trends & User Activity Trends (last 7 days)
    const loginTrends = [];
    const userActivityTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * oneDayMs);
      const dateStr = d.toISOString().split('T')[0];
      
      let loginCount = 0;
      let timeSpentSeconds = 0;

      activities.forEach(a => {
        if (a.loginDates && a.loginDates.includes(dateStr)) {
          loginCount += 1;
        }
        if (a.dailyActiveTime) {
          const entry = a.dailyActiveTime.find(e => e.date === dateStr);
          if (entry) {
            timeSpentSeconds += entry.timeSpentSeconds;
          }
        }
      });

      loginTrends.push({ date: dateStr, count: loginCount });
      userActivityTrends.push({ date: dateStr, minutes: Math.round(timeSpentSeconds / 60) });
    }

    // Time Spent Trends (accumulate page-wise active time across users)
    const pageTimeMap = {};
    activities.forEach(a => {
      if (a.pages) {
        a.pages.forEach(p => {
          pageTimeMap[p.pageName] = (pageTimeMap[p.pageName] || 0) + p.timeSpentOnPage;
        });
      }
    });
    const timeSpentTrends = Object.keys(pageTimeMap).map(pageName => ({
      name: pageName.charAt(0).toUpperCase() + pageName.slice(1),
      value: Math.round(pageTimeMap[pageName] / 60)
    }));

    // Course Engagement distribution (time spent grouped by Course Name)
    const courseEngagementMap = {};
    formattedUsers.forEach(u => {
      courseEngagementMap[u.courseName] = (courseEngagementMap[u.courseName] || 0) + u.totalTimeSpent;
    });
    const courseEngagement = Object.keys(courseEngagementMap).map(cName => ({
      course: cName,
      minutes: Math.round(courseEngagementMap[cName] / 60)
    }));

    // Peak Activity Hours density (summed across users)
    const peakHoursArray = Array(24).fill(0);
    activities.forEach(a => {
      if (a.hourlyActivity && a.hourlyActivity.length === 24) {
        for (let h = 0; h < 24; h++) {
          peakHoursArray[h] += a.hourlyActivity[h] || 0;
        }
      }
    });
    const peakHours = peakHoursArray.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      density: count
    }));

    res.json({
      success: true,
      users: formattedUsers,
      cards,
      charts: {
        loginTrends,
        userActivityTrends,
        timeSpentTrends,
        courseEngagement,
        peakHours
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/activity/:userId
 * Returns detailed logs of a specific user
 */
exports.getUserActivityDetail = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.params.userId })
      .populate('userId', 'fullName email role activeDomain')
      .populate('videoAnalytics.videosWatched.videoId', 'title subject duration')
      .populate('assessmentAnalytics.assessmentsAttempted.assessmentId', 'title passingScore');
      
    if (!activity) {
      return res.status(404).json({ success: false, message: 'No activity tracking data found for this user' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/activity/heartbeat
 * Heartbeat listener to register activity intervals
 */
exports.heartbeat = async (req, res) => {
  try {
    const { pageName, timeSpent, active, isNewVisit } = req.body;
    await activityService.recordHeartbeat(
      req.user._id,
      req.user.role,
      pageName,
      timeSpent,
      active !== undefined ? active : true,
      isNewVisit !== undefined ? isNewVisit : false
    );
    res.json({ success: true, message: 'Heartbeat registered' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/activity/session/end
 * Explicitly terminates the current session
 */
exports.endSession = async (req, res) => {
  try {
    await activityService.recordLogout(req.user._id);
    res.json({ success: true, message: 'Session ended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
