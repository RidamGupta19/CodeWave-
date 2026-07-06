const mongoose = require('mongoose');

const storageSettingsSchema = new mongoose.Schema({
  totalPlatformStorage: { type: Number, default: 100 }, // in GB
  videoStorageLimit: { type: Number, default: 1024 }, // in MB (per file or total limit per course)
  notesUploadLimit: { type: Number, default: 50 }, // in MB
  assignmentUploadLimit: { type: Number, default: 20 }, // in MB
  userProfileImageLimit: { type: Number, default: 3 }, // in MB
  maxFileUploadSize: { type: Number, default: 50 }, // in MB
  allowedFileTypes: { type: [String], default: ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.mp4'] },
  storageUsageStats: {
    videoUsage: { type: Number, default: 0 }, // in MB
    notesUsage: { type: Number, default: 0 }, // in MB
    assignmentUsage: { type: Number, default: 0 }, // in MB
    avatarUsage: { type: Number, default: 0 } // in MB
  }
}, { timestamps: true });

module.exports = mongoose.model('StorageSettings', storageSettingsSchema);
