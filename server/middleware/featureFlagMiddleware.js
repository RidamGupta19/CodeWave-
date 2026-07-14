const FeatureFlag = require('../models/FeatureFlag');

/**
 * Middleware to check if a specific platform feature is enabled.
 * If the feature flag is disabled or not found, it rejects the request with HTTP 403.
 * 
 * @param {String} featureKey - The unique key of the feature to check.
 */
const checkFeature = (featureKey) => {
  return async (req, res, next) => {
    try {
      const feature = await FeatureFlag.findOne({ featureKey });
      
      // If the feature is not found or is explicitly disabled, reject
      if (!feature || !feature.enabled) {
        return res.status(403).json({
          success: false,
          message: 'This feature is currently disabled by the administrator.'
        });
      }
      
      next();
    } catch (err) {
      console.error(`Error checking feature status for ${featureKey}:`, err.message);
      // Fallback: block request on database lookup failure (failsafe/secure default)
      return res.status(403).json({
        success: false,
        message: 'This feature is currently disabled by the administrator.'
      });
    }
  };
};

module.exports = { checkFeature };
