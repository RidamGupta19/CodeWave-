const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const UserActivity = require('./models/UserActivity');
const Leaderboard = require('./models/Leaderboard');
const PointTransaction = require('./models/PointTransaction');
const Badge = require('./models/Badge');
const Video = require('./models/Video');
const Assessment = require('./models/Assessment');

const gamificationService = require('./services/gamificationService');
const activityService = require('./services/activityService');

const runTests = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();
    console.log('✅ Connected to MongoDB!\n');

    // 1. Setup Test Users
    console.log('🌱 Setting up test students...');
    
    // User 1: Student Alfa
    let userAlfa = await User.findOne({ email: 'student_alfa@codewave.com' });
    if (!userAlfa) {
      userAlfa = await User.create({
        fullName: 'Student Alfa',
        email: 'student_alfa@codewave.com',
        password: 'password123',
        role: 'student',
        status: 'active'
      });
    }

    // User 2: Student Beta
    let userBeta = await User.findOne({ email: 'student_beta@codewave.com' });
    if (!userBeta) {
      userBeta = await User.create({
        fullName: 'Student Beta',
        email: 'student_beta@codewave.com',
        password: 'password123',
        role: 'student',
        status: 'active'
      });
    }

    // Clean up old standings for these test users
    const Student = require('./models/Student');
    await Student.deleteMany({ userId: { $in: [userAlfa._id, userBeta._id] } });
    await UserActivity.deleteMany({ userId: { $in: [userAlfa._id, userBeta._id] } });
    await Leaderboard.deleteMany({ userId: { $in: [userAlfa._id, userBeta._id] } });
    await PointTransaction.deleteMany({ userId: { $in: [userAlfa._id, userBeta._id] } });

    // Seed student profiles
    await Student.create({
      userId: userAlfa._id,
      rollNumber: 'ROLL_ALFA_123',
      fullName: userAlfa.fullName,
      email: userAlfa.email
    });

    await Student.create({
      userId: userBeta._id,
      rollNumber: 'ROLL_BETA_123',
      fullName: userBeta.fullName,
      email: userBeta.email
    });

    // Clean up earnedBadges arrays
    userAlfa.earnedBadges = [];
    await userAlfa.save();
    userBeta.earnedBadges = [];
    await userBeta.save();

    console.log('✅ Test Users and Student Profiles ready.\n');

    // 2. Seed Default Badges and Settings
    console.log('➡️ STEP 1: Seeding gamification configurations and badges...');
    await gamificationService.seedDefaultBadges();
    const settings = await gamificationService.getGamificationSettings();

    const badgeCount = await Badge.countDocuments({ isActive: true });
    console.log(`   - Gamification Settings status: Loaded (dailyLogin = ${settings.pointsConfig.dailyLogin} pts)`);
    console.log(`   - Active badges in database: ${badgeCount}`);
    
    if (badgeCount < 10) {
      throw new Error('❌ Default badges seeding failed!');
    }
    console.log('✅ Seeding verified successfully!\n');

    // 3. Test Login Points & Streak Award
    console.log('➡️ STEP 2: Simulating Student Alfa daily login...');
    const userAgent = 'Mozilla/5.0';
    const ipAddress = '127.0.0.1';
    
    // Set streak manually to 7 days to test milestone check
    const activityAlfa = new UserActivity({
      userId: userAlfa._id,
      role: 'student',
      totalLoginCount: 1,
      currentLoginStreak: 7,
      lastLoginDate: new Date().toISOString().split('T')[0]
    });
    await activityAlfa.save();

    // Trigger daily login points awarding
    const todayStr = new Date().toISOString().split('T')[0];
    await gamificationService.awardPoints(userAlfa._id, 'login', null, todayStr);
    await gamificationService.awardPoints(userAlfa._id, 'streak', null, todayStr);

    let leaderboardAlfa = await Leaderboard.findOne({ userId: userAlfa._id }).populate('badges.badgeId');
    let transactionCount = await PointTransaction.countDocuments({ userId: userAlfa._id });

    console.log('   Verification:');
    console.log(`   - Points transactions logged: ${transactionCount} (Expected: 2)`);
    console.log(`   - Total Points accumulated: ${leaderboardAlfa.points} pts (Expected: 15 pts [5 login + 10 streak])`);
    console.log(`   - Unlocked Badges count: ${leaderboardAlfa.badges.length}`);
    
    const unlockedStreakBadge = leaderboardAlfa.badges.some(b => b.badgeId?.name === '7 Day Streak');
    console.log(`   - 7 Day Streak Badge earned: ${unlockedStreakBadge} (Expected: true)`);

    if (leaderboardAlfa.points !== 15 || !unlockedStreakBadge) {
      throw new Error('❌ Login points / streak badge award failed!');
    }
    console.log('✅ Daily login points and streak badges verified successfully!\n');

    // 4. Test Duplicate Prevention
    console.log('➡️ STEP 3: Verifying duplicate points prevention...');
    const duplicateTx = await gamificationService.awardPoints(userAlfa._id, 'login', null, todayStr);
    
    console.log('   Verification:');
    console.log(`   - Duplicate transaction status: ${duplicateTx === null ? 'Rejected' : 'Allowed'}`);
    
    const finalPoints = (await Leaderboard.findOne({ userId: userAlfa._id })).points;
    console.log(`   - Points remains unchanged: ${finalPoints === 15 ? 'Yes' : 'No'} (${finalPoints} pts)`);

    if (duplicateTx !== null || finalPoints !== 15) {
      throw new Error('❌ Duplicate points prevention failed!');
    }
    console.log('✅ Duplicate points prevention verified successfully!\n');

    // 5. Test Video Completions & Leveling Up
    console.log('➡️ STEP 4: Simulating multiple video completions...');
    
    // Seed Course & Videos
    const Course = require('./models/Course');
    let course = await Course.findOne();
    if (!course) {
      course = await Course.create({ courseName: 'Gamification Track', description: 'Testing roadmap module points', duration: '1 month' });
    }

    const videos = [];
    for (let i = 0; i < 10; i++) {
      const v = await Video.create({
        title: `Lecture Video ${i + 1}`,
        videoType: 'embedded',
        url: 'https://youtube.com',
        duration: 200,
        course: course._id
      });
      videos.push(v);
    }

    console.log(`   - Simulating completion of 10 video lectures for Student Alfa...`);
    for (const v of videos) {
      await activityService.trackVideoActivity(userAlfa._id, v._id, 200, 100, true);
    }

    leaderboardAlfa = await Leaderboard.findOne({ userId: userAlfa._id }).populate('badges.badgeId');
    console.log('   Verification:');
    console.log(`   - Videos Completed standing: ${leaderboardAlfa.videosCompleted} (Expected: 10)`);
    console.log(`   - Total points (15 login/streak + 100 video points): ${leaderboardAlfa.points} pts (Expected: 115)`);
    console.log(`   - Level reached: Level ${leaderboardAlfa.level} (Expected: Level 2 [threshold > 100])`);

    const hasVideoMasterBadge = leaderboardAlfa.badges.some(b => b.badgeId?.name === 'Video Completion Master');
    console.log(`   - Video Completion Master Badge earned: ${hasVideoMasterBadge} (Expected: true)`);

    if (leaderboardAlfa.level !== 2 || !hasVideoMasterBadge) {
      throw new Error('❌ Video completions or leveling up failed!');
    }
    console.log('✅ Video master achievements and level triggers verified successfully!\n');

    // 6. Test Assessment Passes & 90%+ Bonus
    console.log('➡️ STEP 5: Simulating quiz completions & bonus points...');
    
    let quiz = await Assessment.findOne();
    if (!quiz) {
      const Domain = require('./models/Domain');
      let domain = await Domain.findOne();
      if (!domain) {
        domain = await Domain.create({ name: 'Development', slug: 'dev', shortDescription: 'General Track' });
      }
      quiz = await Assessment.create({
        title: 'MERN Quiz',
        description: 'MERN standing checks',
        domainId: domain._id,
        assessmentLink: 'https://codewave.com'
      });
    }

    console.log('   - Submitting assessment with 95% score...');
    await activityService.trackAssessmentActivity(userAlfa._id, quiz._id, 95, true, 120);

    leaderboardAlfa = await Leaderboard.findOne({ userId: userAlfa._id });
    console.log('   Verification:');
    console.log(`   - Total Points after quiz: ${leaderboardAlfa.points} pts (Expected: 195 [115 + 30 pass + 50 bonus])`);

    if (leaderboardAlfa.points !== 195) {
      throw new Error('❌ Quiz score bonus points failed!');
    }
    console.log('✅ Assessment points and bonuses verified successfully!\n');

    // 7. Test Ranks recalculation priority
    console.log('➡️ STEP 6: Testing leaderboard ranking priorities...');
    
    // Simulate Student Beta with 50 points
    await UserActivity.create({
      userId: userBeta._id,
      role: 'student',
      totalLoginCount: 1,
      currentLoginStreak: 2,
      lastLoginDate: todayStr
    });
    
    // Award daily login to Beta
    await gamificationService.awardPoints(userBeta._id, 'login', null, todayStr);
    
    // Manually add 180 points to Beta (total = 185 pts) - slightly less than Alfa's 195 pts
    const betaEntry = await Leaderboard.findOne({ userId: userBeta._id });
    betaEntry.points = 185;
    await betaEntry.save();

    await gamificationService.recalculateRankings();

    const rankAlfa = (await Leaderboard.findOne({ userId: userAlfa._id })).rank;
    const rankBeta = (await Leaderboard.findOne({ userId: userBeta._id })).rank;

    console.log('   Verification:');
    console.log(`   - Student Alfa Rank: #${rankAlfa} (Expected: #1 [195 pts])`);
    console.log(`   - Student Beta Rank: #${rankBeta} (Expected: #2 [185 pts])`);

    if (rankAlfa !== 1 || rankBeta !== 2) {
      throw new Error('❌ Leaderboard ranking sorting failed!');
    }
    console.log('✅ Leaderboard rankings priority verified successfully!\n');

    // Clean up seeded test videos and Student profiles
    for (const v of videos) {
      await Video.deleteOne({ _id: v._id });
    }
    await Student.deleteOne({ userId: userAlfa._id });
    await Student.deleteOne({ userId: userBeta._id });

    console.log('🎉 ALL GAMIFICATION & LEADERBOARD SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed cleanly.');
  }
};

runTests();
