const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['login', 'video', 'roadmap', 'assessment', 'assessment_bonus', 'assignment', 'problem', 'streak', 'attendance']
  },
  metadata: {
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    dateStr: {
      type: String,
      index: true // e.g. '2026-06-29' for daily login checks
    }
  }
}, { timestamps: true });

// Index for query performance
pointTransactionSchema.index({ userId: 1, reason: 1, 'metadata.referenceId': 1 });
pointTransactionSchema.index({ userId: 1, reason: 1, 'metadata.dateStr': 1 });
pointTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);
