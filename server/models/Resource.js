const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  link: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'documentation', 'practice', 'tool', 'course', 'other'], default: 'article' },
  platform: { type: String, default: '' },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
  isFree: { type: Boolean, default: true },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
