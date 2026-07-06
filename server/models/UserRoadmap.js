const mongoose = require('mongoose');

const levelConfigSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
  isLocked: { type: Boolean, default: true }
});

const userRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  currentLevel: {
    type: Number,
    default: 0
  },
  completedLevels: [{
    type: Number
  }],
  unlockedLevels: [{
    type: Number
  }],
  watchedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  completedAssessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  roadmapProgress: {
    type: Number, // Percentage 0-100
    default: 0
  },
  passingPercentage: {
    type: Number,
    default: 70
  },
  templateType: {
    type: String,
    enum: ['default', 'beginner', 'intermediate', 'advanced', 'custom'],
    default: 'default'
  },
  customRoadmapConfig: [levelConfigSchema]
}, { timestamps: true });

// Ensure unique roadmap per user and course
userRoadmapSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserRoadmap', userRoadmapSchema);
