const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  phaseNumber: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  estimatedDuration: { type: String, default: '1-2 weeks' },
  totalTopics: { type: Number, default: 0 },
  unlockRule: { type: String, default: 'Complete previous phase assessment' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

phaseSchema.index({ domainId: 1, phaseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Phase', phaseSchema);
