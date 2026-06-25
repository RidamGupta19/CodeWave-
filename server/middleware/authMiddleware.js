const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize, checkPermission } = require('./auth');

const optionalProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, authorize, checkPermission, optionalProtect };
