const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, default: '' },
  icon: { type: String, default: '🚀' },
  color: { type: String, default: '#6366f1' },
  difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedDuration: { type: String, default: '3-6 months' },
  prerequisites: [{ type: String }],
  careerRoles: [{ type: String }],
  totalPhases: { type: Number, default: 0 },
  totalTopics: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  finalProject: {
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  suggestedNextDomain: { type: String, default: '' },
  certificationAvailable: { type: Boolean, default: true },
  freeBenefits: [{
    title: { type: String },
    link: { type: String },
    platform: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Domain', domainSchema);
