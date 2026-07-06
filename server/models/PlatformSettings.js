const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  // Profile settings
  instituteName: { type: String, default: 'CodeWave Coaching Institute' },
  logo: { type: String, default: '' },
  address: { type: String, default: '123 Technology Park, Silicon Valley' },
  contactNumber: { type: String, default: '9876543210' },
  supportEmail: { type: String, default: 'support@codewave.com' },
  websiteUrl: { type: String, default: 'https://codewavesolution.com' },
  socialMediaLinks: {
    facebook: { type: String, default: 'https://facebook.com/codewave' },
    twitter: { type: String, default: 'https://twitter.com/codewave' },
    linkedin: { type: String, default: 'https://linkedin.com/company/codewave' },
    instagram: { type: String, default: 'https://instagram.com/codewave' }
  },
  timezone: { type: String, default: 'Asia/Kolkata' },
  language: { type: String, default: 'en' },
  themeSettings: {
    primaryColor: { type: String, default: '#0284c7' },
    secondaryColor: { type: String, default: '#0f172a' },
    darkMode: { type: Boolean, default: true }
  },

  // Academic Configuration
  academicYear: { type: String, default: '2026-2027' },
  sessionStartDate: { type: Date, default: new Date('2026-06-01') },
  sessionEndDate: { type: Date, default: new Date('2027-05-31') },
  workingDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  holidays: [{
    name: { type: String, required: true },
    date: { type: Date, required: true }
  }],
  attendanceRules: {
    minAttendancePercentage: { type: Number, default: 75 },
    enableAttendancePenalty: { type: Boolean, default: false }
  },
  passingPercentage: { type: Number, default: 40 },
  assignmentSubmissionRules: {
    allowLateSubmission: { type: Boolean, default: true },
    latePenaltyPercentage: { type: Number, default: 10 }
  },
  assessmentConfiguration: {
    durationMinutes: { type: Number, default: 60 },
    maxAttempts: { type: Number, default: 3 }
  },
  courseDuration: { type: Number, default: 6 }, // in months
  batchTimings: {
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '06:00 PM' }
  },

  // Authentication & Security Settings
  passwordPolicy: {
    minLength: { type: Number, default: 6 },
    requireSpecialChar: { type: Boolean, default: false },
    requireUppercase: { type: Boolean, default: false },
    passwordExpiry: { type: Number, default: 90 } // in days
  },
  sessionTimeout: { type: Number, default: 60 }, // in minutes
  loginSecurity: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutTime: { type: Number, default: 15 }, // in minutes
    enableTwoFactor: { type: Boolean, default: false },
    forceEmailVerification: { type: Boolean, default: false },
    jwtExpiration: { type: String, default: '30d' }
  }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
