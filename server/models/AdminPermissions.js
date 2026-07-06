const mongoose = require('mongoose');

const adminPermissionsSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] },
  isCustom: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AdminPermissions', adminPermissionsSchema);
