const { authorize } = require('./authMiddleware');

const adminOnly = authorize('admin');

module.exports = { adminOnly };
