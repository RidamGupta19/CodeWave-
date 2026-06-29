const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    index: true
  },
  points: {
    type: Number,
    default: 0,
    index: true
  },
  rank: {
    type: Number,
    default: 0,
    index: true
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  totalLoginCount: {
    type: Number,
    default: 0
  },
  loginStreak: {
    type: Number,
    default: 0
  },
  videosCompleted: {
    type: Number,
    default: 0
  },
  assessmentsAttempted: {
    type: Number,
    default: 0
  },
  assessmentsPassed: {
    type: Number,
    default: 0
  },
  averageAssessmentScore: {
    type: Number,
    default: 0
  },
  assignmentsSubmitted: {
    type: Number,
    default: 0
  },
  codingProblemsSolved: {
    type: Number,
    default: 0
  },
  badges: [{
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  level: {
    type: Number,
    default: 1
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Multi-key compound index for sorting criteria priority
leaderboardSchema.index({
  points: -1,
  averageAssessmentScore: -1,
  totalStudyTime: -1,
  codingProblemsSolved: -1,
  loginStreak: -1
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
