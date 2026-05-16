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
    { 
      title: 'How the Internet Works', 
      description: 'The foundation of everything. DNS, IP, and Browsers.', 
      time: '1h', 
      youtube: 'https://www.youtube.com/watch?v=7_LPdttKXPc', 
      instructor: 'Apna College',
      challenge: 'Explain how a browser fetches a website to a non-technical friend.',
      notes: 'Focus on the Request/Response cycle and the role of the ISP.'
    },
    { 
      title: 'HTTP/HTTPS Deep Dive', 
      description: 'Understanding the protocol of the web.', 
      time: '1h', 
      youtube: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0', 
      instructor: 'Apna College',
      challenge: 'Find the status code of a broken link on any website.',
      notes: 'Learn about 200, 404, 500 status codes.'
    }
  ],
  1: [
    { 
      title: 'Semantic HTML5', 
      description: 'Building meaningful structure.', 
      time: '2h', 
      youtube: 'https://www.youtube.com/watch?v=hcMzwfj824A', 
      instructor: 'Apna College',
      challenge: 'Convert a <div> based layout to a semantic one using <header>, <main>, and <footer>.',
      notes: 'Accessibility is the key here.'
    }
  ],
  2: [
    { 
      title: 'Modern CSS & Flexbox', 
      description: 'Mastering layouts without floats.', 
      time: '3h', 
      youtube: 'https://www.youtube.com/watch?v=Edsxf_NBFrw', 
      instructor: 'Chai aur Code',
      challenge: 'Create a responsive 3-column layout using Flexbox.',
      notes: 'justify-content vs align-items is the most important concept.'
    }
  ],
  3: [
    { 
      title: 'JavaScript Fundamentals', 
      description: 'Variables, Data types, and Loops.', 
      time: '5h', 
      youtube: 'https://www.youtube.com/watch?v=2md4HQNRqJA', 
      instructor: 'Chai aur Code',
      challenge: 'Write a program that calculates the sum of all prime numbers between 1 and 100.',
      notes: 'Master the "let" vs "const" and arrow functions.'
    },
    { 
      title: 'DOM Manipulation', 
      description: 'Making the web alive.', 
      time: '4h', 
      youtube: 'https://www.youtube.com/watch?v=y17RuWkWdn8', 
      instructor: 'Chai aur Code',
      challenge: 'Build a simple "To-Do" list that adds items on click.',
      notes: 'Events and event listeners are your best friends.'
    }
  ],
  4: [
    { 
      title: 'Git & GitHub Mastery', 
      description: 'Version control for everyone.', 
      time: '2h', 
      youtube: 'https://www.youtube.com/watch?v=apGV9Kg7ics', 
      instructor: 'Chai aur Code',
      challenge: 'Initialize a repo, make 3 commits, and push to GitHub.',
      notes: 'Learn the "staging area" concept properly.'
    }
  ],
  5: [
    { 
      title: 'React Fundamentals', 
      description: 'Components, Props, and State.', 
      time: '10h', 
      youtube: 'https://www.youtube.com/watch?v=e6O9shS_C0Q', 
      instructor: 'Chai aur Code',
      challenge: 'Build a weather app using a public API and React.',
      notes: 'Think in components.'
    }
  ],
  6: [
    { 
      title: 'Backend with Node & Express', 
      description: 'Building server-side logic.', 
      time: '8h', 
      youtube: 'https://www.youtube.com/watch?v=7H_QH9ippp8', 
      instructor: 'Sheriyans',
      challenge: 'Create a simple API that returns a list of your favorite books.',
      notes: 'Understanding middleware is crucial.'
    }
  ],
  7: [
    { 
      title: 'MongoDB & Mongoose', 
      description: 'Persisting data elegantly.', 
      time: '6h', 
      youtube: 'https://www.youtube.com/watch?v=9OD4V9fR_V0', 
      instructor: 'Sheriyans',
      challenge: 'Design a schema for a "User" and "Post" relationship.',
      notes: 'Focus on .populate() and referencing.'
    }
  ],
  8: [
    { 
      title: 'The Full Stack Project', 
      description: 'Connecting everything together.', 
      time: '20h', 
      youtube: 'https://www.youtube.com/watch?v=X7U-9_n_0oU', 
      instructor: 'Chai aur Code',
      challenge: 'Deploy a full-stack MERN application to Render.',
      notes: 'CORS and Environment variables are the biggest hurdles.'
    }
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
            youtubeLink: t.youtube || 'https://www.youtube.com/watch?v=hcMzwfj824A',
            instructor: t.instructor || '',
            challenge: t.challenge || '',
            theoryNotes: t.notes || '',
            estimatedTime: t.time || '1 hour',
            phaseId: phase._id,
            domainId: domain._id,
            isActive: true,
            order: topicsToAdd.indexOf(t)
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

// If run directly
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env' });
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge')
    .then(() => {
      console.log('📡 Connected to MongoDB for seeding...');
      return seedAllDomains();
    })
    .then(() => {
      console.log('✅ Seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
