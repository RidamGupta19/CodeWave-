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
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const UserProgress = require('../models/UserProgress');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const StudyMaterial = require('../models/StudyMaterial');
const Schedule = require('../models/Schedule');
const Assignment = require('../models/Assignment');
const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const Subject = require('../models/Subject');
const RoadmapProgress = require('../models/RoadmapProgress');
const connectDB = require('../config/db');

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
      console.log('Connecting to database via connectDB helper...');
      await connectDB();
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
      CloudCredit.deleteMany({}),
      Problem.deleteMany({}),
      Submission.deleteMany({}),
      UserProgress.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Course.deleteMany({}),
      Batch.deleteMany({}),
      Attendance.deleteMany({}),
      Fee.deleteMany({}),
      Notice.deleteMany({}),
      StudyMaterial.deleteMany({}),
      Schedule.deleteMany({}),
      Assignment.deleteMany({}),
      Video.deleteMany({}),
      VideoProgress.deleteMany({}),
      Subject.deleteMany({}),
      RoadmapProgress.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data (including videos)');

    // Seed cloud credits
    await CloudCredit.insertMany(cloudCredits);
    console.log('☁️  Cloud credits seeded');

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@codewavesolution.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const admin = await User.create({
      fullName: 'CodeWave Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isSuperAdmin: true
    });
    console.log('👤 Admin user created');

    // Seed teacher user
    const teacherUser = await User.create({
      fullName: 'John Doe (Instructor)',
      email: 'teacher@codewavesolution.com',
      password: 'Teacher@123',
      role: 'teacher'
    });
    const teacher = await Teacher.create({
      userId: teacherUser._id,
      name: teacherUser.fullName,
      email: teacherUser.email,
      phone: '+1234567890',
      subject: 'Full Stack Development',
      qualification: 'M.Tech Computer Science',
      experience: '5 Years',
      salary: 75000,
      joiningDate: Date.now()
    });
    console.log('👤 Teacher user and profile created');

    // Seed course
    const course = await Course.create({
      courseName: 'Full Stack Development',
      description: 'Master HTML, CSS, JavaScript, React, Node.js and MongoDB.',
      duration: '6 Months',
      fees: 15000,
      assignedTeacher: teacher._id
    });
    console.log('📚 Course created');

    // Seed subjects
    const sub1 = await Subject.create({ subjectName: 'HTML', subjectCode: 'HTML5', description: 'HTML5 structure, semantic tags, forms' });
    const sub2 = await Subject.create({ subjectName: 'CSS', subjectCode: 'CSS3', description: 'Styling, Flexbox, Grid, responsive design' });
    const sub3 = await Subject.create({ subjectName: 'JavaScript', subjectCode: 'JS6', description: 'ES6+, DOM, async/await, fetch API' });
    const sub4 = await Subject.create({ subjectName: 'Git & GitHub', subjectCode: 'GIT', description: 'Version control, branches, PRs' });
    const sub5 = await Subject.create({ subjectName: 'React.js', subjectCode: 'REACT', description: 'Components, hooks, state management' });
    const sub6 = await Subject.create({ subjectName: 'Backend', subjectCode: 'NODE', description: 'Server-side development with Node.js, Express, databases, and authentication' });
    console.log('📚 Course Subjects seeded');

    // Link subjects to course
    course.subjects = [sub1._id, sub2._id, sub3._id, sub4._id, sub5._id, sub6._id];
    await course.save();

    // Seed batch
    const batch = await Batch.create({
      batchName: 'Alpha Web Dev',
      startDate: Date.now(),
      timing: '10:00 AM - 12:00 PM',
      assignedTeacher: teacher._id,
      students: []
    });
    console.log('👥 Batch created');
    course.batches.push(batch._id);
    await course.save();

    // Seed student user
    const studentUser = await User.create({
      fullName: 'Jane Smith (Student)',
      email: 'student@codewavesolution.com',
      password: 'Student@123',
      role: 'student'
    });
    const student = await Student.create({
      userId: studentUser._id,
      rollNumber: 'CW-2026-001',
      fullName: studentUser.fullName,
      email: studentUser.email,
      phone: '+1987654321',
      address: '123 Code Street, Silicon Valley',
      course: course._id,
      batch: batch._id,
      admissionDate: Date.now(),
      status: 'active'
    });
    batch.students.push(student._id);
    await batch.save();
    console.log('👤 Student user and profile created');

    // Seed default Fee
    await Fee.create({
      student: student._id,
      course: course._id,
      totalFees: course.fees,
      paidAmount: 5000,
      remainingAmount: 10000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Partial'
    });
    console.log('💵 Student Fee initialized');

    // Seed default Attendance (3 records: 2 present, 1 absent)
    const d1 = new Date(); d1.setDate(d1.getDate() - 2); d1.setHours(0,0,0,0);
    const d2 = new Date(); d2.setDate(d2.getDate() - 1); d2.setHours(0,0,0,0);
    const d3 = new Date(); d3.setHours(0,0,0,0);
    await Attendance.create({ studentId: student._id, batchId: batch._id, teacherId: teacher._id, date: d1, status: 'Present' });
    await Attendance.create({ studentId: student._id, batchId: batch._id, teacherId: teacher._id, date: d2, status: 'Present' });
    await Attendance.create({ studentId: student._id, batchId: batch._id, teacherId: teacher._id, date: d3, status: 'Absent' });
    console.log('📅 Attendance logs seeded');

    // Seed Notice
    await Notice.create({
      title: 'Welcome to CodeWave Solution!',
      content: 'We are thrilled to launch our brand new coaching portal. Students can track their domains, check attendance, download notes and chat with the CodeWave AI Assistant.',
      targetRoles: ['all'],
      createdBy: admin._id
    });
    console.log('📢 Announcement notice seeded');

    // Helper to format time into AM/PM
    const formatTime12h = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      const strHours = hours < 10 ? '0' + hours : hours;
      return `${strHours}:${strMinutes} ${ampm}`;
    };

    // Seed 1: Live Class (Started 10 minutes ago)
    const liveTime = new Date(Date.now() - 10 * 60 * 1000);
    const liveDate = new Date(liveTime);
    liveDate.setHours(0,0,0,0);
    await Schedule.create({
      course: course._id,
      teacher: teacher._id,
      batch: batch._id,
      date: liveDate,
      time: formatTime12h(liveTime),
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      topic: 'Introduction to React State Management (Live Now)'
    });

    // Seed 2: Upcoming Class (Starts in 15 minutes)
    const upcomingTime = new Date(Date.now() + 15 * 60 * 1000);
    const upcomingDate = new Date(upcomingTime);
    upcomingDate.setHours(0,0,0,0);
    await Schedule.create({
      course: course._id,
      teacher: teacher._id,
      batch: batch._id,
      date: upcomingDate,
      time: formatTime12h(upcomingTime),
      meetingLink: 'https://zoom.us/j/9876543210',
      topic: 'React Hooks Deep Dive: useEffect and Custom Hooks'
    });

    // Seed 3: Completed Class (Started 2 hours ago)
    const completedTime = new Date(Date.now() - 120 * 60 * 1000);
    const completedDate = new Date(completedTime);
    completedDate.setHours(0,0,0,0);
    await Schedule.create({
      course: course._id,
      teacher: teacher._id,
      batch: batch._id,
      date: completedDate,
      time: formatTime12h(completedTime),
      meetingLink: 'https://meet.google.com/xyz-pdq-rst',
      topic: 'HTML & CSS Fundamentals Recap'
    });

    console.log('🕒 Class schedules (Live, Upcoming, Completed) seeded');

    // Seed Study Material
    await StudyMaterial.create({
      title: 'React State Management Notes',
      description: 'Comprehensive notes covering useState, useEffect, and Context API.',
      materialType: 'Notes',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      course: course._id,
      batch: batch._id,
      uploadedBy: teacherUser._id
    });
    console.log('📁 Study material uploaded');

    // Seed Assignment
    await Assignment.create({
      title: 'Build a Todo Application in React',
      description: 'Implement list rendering, additions, deletions, and state persistence with localStorage.',
      course: course._id,
      batch: batch._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: teacherUser._id
    });
    console.log('📝 Assignment created');

    // Seed Video Lectures
    const v1 = await Video.create({
      title: 'React State Management (Redux vs Context API)',
      description: 'An in-depth look at state propagation, props drilling, and when to use Redux Toolkit versus the native React Context API.',
      videoType: 'embedded',
      url: 'https://www.youtube.com/watch?v=5yEG6GhoJBs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop',
      duration: 1800, // 30 minutes
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      playlistName: 'React Developer Journey',
      order: 2,
      isActive: true
    });

    const v2 = await Video.create({
      title: 'Direct Upload: Node.js & Express Architecture',
      description: 'Understanding Express routing layers, custom middlewares, global error handling, and security wrappers like helmet and cors.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=300&auto=format&fit=crop',
      duration: 596, // ~10 minutes
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'Backend',
      playlistName: 'Backend Masterclass',
      order: 1,
      isActive: true
    });

    const v3 = await Video.create({
      title: 'Mongoose Database Modeling Patterns',
      description: 'How to structure MongoDB schemas inside Mongoose, create virtual fields, write pre-save hooks, and optimize queries using indexing.',
      videoType: 'embedded',
      url: 'https://www.youtube.com/watch?v=WDRtDhyG-B0',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=300&auto=format&fit=crop',
      duration: 2400, // 40 minutes
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'Backend',
      playlistName: 'Backend Masterclass',
      order: 2,
      isActive: true
    });

    const v4 = await Video.create({
      title: 'Direct Upload: Sintel CGI Movie Intro',
      description: 'A benchmark test video showing full playback controls, fullscreen mode, custom playback speed selections, and progress resume.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop',
      duration: 888, // ~15 minutes
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'HTML',
      playlistName: 'HTML & CSS Essentials',
      order: 1,
      isActive: true
    });

    const v5 = await Video.create({
      title: 'CSS Styling Essentials',
      description: 'Mastering modern styling layout techniques including CSS variables, Flexbox and Grid.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=300&auto=format&fit=crop',
      duration: 350,
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'CSS',
      playlistName: 'HTML & CSS Essentials',
      order: 2,
      isActive: true
    });

    const v6 = await Video.create({
      title: 'JavaScript ES6+ and DOM Control',
      description: 'Understanding Modern JS syntax, callbacks, promises, async await, and manipulating the browser DOM tree.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop',
      duration: 480,
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'JavaScript',
      playlistName: 'JavaScript & Git Foundation',
      order: 1,
      isActive: true
    });

    const v7 = await Video.create({
      title: 'Git Version Control & Github Workflows',
      description: 'Setting up Git repositories, branch branching protocols, pull requests and resolving merge conflicts.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=300&auto=format&fit=crop',
      duration: 300,
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'Git & GitHub',
      playlistName: 'JavaScript & Git Foundation',
      order: 2,
      isActive: true
    });

    const v8 = await Video.create({
      title: 'React Components, Props & Hooks',
      description: 'Getting started with React development, understanding component lifecycles, states, and useState/useEffect hooks.',
      videoType: 'uploaded',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop',
      duration: 620,
      course: course._id,
      batch: batch._id,
      instructor: 'John Doe',
      subject: 'React.js',
      playlistName: 'React Developer Journey',
      order: 1,
      isActive: true
    });

    console.log('🎥 Video lectures seeded');

    // Seed Video Progress for the student
    await VideoProgress.create({
      user: studentUser._id,
      video: v2._id,
      watchTime: 120, // 2 minutes watched
      duration: 596,
      progressPercentage: 20,
      isCompleted: false,
      lastWatched: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
    });

    await VideoProgress.create({
      user: studentUser._id,
      video: v3._id,
      watchTime: 2280, // 38 mins watched (completed)
      duration: 2400,
      progressPercentage: 95,
      isCompleted: true,
      lastWatched: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    });

    console.log('📈 Video watch progress records seeded');

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
          course: course._id,
          batch: batch._id,
          subject: phase.name,
          isPublished: true,
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

    // Seed problem bank (Admin problems)
    try {
      const seedProblemBank = require('./seedProblems');
      await seedProblemBank();
      console.log('📝 Problem bank seeded successfully');
    } catch (err) {
      console.error('❌ Failed to seed problem bank:', err.message);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📧 Admin: ${process.env.ADMIN_EMAIL || 'admin@codewavesolution.com'}`);
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
