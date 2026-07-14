const FeatureFlag = require('../models/FeatureFlag');

const defaultFeatures = [
  {
    featureKey: 'video_streaming',
    featureName: 'Video Streaming',
    category: 'Core',
    enabled: false,
    description: 'Enables access to student and teacher video lecture libraries and streaming playbacks.'
  },
  {
    featureKey: 'devops_terminal',
    featureName: 'Interactive DevOps Terminal',
    category: 'DevOps',
    enabled: false,
    description: 'Enables interactive terminal sandboxes, DevOps course track, and CLI labs.'
  },
  {
    featureKey: 'ai_doubt_solver',
    featureName: 'AI Doubt Solver',
    category: 'AI',
    enabled: false,
    description: 'Enables real-time assistance through Code Guru, the global AI doubt-solving companion.'
  },
  {
    featureKey: 'ai_interview',
    featureName: 'AI Interview',
    category: 'AI',
    enabled: false,
    description: 'Enables AI-powered conversational mock interviews with live review metrics.'
  },
  {
    featureKey: 'ai_resume_builder',
    featureName: 'AI Resume Builder',
    category: 'AI',
    enabled: false,
    description: 'Enables the AI Resume Builder tool to generate and optimize job-ready resumes.'
  },
  {
    featureKey: 'placement_portal',
    featureName: 'Placement Portal',
    category: 'Career',
    enabled: false,
    description: 'Enables placement tracking, student profile registry, and mock interview preparations.'
  },
  {
    featureKey: 'job_board',
    featureName: 'Job Board',
    category: 'Career',
    enabled: false,
    description: 'Enables access to the jobs directory, application pipeline, and recruiter listings.'
  }
];

const seedFeatureFlags = async () => {
  try {
    console.log('🔒 Initializing Feature Lock & Availability flags...');
    for (const feat of defaultFeatures) {
      // Find feature by key, if not exists, create it
      const exists = await FeatureFlag.findOne({ featureKey: feat.featureKey });
      if (!exists) {
        await FeatureFlag.create(feat);
        console.log(`+ Created feature flag: ${feat.featureName} (Default: Disabled)`);
      }
    }
    console.log('✅ Feature flags synchronization complete.');
  } catch (err) {
    console.error('❌ Failed to seed feature flags:', err.message);
  }
};

module.exports = seedFeatureFlags;
