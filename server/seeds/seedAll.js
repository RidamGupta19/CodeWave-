const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
// fallback
if (!process.env.MONGODB_URI) dotenv.config({ path: '.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const Badge = require('../models/Badge');
const CloudCredit = require('../models/CloudCredit');

const domainData = require('./domainData');
const phaseData = require('./phaseData');
const topicData = require('./topicData');

const cloudCredits = [
  { title: 'GitHub Student Developer Pack', description: 'Free tools and services for students', link: 'https://education.github.com/pack', platform: 'GitHub', icon: '🐙', category: 'education', eligibility: 'Students with .edu email or proof of enrollment', order: 1 },
  { title: 'Google Cloud Free Program', description: '$300 free credits for 90 days', link: 'https://cloud.google.com/free', platform: 'Google Cloud', icon: '☁️', category: 'cloud', order: 2 },
  { title: 'Google Cloud Skills Boost', description: 'Free hands-on labs and learning paths', link: 'https://www.cloudskillsboost.google/', platform: 'Google Cloud', icon: '🎓', category: 'education', order: 3 },
  { title: 'Microsoft Azure for Students', description: '$100 free credit, no credit card required', link: 'https://azure.microsoft.com/free/students', platform: 'Azure', icon: '🔷', category: 'cloud', order: 4 },
  { title: 'AWS Free Tier', description: '12 months free on 25+ products', link: 'https://aws.amazon.com/free/', platform: 'AWS', icon: '🟠', category: 'cloud', order: 5 },
  { title: 'Oracle Cloud Free Tier', description: 'Always-free services including VMs', link: 'https://www.oracle.com/cloud/free/', platform: 'Oracle', icon: '🔴', category: 'cloud', order: 6 },
  { title: 'MongoDB Atlas Free Tier', description: 'Free 512MB shared cluster forever', link: 'https://www.mongodb.com/cloud/atlas/register', platform: 'MongoDB', icon: '🍃', category: 'database', order: 7 },
  { title: 'Vercel Free Hosting', description: 'Free deployment for frontend projects', link: 'https://vercel.com/', platform: 'Vercel', icon: '▲', category: 'hosting', order: 8 },
  { title: 'Netlify Free Tier', description: 'Free hosting with CI/CD', link: 'https://www.netlify.com/', platform: 'Netlify', icon: '🟢', category: 'hosting', order: 9 },
  { title: 'Render Free Tier', description: 'Free web services and databases', link: 'https://render.com/', platform: 'Render', icon: '⚡', category: 'hosting', order: 10 },
  { title: 'Railway Free Plan', description: 'Deploy apps with free monthly credits', link: 'https://railway.app/', platform: 'Railway', icon: '🚂', category: 'hosting', order: 11 }
];
async function seedDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';
      await mongoose.connect(uri);
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('✅ Already connected to MongoDB');
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Domain.deleteMany({}),
      Phase.deleteMany({}),
      Topic.deleteMany({}),
      Assessment.deleteMany({}),
      Badge.deleteMany({}),
      CloudCredit.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed cloud credits
    await CloudCredit.insertMany(cloudCredits);
    console.log('☁️  Cloud credits seeded');

    // Seed admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await User.create({
      fullName: 'CareerForge Admin',
      email: process.env.ADMIN_EMAIL || 'admin@careerforge.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin'
    });
    console.log('👤 Admin user created');

    // Seed domains and their phases/topics
    for (const domainInfo of domainData) {
      const domain = await Domain.create(domainInfo);
      console.log(`📁 Domain: ${domain.name}`);

      const phases = phaseData[domain.slug] || [];
      let phaseCount = 0;

      for (const phaseInfo of phases) {
        const phase = await Phase.create({
          ...phaseInfo,
          domainId: domain._id,
          order: phaseInfo.phaseNumber
        });
        phaseCount++;

        // Add topics for this phase if available
        const topicKey = `${domain.slug}:${phase.phaseNumber}`;
        const topics = topicData[topicKey] || [];
        for (const topicInfo of topics) {
          const topic = await Topic.create({ ...topicInfo, phaseId: phase._id, domainId: domain._id });
          
          // Create topic completion badge (One video = One badge)
          await Badge.create({
            name: `${topic.title} Badge`,
            description: `Completed "${topic.title}" in ${domain.name}`,
            icon: '📜',
            domainId: domain._id,
            phaseId: phase._id,
            topicId: topic._id,
            type: 'topic-completion',
            unlockCondition: `Complete the ${topic.title} topic`,
            order: topic.order
          });
        }

        // Add default assessment for each phase
        await Assessment.create({
          phaseId: phase._id,
          domainId: domain._id,
          title: `${phase.name} Assessment`,
          description: `Assessment for ${phase.name}`,
          type: 'custom',
          platform: 'HackerRank',
          assessmentLink: 'ADMIN_WILL_ADD_HACKERRANK_ASSESSMENT_LINK',
          passingScore: 60,
          difficultyRating: phase.phaseNumber <= 3 ? 'beginner' : phase.phaseNumber <= 7 ? 'intermediate' : 'advanced',
          maxAttempts: 3,
          unlocksNextPhase: true,
          order: phase.phaseNumber
        });

        // Add phase badge
        await Badge.create({
          name: `${phase.name} Badge`,
          description: `Completed ${phase.name} in ${domain.name}`,
          icon: '🏅',
          domainId: domain._id,
          phaseId: phase._id,
          type: 'phase-completion',
          unlockCondition: `Complete all topics in ${phase.name} and pass assessment`,
          order: phase.phaseNumber
        });
      }

      // Domain completion badge
      await Badge.create({
        name: `${domain.name} Master`,
        description: `Completed the entire ${domain.name} roadmap`,
        icon: '🏆',
        domainId: domain._id,
        type: 'domain-completion',
        unlockCondition: `Complete all ${phaseCount} phases in ${domain.name}`,
        order: 999
      });

      // Update domain stats
      await Domain.findByIdAndUpdate(domain._id, { totalPhases: phaseCount });
    }

    // Streak badges
    const streakBadges = [
      { name: 'Bronze Badge', description: 'Studied 5 days in a row', icon: '🥉', type: 'streak', unlockCondition: 'Maintain 5-day study streak' },
      { name: 'Monthly Badge', description: 'Studied 30 days in a row', icon: '📅', type: 'streak', unlockCondition: 'Maintain 30-day study streak' },
      { name: 'First Step', description: 'Completed your first topic', icon: '👣', type: 'special', unlockCondition: 'Complete any topic' },
      { name: 'Base Case Beginner', description: 'Solved your first recursion checkpoint', icon: '🧱', type: 'special', unlockCondition: 'Complete checkpoint 1 of Recursion' },
      { name: 'Stack Explorer', description: 'Understood function call stacks', icon: '📚', type: 'special', unlockCondition: 'Complete checkpoint 10 of Recursion' },
      { name: 'Backtracking Warrior', description: 'Mastered backtracking techniques', icon: '⚔️', type: 'special', unlockCondition: 'Complete checkpoint 15 of Recursion' },
      { name: 'Recursion Survivor', description: 'Completed all recursion challenges', icon: '👑', type: 'special', unlockCondition: 'Complete all 22 checkpoints' }
    ];
    await Badge.insertMany(streakBadges);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📧 Admin: ${process.env.ADMIN_EMAIL || 'admin@careerforge.com'}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedDB()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDB;
