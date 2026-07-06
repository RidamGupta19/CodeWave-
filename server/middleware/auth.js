const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    if (req.user.status && req.user.status !== 'active') {
      return res.status(403).json({ success: false, message: `Your account is ${req.user.status}.` });
    }

    // Active session validation
    const UserSession = require('../models/UserSession');
    const session = await UserSession.findOne({ token });
    if (session && !session.isActive) {
      return res.status(401).json({ success: false, message: 'Session has been terminated by administrator' });
    }

    if (!session) {
      // Auto-create to support legacy/external tokens
      await UserSession.create({
        userId: req.user._id,
        token,
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        isActive: true,
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    } else {
      session.lastActivityAt = new Date();
      await session.save();
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

// Check granular sub-admin permission
const checkPermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    // Super-admins and specific seed/default admin emails bypass permission checks
    if (req.user.isSuperAdmin || req.user.email === 'admin@codewavesolution.com' || req.user.email === 'omshivhare666@gmail.com') {
      return next();
    }

    // Mapping legacy check keys to granular MERN Architect permission sections
    const permissionMapping = {
      'manage_settings': ['Profile Settings', 'Academic Settings', 'Authentication Settings', 'Storage Management', 'SMTP Configuration', 'Notifications Management'],
      'manage_students': ['User Management'],
      'manage_teachers': ['User Management'],
      'manage_subadmins': ['User Management'],
      'manage_courses': ['Content Management', 'Academic Settings'],
      'manage_problems': ['Content Management'],
      'manage_topics': ['Content Management'],
      'manage_analytics': ['Analytics Management']
    };

    const allowedMappedPermissions = permissionMapping[permission] || [permission];

    // Check user individual override permissions
    if (req.user.permissions) {
      if (req.user.permissions.includes(permission)) return next();
      for (const p of allowedMappedPermissions) {
        if (req.user.permissions.includes(p)) return next();
      }
    }

    // Check role-based permissions in DB
    try {
      const AdminPermissions = require('../models/AdminPermissions');
      let userRoleName = req.user.role;
      // Map 'admin' -> 'Admin'
      if (userRoleName === 'admin') userRoleName = 'Admin';

      const rolePermissions = await AdminPermissions.findOne({ role: { $regex: new RegExp(`^${userRoleName}$`, 'i') } });
      if (rolePermissions) {
        if (rolePermissions.permissions.includes(permission)) return next();
        for (const p of allowedMappedPermissions) {
          if (rolePermissions.permissions.includes(p)) return next();
        }
      }
    } catch (err) {
      console.error('Failed to query role permissions:', err.message);
    }

    return res.status(403).json({
      success: false,
      message: `You do not have permission to perform this action (${permission})`
    });
  };
};

module.exports = { protect, authorize, checkPermission };
