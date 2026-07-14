const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema({
  featureKey: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  featureName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
