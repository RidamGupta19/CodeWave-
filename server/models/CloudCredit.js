const mongoose = require('mongoose');

const cloudCreditSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  link: { type: String, required: true },
  platform: { type: String, required: true },
  icon: { type: String, default: '☁️' },
  category: { type: String, enum: ['cloud', 'hosting', 'database', 'tool', 'education', 'other'], default: 'cloud' },
  isFree: { type: Boolean, default: true },
  eligibility: { type: String, default: 'Students' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CloudCredit', cloudCreditSchema);
