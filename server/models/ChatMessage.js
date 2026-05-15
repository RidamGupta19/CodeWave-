const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  metadata: {
    domainContext: { type: String },
    progressContext: { type: String }
  }
}, { timestamps: true });

chatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
