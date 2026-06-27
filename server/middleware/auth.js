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
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    // Super-admins and specific seed/default admin emails bypass permission checks
    if (req.user.isSuperAdmin || req.user.email === 'admin@codewavesolution.com' || req.user.email === 'omshivhare666@gmail.com') {
      return next();
    }
    // Sub-admins must have the specific permission string
    if (req.user.permissions && req.user.permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `You do not have permission to perform this action (${permission})`
    });
  };
};

module.exports = { protect, authorize, checkPermission };
