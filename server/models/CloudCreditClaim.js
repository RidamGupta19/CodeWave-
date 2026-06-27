const mongoose = require('mongoose');

const cloudCreditClaimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cloudCredit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloudCredit',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  voucherCode: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 100
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate claims by creating a unique compound index
cloudCreditClaimSchema.index({ user: 1, cloudCredit: 1 }, { unique: true });

module.exports = mongoose.model('CloudCreditClaim', cloudCreditClaimSchema);
