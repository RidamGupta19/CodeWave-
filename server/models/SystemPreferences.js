const mongoose = require('mongoose');

const systemPreferencesSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  landingPageConfig: {
    showTestimonials: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true },
    heroTitle: { type: String, default: 'Learn Coding From Scratch' },
    heroSubtitle: { type: String, default: 'Empowering students to build, run and test code in real-time.' }
  },
  featureFlags: {
    enableAiChat: { type: Boolean, default: true },
    enableGamification: { type: Boolean, default: true },
    enableCloudCredits: { type: Boolean, default: true }
  },
  defaultTheme: { type: String, default: 'dark' },
  defaultUserSettings: {
    onboardingRequired: { type: Boolean, default: true },
    defaultRole: { type: String, default: 'student' }
  },
  platformBranding: {
    primaryColor: { type: String, default: '#0284c7' },
    accentColor: { type: String, default: '#10b981' },
    companyName: { type: String, default: 'CodeWave' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemPreferences', systemPreferencesSchema);
