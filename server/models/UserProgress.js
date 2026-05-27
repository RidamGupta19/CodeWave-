const mongoose = require('mongoose');

const domainProgressSchema = new mongoose.Schema(
  {
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    completedTopics: { type: Number, default: 0 },
    solvedProblems: { type: Number, default: 0 },
    totalProblems: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 }
  },
  { _id: false }
);

const topicProgressSchema = new mongoose.Schema(
  {
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    topic: { type: String, required: true, trim: true },
    solvedProblems: { type: Number, default: 0 },
    attemptedProblems: { type: Number, default: 0 }
  },
  { _id: false }
);

const recentActivitySchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    title: { type: String, default: '' },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    topic: { type: String, default: '' },
    status: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    domainProgress: { type: [domainProgressSchema], default: [] },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    attemptedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    topicProgress: { type: [topicProgressSchema], default: [] },
    difficultyStats: {
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 }
    },
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null }
    },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    recentActivity: { type: [recentActivitySchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProgress', userProgressSchema);
