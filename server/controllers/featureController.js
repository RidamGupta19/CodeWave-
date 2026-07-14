const FeatureFlag = require('../models/FeatureFlag');
const AuditLogs = require('../models/AuditLogs');

// @desc    Get all feature flags
// @route   GET /api/feature-flags (or /api/admin/feature-flags)
exports.getFeatureFlags = async (req, res) => {
  try {
    const { search, category, enabled } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { featureKey: { $regex: search, $options: 'i' } },
        { featureName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (enabled !== undefined) {
      filter.enabled = enabled === 'true';
    }

    const features = await FeatureFlag.find(filter).populate('updatedBy', 'fullName email').sort({ featureName: 1 });
    res.json({ success: true, data: features });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a feature flag (Super Admin only)
// @route   PUT /api/admin/feature-flags/:featureKey
exports.updateFeatureFlag = async (req, res) => {
  try {
    const { featureKey } = req.params;
    const { enabled } = req.body;

    if (enabled === undefined) {
      return res.status(400).json({ success: false, message: 'Enabled field is required.' });
    }

    const feature = await FeatureFlag.findOne({ featureKey });
    if (!feature) {
      return res.status(404).json({ success: false, message: 'Feature not found.' });
    }

    const previousStatus = feature.enabled;
    feature.enabled = enabled;
    feature.updatedBy = req.user._id;
    await feature.save();

    // Log this action to AuditLogs
    await AuditLogs.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'FEATURE_TOGGLE',
      details: `Feature "${feature.featureName}" (${featureKey}) toggled from ${previousStatus ? 'Enabled' : 'Disabled'} to ${enabled ? 'Enabled' : 'Disabled'} by Super Admin.`,
      previousValue: previousStatus,
      newValue: enabled,
      ipAddress: req.ip || req.connection.remoteAddress,
      deviceInfo: req.headers['user-agent'] || 'Unknown'
    });

    res.json({ success: true, message: `Feature "${feature.featureName}" updated successfully.`, data: feature });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk update feature flags (Super Admin only)
// @route   PUT /api/admin/feature-flags/bulk
exports.bulkUpdateFeatureFlags = async (req, res) => {
  try {
    const { featureKeys, enabled } = req.body;

    if (!Array.isArray(featureKeys) || featureKeys.length === 0 || enabled === undefined) {
      return res.status(400).json({ success: false, message: 'featureKeys (array) and enabled (boolean) are required.' });
    }

    const updatedFeatures = [];

    for (const key of featureKeys) {
      const feature = await FeatureFlag.findOne({ featureKey: key });
      if (feature) {
        const previousStatus = feature.enabled;
        feature.enabled = enabled;
        feature.updatedBy = req.user._id;
        await feature.save();

        // Log this action to AuditLogs
        await AuditLogs.create({
          userId: req.user._id,
          userEmail: req.user.email,
          action: 'FEATURE_TOGGLE',
          details: `Feature "${feature.featureName}" (${key}) bulk toggled from ${previousStatus ? 'Enabled' : 'Disabled'} to ${enabled ? 'Enabled' : 'Disabled'} by Super Admin.`,
          previousValue: previousStatus,
          newValue: enabled,
          ipAddress: req.ip || req.connection.remoteAddress,
          deviceInfo: req.headers['user-agent'] || 'Unknown'
        });

        updatedFeatures.push(feature);
      }
    }

    res.json({ success: true, message: `Successfully updated ${updatedFeatures.length} features.`, data: updatedFeatures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get feature toggling audit logs
// @route   GET /api/admin/feature-flags/logs
exports.getFeatureAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLogs.find({ action: 'FEATURE_TOGGLE' })
      .populate('userId', 'fullName role')
      .sort({ timestamp: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
