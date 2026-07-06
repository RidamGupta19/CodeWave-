const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  emailAlerts: {
    registration: { type: Boolean, default: true },
    login: { type: Boolean, default: false },
    assignmentDue: { type: Boolean, default: true },
    assessmentResults: { type: Boolean, default: true }
  },
  pushNotifications: {
    newVideos: { type: Boolean, default: true },
    newNotes: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    roadmapUnlocks: { type: Boolean, default: true }
  },
  systemAlerts: {
    serverErrors: { type: Boolean, default: true },
    lowStorage: { type: Boolean, default: true },
    failedJobs: { type: Boolean, default: false },
    failedEmails: { type: Boolean, default: true }
  },
  alertFrequency: { type: String, enum: ['instant', 'daily', 'weekly'], default: 'instant' }
}, { timestamps: true });

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
