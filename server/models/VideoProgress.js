const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  watchTime: {
    type: Number,
    default: 0 // current position in seconds
  },
  duration: {
    type: Number,
    default: 0 // total duration in seconds
  },
  progressPercentage: {
    type: Number,
    default: 0 // watchTime / duration * 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Make user + video combination unique
videoProgressSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
