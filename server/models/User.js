const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const domainProgressSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  currentPhase: { type: Number, default: 1 },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  currentCheckpoint: { type: String, default: '' },
  lastOpenedTopic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  videoProgress: {
    checkpointId: { type: String, default: '' },
    timestamp: { type: Number, default: 0 }
  },
  weakConcepts: [{ type: String }],
  aiContext: { type: mongoose.Schema.Types.Mixed, default: {} },
  completedTopics: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    completedAt: { type: Date, default: Date.now },
    studyTimeMinutes: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    difficultyFeedback: { type: String, enum: ['easy', 'medium', 'hard', 'unsolved', ''] },
    confidenceLevel: { type: Number, min: 1, max: 5 },
    revisionNeeded: { type: Boolean, default: false },
    revisionStatus: { type: String, enum: ['none', 'scheduled', 'completed'], default: 'none' }
  }],
  startedTopics: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    startedAt: { type: Date, default: Date.now }
  }],
  testResults: [{
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    score: { type: Number },
    passed: { type: Boolean },
    attemptedAt: { type: Date, default: Date.now },
    attemptNumber: { type: Number, default: 1 }
  }],
  codeSubmissions: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    code: { type: String },
    language: { type: String },
    status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Pending'], default: 'Pending' },
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    runtime: { type: Number },
    submittedAt: { type: Date, default: Date.now }
  }],
  dsaStats: {
    totalProblemsSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    strongestTopic: { type: String, default: '' },
    weakestTopic: { type: String, default: '' },
    lastSolvedAt: { type: Date }
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'admin', 'teacher', 'mentor'], default: 'student' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  
  // Student profile fields
  profile: {
    collegeName: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: Number, min: 1, max: 5 },
    semester: { type: Number, min: 1, max: 10 },
    knownLanguages: [{ type: String }],
    knownTools: [{ type: String }],
    currentSkillLevel: { type: String, enum: ['none', 'never', 'basic', 'projects', 'frontend', 'intermediate', 'beginner', 'advanced', 'some_problems', 'comfortable', ''], default: '' },
    careerInterest: { type: String, default: '' },
    goal: { type: String, enum: ['job', 'placements', 'internship', 'freelancing', 'startup', 'exploration', 'higher-studies', 'problem_solving', 'competitive', ''], default: '' },
    dailyStudyTime: { type: Number, default: 0 },  // in minutes
    targetCompletionTime: { type: String, default: '' },
    isProfileComplete: { type: Boolean, default: false },
    onboardingAnswers: { type: Object },
    roadmapType: { type: String, enum: ['Fast-Track', 'Steady Pace', 'Extended Journey', 'Internship-Focused', 'Freelance-Focused', 'Beginner Roadmap', ''], default: '' },
    estimatedTimeline: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
    recommendedProjects: [{ type: String }],
    xpMultiplier: { type: Number, default: 1.0 }
  },

  // Active domain context
  activeDomain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  
  // Multi-domain persistent progress (Single Source of Truth)
  domainsProgress: {
    dsa: { type: domainProgressSchema, default: () => ({}) },
    webdev: { type: domainProgressSchema, default: () => ({}) },
    devops: { type: domainProgressSchema, default: () => ({}) },
    opensource: { type: domainProgressSchema, default: () => ({}) }
  },

  // Global details
  dailyStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  totalStudyMinutes: { type: Number, default: 0 },

  // Badges earned
  earnedBadges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now }
  }],

  // Activity heatmap data
  activityLog: [{
    date: { type: String },  // YYYY-MM-DD
    minutes: { type: Number, default: 0 },
    topicsCompleted: { type: Number, default: 0 },
    assessmentsPassed: { type: Number, default: 0 }
  }],

  // Mentor assignment (for students)
  assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Mentor fields
  mentorProfile: {
    specialization: [{ type: String }],
    bio: { type: String, default: '' },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { timestamps: true });

// Setup virtual for backward compatibility and totalXP getter
userSchema.virtual('selectedDomain').get(function() {
  return this.activeDomain;
}).set(function(val) {
  this.activeDomain = val;
});

userSchema.virtual('totalXP').get(function() {
  let total = 0;
  if (this.domainsProgress) {
    for (const key of ['dsa', 'webdev', 'devops', 'opensource']) {
      if (this.domainsProgress[key] && typeof this.domainsProgress[key].xp === 'number') {
        total += this.domainsProgress[key].xp;
      }
    }
  }
  return total;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', userSchema);
