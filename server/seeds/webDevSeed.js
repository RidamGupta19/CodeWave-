const mongoose = require('mongoose');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');

const domainData = require('./domainData');

const domainsToSeed = domainData.map(d => ({
  ...d,
  phases: [
    { phaseNumber: 0, name: 'Getting Started', description: `Introductory concepts for ${d.name}.` },
    { phaseNumber: 1, name: 'Fundamentals', description: `Core foundations of ${d.name}.` },
    { phaseNumber: 2, name: 'Intermediate Mastery', description: `Stepping up your ${d.name} skills.` }
  ]
}));

const webDevTopics = {
  0: [
    { title: 'The Internet Under the Hood', description: 'DNS, IP Addresses, and Packet Switching.', time: '1h' },
    { title: 'HTTP/HTTPS & Security', description: 'SSL, Request/Response cycle.', time: '1.5h' }
  ],
  1: [
    { title: 'Semantic HTML5', description: 'Why structure matters for SEO and Accessibility.', time: '2h' },
    { title: 'Forms & Validations', description: 'Building interactive user inputs.', time: '2h' }
  ],
  2: [
    { title: 'Flexbox Layouts', description: 'Mastering the 1D layout engine.', time: '3h' },
    { title: 'CSS Grid Mastery', description: 'Building complex 2D layouts.', time: '4h' }
  ],
  3: [
    { title: 'ES6+ Features', description: 'Destructuring, Arrow functions, and Modules.', time: '5h' },
    { title: 'Async/Await & Promises', description: 'Handling API calls and async logic.', time: '6h' }
  ],
  4: [
    { title: 'Git Flow', description: 'Branching, Merging, and Pull Requests.', time: '2h' },
    { title: 'Open Source Contribution', description: 'Your first contribution guide.', time: '3h' }
  ],
  5: [
    { title: 'React Hooks', description: 'useState, useEffect, and useMemo.', time: '8h' },
    { title: 'State Management', description: 'Context API and global state.', time: '10h' }
  ],
  6: [
    { title: 'Express Middleware', description: 'Auth, Logging, and Error handling.', time: '6h' },
    { title: 'RESTful API Design', description: 'CRUD patterns and status codes.', time: '8h' }
  ],
  7: [
    { title: 'NoSQL Modeling', description: 'Referencing vs Embedding in MongoDB.', time: '5h' },
    { title: 'Mongoose Aggregation', description: 'Complex queries and pipelines.', time: '6h' }
  ],
  8: [
    { title: 'The MERN Integration', description: 'Connecting frontend to backend.', time: '15h' },
    { title: 'Deployment & CI/CD', description: 'Deploying to Vercel and Render.', time: '5h' }
  ]
};

// Overwrite Web Dev with a premium, gamified 9-phase roadmap
const webDevIdx = domainsToSeed.findIndex(d => d.slug === 'web-development');
if (webDevIdx !== -1) {
  domainsToSeed[webDevIdx].phases = [
    { phaseNumber: 0, name: 'The Web Voyager', description: 'Master the hidden mechanics of the internet: DNS, HTTP, and how browsers render the world.' },
    { phaseNumber: 1, name: 'Structure Sensei', description: 'Learn to build the skeletal foundation of applications with semantic HTML5 and SEO best practices.' },
    { phaseNumber: 2, name: 'Style Sorcerer', description: 'Control the visual realm using Modern CSS, Flexbox, CSS Grid, and responsive wizardry.' },
    { phaseNumber: 3, name: 'Logic Legend', description: 'Harness the power of JavaScript. Master ES6+, DOM manipulation, and asynchronous programming.' },
    { phaseNumber: 4, name: 'Version Vanguard', description: 'Learn the art of time travel with Git and collaborative warfare on GitHub.' },
    { phaseNumber: 5, name: 'Component Commander', description: 'Step into the modern era with React. Master hooks, props, and virtual DOM strategies.' },
    { phaseNumber: 6, name: 'API Architect', description: 'Build the engine. Master Node.js, Express, and RESTful API design from scratch.' },
    { phaseNumber: 7, name: 'Schema Strategist', description: 'Master the data layer. Design scalable NoSQL schemas with MongoDB and Mongoose.' },
    { phaseNumber: 8, name: 'Full Stack Titan', description: 'Assemble the MERN stack. Deploy live projects and become an industry-ready architect.' }
  ];
}

async function seedAllDomains() {
  try {
    for (const d of domainsToSeed) {
      const { phases: phaseList, ...domainInfo } = d;
      const domain = await Domain.findOneAndUpdate(
        { slug: d.slug },
        domainInfo,
        { upsert: true, new: true }
      );
      console.log(`✅ Domain set: ${domain.name}`);

      // Clear existing for this domain
      await Phase.deleteMany({ domainId: domain._id });
      await Topic.deleteMany({ domainId: domain._id });

      for (const phaseInfo of phaseList) {
        const phase = await Phase.create({
          ...phaseInfo,
          domainId: domain._id,
          order: phaseInfo.phaseNumber
        });
        
        // Add specific topics for Web Dev, otherwise default
        const topicsToAdd = (domain.slug === 'web-development') 
          ? webDevTopics[phase.phaseNumber] 
          : [{ title: `Intro to ${phase.name}`, description: `Fundamentals of ${phase.name}.`, time: '1h' }];

        for (const t of topicsToAdd) {
          await Topic.create({
            title: t.title,
            description: t.description,
            youtubeLink: 'https://www.youtube.com/watch?v=hcMzwfj824A',
            estimatedTime: t.time || '1 hour',
            phaseId: phase._id,
            domainId: domain._id,
            isActive: true
          });
        }
      }
    }
    console.log('🎉 All domains seeded!');
  } catch (error) {
    console.error('❌ Error seeding domains:', error);
  }
}

module.exports = seedAllDomains;
