const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const Badge = require('../models/Badge');

const domainData = {
  name: 'DSA',
  slug: 'dsa',
  shortDescription: 'Master data structures and algorithms with Striver\'s A2Z Roadmap.',
  icon: '🏆',
  color: '#eab308',
  difficultyLevel: 'intermediate',
  estimatedDuration: '4-6 months',
  order: 13
};

const phases = [
  { phaseNumber: 0, name: 'Programming Foundations', description: 'Language basics, Math for DSA, and Logic building.', estimatedDuration: '1 week', icon: '🌱' },
  { phaseNumber: 1, name: 'Arrays Explorer', description: 'Master 1D and 2D arrays with Easy, Medium, and Hard problems.', estimatedDuration: '2 weeks', icon: '🧱' },
  { phaseNumber: 2, name: 'Hashing Hunter', description: 'Frequency counting, Hash Maps, and Set operations.', estimatedDuration: '3 days', icon: '🗺️' },
  { phaseNumber: 3, name: 'Recursion Survivor', description: 'Recursion patterns, Backtracking, and classic recursive problems.', estimatedDuration: '1 week', icon: '🥷' },
  { phaseNumber: 4, name: 'Linked List Warrior', description: 'Singly, Doubly, and Circular Linked Lists with complex operations.', estimatedDuration: '1 week', icon: '⚔️' },
  { phaseNumber: 5, name: 'Stack & Queue Master', description: 'Implementation, Monotonic Stack, and Queue conversions.', estimatedDuration: '1 week', icon: '🛡️' },
  { phaseNumber: 6, name: 'Tree Master', description: 'Binary Trees, BSTs, Traversals, and complex tree algorithms.', estimatedDuration: '2 weeks', icon: '🌳' },
  { phaseNumber: 7, name: 'Graph Adventurer', description: 'BFS/DFS, Topo Sort, Shortest Path, MST, and Disjoint Set.', estimatedDuration: '2 weeks', icon: '⛰️' },
  { phaseNumber: 8, name: 'Dynamic Programming Beast', description: '1D/2D/3D DP, Grids, Subsequences, Strings, Stocks, and LIS.', estimatedDuration: '3 weeks', icon: '👹' },
  { phaseNumber: 9, name: 'Greedy Strategist', description: 'Master Greedy algorithms with real-world problem scenarios.', estimatedDuration: '1 week', icon: '🏹' },
  { phaseNumber: 10, name: 'Placement Challenger', description: 'Bit Manipulation, Heaps, and high-frequency placement problems.', estimatedDuration: '2 weeks', icon: '🏆' }
];

const dsaBadges = [
  { name: 'Array Rookie', level: 1, icon: '🛡️' },
  { name: 'Recursion Survivor', level: 3, icon: '🥷' },
  { name: 'Tree Explorer', level: 6, icon: '🌳' },
  { name: 'Graph Warrior', level: 7, icon: '⚔️' },
  { name: 'DP Beast', level: 8, icon: '👹' },
  { name: 'Placement Ready', level: 10, icon: '🎓' }
];

async function seedDSA() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codewave';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Find or create DSA domain
    let domain = await Domain.findOne({ slug: 'dsa' });
    if (!domain) {
      domain = await Domain.create(domainData);
    } else {
      await Domain.findByIdAndUpdate(domain._id, domainData);
    }
    console.log('📁 DSA Domain ready');

    // Clear existing DSA phases, topics, badges, assessments
    await Phase.deleteMany({ domainId: domain._id });
    await Topic.deleteMany({ domainId: domain._id });
    await Assessment.deleteMany({ domainId: domain._id });
    await Badge.deleteMany({ domainId: domain._id });
    console.log('🗑️  Cleared existing DSA data');

    const topicData = require('./topicData');

    for (const phaseInfo of phases) {
      const phase = await Phase.create({
        ...phaseInfo,
        domainId: domain._id,
        order: phaseInfo.phaseNumber
      });

      // Add topics for this phase and their individual badges
      const topicKey = `dsa:${phase.phaseNumber}`;
      const topics = topicData[topicKey] || [];
      for (const topicInfo of topics) {
        const topic = await Topic.create({ ...topicInfo, phaseId: phase._id, domainId: domain._id });
        
        // One video = One badge
        await Badge.create({
          name: `${topic.title} Badge`,
          description: `Mastered the "${topic.title}" topic from Love Babbar's course!`,
          icon: '📜',
          domainId: domain._id,
          phaseId: phase._id,
          topicId: topic._id,
          type: 'topic-completion',
          unlockCondition: `Complete the ${topic.title} video and challenge`,
          order: topic.order
        });
      }

      // Add assessment
      await Assessment.create({
        phaseId: phase._id,
        domainId: domain._id,
        title: `${phase.name} Mastery Test`,
        description: `Final test to prove your mastery in ${phase.name}`,
        type: 'custom',
        platform: 'HackerRank',
        assessmentLink: 'https://hackerrank.com',
        passingScore: 70,
        difficultyRating: phase.phaseNumber <= 3 ? 'beginner' : phase.phaseNumber <= 7 ? 'intermediate' : 'advanced',
        maxAttempts: 3,
        unlocksNextPhase: true,
        order: phase.phaseNumber
      });

      // Check if this phase has a special badge
      const specialBadge = dsaBadges.find(b => b.level === phase.phaseNumber);
      if (specialBadge) {
        await Badge.create({
          name: specialBadge.name,
          description: `Achieved ${specialBadge.name} rank by mastering ${phase.name}`,
          icon: specialBadge.icon,
          domainId: domain._id,
          phaseId: phase._id,
          type: 'phase-completion',
          unlockCondition: `Master all topics in ${phase.name}`,
          order: phase.phaseNumber
        });
      } else {
        await Badge.create({
          name: `${phase.name} Badge`,
          description: `Completed ${phase.name} in DSA Journey`,
          icon: '🏅',
          domainId: domain._id,
          phaseId: phase._id,
          type: 'phase-completion',
          unlockCondition: `Master all topics in ${phase.name}`,
          order: phase.phaseNumber
        });
      }
    }

    // Seed default streak badges
    const streakBadges = [
      { name: 'Bronze Badge', description: 'Maintained a 5-day study streak', icon: '🥉', type: 'streak', unlockCondition: 'Maintain 5-day study streak' },
      { name: 'Monthly Badge', description: 'Maintained a 30-day study streak', icon: '📅', type: 'streak', unlockCondition: 'Maintain 30-day study streak' },
      { name: 'First Step', description: 'Completed your first topic', icon: '👣', type: 'special', unlockCondition: 'Complete any topic' }
    ];
    for (const sb of streakBadges) {
      const exists = await Badge.findOne({ name: sb.name });
      if (!exists) {
        await Badge.create(sb);
      }
    }

    console.log('🎉 DSA Journey seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedDSA();
