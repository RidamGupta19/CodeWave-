const mongoose = require('mongoose');

const roadmapProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  subjectProgress: [{
    subjectName: { type: String, required: true },
    isUnlocked: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    completionPercentage: { type: Number, default: 0 }
  }],
  assessmentStatus: [{
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    subjectName: { type: String, default: '' },
    isUnlocked: { type: Boolean, default: false },
    isPassed: { type: Boolean, default: false },
    bestScore: { type: Number, default: 0 },
    attemptsCount: { type: Number, default: 0 },
    attempts: [{
      score: { type: Number },
      passed: { type: Boolean },
      attemptedAt: { type: Date, default: Date.now }
    }]
  }],
  passingPercentage: {
    type: Number,
    default: 70
  }
}, { timestamps: true });

roadmapProgressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapProgress', roadmapProgressSchema);
