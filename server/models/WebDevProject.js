const mongoose = require('mongoose');

const webDevProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
    index: true
  },
  files: {
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' }
  },
  version: {
    type: Number,
    default: 1
  },
  lastSavedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a user only has one project per topic
webDevProjectSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('WebDevProject', webDevProjectSchema);
