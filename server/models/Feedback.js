const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['feedback', 'suggestion', 'encouragement'], default: 'feedback' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
