const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['external', 'custom', 'certification'], default: 'external' },
  platform: { type: String, enum: ['HackerRank', 'GFG', 'LeetCode', 'CodeChef', 'Custom', 'Other'], default: 'HackerRank' },
  assessmentLink: { type: String, default: 'ADMIN_WILL_ADD_HACKERRANK_ASSESSMENT_LINK' },
  hackerRankCertificationLink: { type: String, default: '' },
  passingScore: { type: Number, default: 60 },
  difficultyRating: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  maxAttempts: { type: Number, default: 3 },
  unlocksNextPhase: { type: Boolean, default: true },
  adminEditable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
