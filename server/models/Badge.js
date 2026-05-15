const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏅' },
  color: { type: String, default: '#f59e0b' },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
  type: { type: String, enum: ['phase-completion', 'domain-completion', 'streak', 'special', 'assessment'], default: 'phase-completion' },
  unlockCondition: { type: String, default: 'Complete phase' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
