const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  ipAddress: { type: String, default: '' },
  deviceInfo: { type: String, default: '' },
  browserInfo: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastActivityAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserSession', userSessionSchema);
