const mongoose = require('mongoose');

const instituteSettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'CodeWave Coaching Institute'
  },
  logo: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: '123 Technology Park, Silicon Valley'
  },
  contactDetails: {
    phone: { type: String, default: '9876543210' },
    email: { type: String, default: 'contact@codewave.com' },
    website: { type: String, default: 'https://codewave.com' }
  },
  sessions: {
    type: [String],
    default: ['2025-2026', '2026-2027']
  },
  holidays: [{
    name: { type: String, required: true },
    date: { type: Date, required: true }
  }],
  workingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  timetable: {
    startHour: { type: String, default: '09:00 AM' },
    endHour: { type: String, default: '06:00 PM' }
  },
  passwordPolicies: {
    minLength: { type: Number, default: 6 },
    requireSpecialChar: { type: Boolean, default: false },
    requireUppercase: { type: Boolean, default: false }
  },
  sessionTimeout: {
    type: Number,
    default: 60 // in minutes
  },
  loginSecurity: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutTime: { type: Number, default: 15 } // in minutes
  },
  uploadLimits: {
    type: Number,
    default: 50 // in MB
  },
  allowedFileTypes: {
    type: [String],
    default: ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.mp4']
  },
  videoLimits: {
    type: Number,
    default: 500 // in MB
  },
  smtp: {
    host: { type: String, default: 'smtp.mailtrap.io' },
    port: { type: Number, default: 2525 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    fromEmail: { type: String, default: 'noreply@codewave.com' }
  },
  pushNotifications: {
    enabled: { type: Boolean, default: false },
    provider: { type: String, default: 'OneSignal' }
  },
  announcementSettings: {
    defaultChannel: { type: String, default: 'general' },
    allowStudentReply: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('InstituteSettings', instituteSettingsSchema);
