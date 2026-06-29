const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'teacher', 'mentor'],
    required: true
  },
  totalLoginCount: { type: Number, default: 0 },
  totalTimeSpentInSeconds: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  currentSessionStart: { type: Date, default: null },
  lastLoginAt: { type: Date },
  lastLogoutAt: { type: Date },
  lastActiveAt: { type: Date },
  longestSessionDuration: { type: Number, default: 0 }, // in seconds
  currentLoginStreak: { type: Number, default: 0 },
  lastLoginDate: { type: String }, // 'YYYY-MM-DD'
  totalVideosWatched: { type: Number, default: 0 },
  totalAssessmentsAttempted: { type: Number, default: 0 },
  totalAssignmentsSubmitted: { type: Number, default: 0 },
  totalPagesVisited: { type: Number, default: 0 },
  deviceInfo: { type: String, default: '' },
  browserInfo: { type: String, default: '' },
  ipAddress: { type: String, default: '' },

  // Page tracking
  pages: [{
    pageName: { type: String, required: true },
    visitCount: { type: Number, default: 0 },
    timeSpentOnPage: { type: Number, default: 0 } // in seconds
  }],

  // Video Analytics
  videoAnalytics: {
    videosWatched: [{
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
      watchTime: { type: Number, default: 0 }, // in seconds
      completionPercentage: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false },
      lastWatched: { type: Date, default: Date.now }
    }],
    totalWatchTime: { type: Number, default: 0 } // in seconds
  },

  // Assessment Analytics
  assessmentAnalytics: {
    assessmentsAttempted: [{
      assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
      score: { type: Number, default: 0 },
      passed: { type: Boolean, default: false },
      timeSpent: { type: Number, default: 0 }, // in seconds
      attemptedAt: { type: Date, default: Date.now }
    }],
    totalPassed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 } // in seconds
  },

  // Daily active tracker (for rolling active minutes in week/month)
  dailyActiveTime: [{
    date: { type: String }, // 'YYYY-MM-DD'
    timeSpentSeconds: { type: Number, default: 0 }
  }],

  // Logins list (for login trends grouping)
  loginDates: [{ type: String }], // 'YYYY-MM-DD'

  // Peak activity hours density (24-hour slots)
  hourlyActivity: {
    type: [Number],
    default: () => Array(24).fill(0)
  }
}, { timestamps: true });

// Setup indexes for role and active timestamp sorting
userActivitySchema.index({ role: 1 });
userActivitySchema.index({ lastActiveAt: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
