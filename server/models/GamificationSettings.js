const mongoose = require('mongoose');

const gamificationSettingsSchema = new mongoose.Schema({
  pointsConfig: {
    dailyLogin: { type: Number, default: 5 },
    completeVideo: { type: Number, default: 10 },
    completeRoadmapModule: { type: Number, default: 25 },
    passAssessment: { type: Number, default: 30 },
    score90PlusBonus: { type: Number, default: 50 },
    submitAssignment: { type: Number, default: 20 },
    solveCodingProblem: { type: Number, default: 15 },
    maintainDailyStreak: { type: Number, default: 10 },
    perfectAttendance: { type: Number, default: 50 }
  }
}, { timestamps: true });

module.exports = mongoose.model('GamificationSettings', gamificationSettingsSchema);
