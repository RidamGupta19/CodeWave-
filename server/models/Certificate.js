const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  issuedAt: { type: Date, default: Date.now },
  certificateId: { type: String, unique: true },
  completionPercentage: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Generate unique certificate ID
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = `CF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
