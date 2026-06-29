const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const UserActivity = require('./models/UserActivity');
const Video = require('./models/Video');
const Assessment = require('./models/Assessment');

const activityService = require('./services/activityService');

const runTests = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();
    console.log('✅ Connected to MongoDB!\n');

    // 1. Setup Test Data
    console.log('🌱 Setting up test user...');
    let user = await User.findOne({ email: 'student_tracker_test@codewave.com' });
    if (!user) {
      user = await User.create({
        fullName: 'Student Tracker Test',
        email: 'student_tracker_test@codewave.com',
        password: 'password123',
        role: 'student',
        status: 'active'
      });
    }

    // Clean up any old activity for this test user
    await UserActivity.deleteMany({ userId: user._id });
    console.log(`✅ Test User Ready: ID: ${user._id}, Email: ${user.email}\n`);

    // 2. Test Login Tracking
    console.log('➡️ STEP 1: Simulating successful user login...');
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const ipAddress = '127.0.0.1';

    let activity = await activityService.recordLogin(user, userAgent, ipAddress);
    
    console.log('   Verification:');
    console.log(`   - totalLoginCount: ${activity.totalLoginCount} (Expected: 1)`);
    console.log(`   - role: ${activity.role} (Expected: student)`);
    console.log(`   - currentSessionStart: ${activity.currentSessionStart}`);
    console.log(`   - lastLoginAt: ${activity.lastLoginAt}`);
    console.log(`   - currentLoginStreak: ${activity.currentLoginStreak} (Expected: 1)`);
    console.log(`   - browserInfo: ${activity.browserInfo} (Expected: Chrome)`);
    console.log(`   - deviceInfo: ${activity.deviceInfo} (Expected: Desktop)`);

    if (activity.totalLoginCount !== 1 || activity.currentLoginStreak !== 1) {
      throw new Error('❌ Login tracking verification failed!');
    }
    console.log('✅ Login tracking verified successfully!\n');

    // 3. Test Heartbeats & Page Tracking
    console.log('➡️ STEP 2: Simulating page browsing heartbeats...');
    
    console.log('   - Visiting "Dashboard" page...');
    activity = await activityService.recordHeartbeat(user._id, user.role, 'dashboard', 0, true, true);
    
    console.log('   - 30 seconds active on "Dashboard"...');
    activity = await activityService.recordHeartbeat(user._id, user.role, 'dashboard', 30, true, false);

    console.log('   - Navigating to "Video Lectures" page...');
    activity = await activityService.recordHeartbeat(user._id, user.role, 'video', 0, true, true);
    activity = await activityService.recordHeartbeat(user._id, user.role, 'video', 30, true, false);

    console.log('   - Navigating to "Assessments" page...');
    activity = await activityService.recordHeartbeat(user._id, user.role, 'assessment', 0, true, true);
    activity = await activityService.recordHeartbeat(user._id, user.role, 'assessment', 30, true, false);

    console.log('   Verification:');
    console.log(`   - totalTimeSpentInSeconds: ${activity.totalTimeSpentInSeconds} (Expected: 90)`);
    console.log(`   - totalPagesVisited: ${activity.totalPagesVisited} (Expected: 3)`);
    
    const dashboardPage = activity.pages.find(p => p.pageName === 'dashboard');
    const videoPage = activity.pages.find(p => p.pageName === 'video');
    const assessmentPage = activity.pages.find(p => p.pageName === 'assessment');

    console.log(`   - Dashboard page visits: ${dashboardPage?.visitCount} (Expected: 1)`);
    console.log(`   - Dashboard time spent: ${dashboardPage?.timeSpentOnPage}s (Expected: 30s)`);
    console.log(`   - Video page visits: ${videoPage?.visitCount} (Expected: 1)`);
    console.log(`   - Video time spent: ${videoPage?.timeSpentOnPage}s (Expected: 30s)`);
    console.log(`   - Assessment page visits: ${assessmentPage?.visitCount} (Expected: 1)`);
    console.log(`   - Assessment time spent: ${assessmentPage?.timeSpentOnPage}s (Expected: 30s)`);

    if (activity.totalTimeSpentInSeconds !== 90 || activity.totalPagesVisited !== 3) {
      throw new Error('❌ Page/Time tracking verification failed!');
    }
    console.log('✅ Page and session tracking verified successfully!\n');

    // 4. Test Inactivity Pause
    console.log('➡️ STEP 3: Simulating 5 minutes inactivity timer pause...');
    
    // Send a heartbeat with active = false (simulates user inactive)
    activity = await activityService.recordHeartbeat(user._id, user.role, 'assessment', 30, false, false);
    
    console.log('   Verification:');
    console.log(`   - totalTimeSpentInSeconds after inactive heartbeat: ${activity.totalTimeSpentInSeconds} (Expected: 90 - unchanged)`);
    
    if (activity.totalTimeSpentInSeconds !== 90) {
      throw new Error('❌ Inactivity tracking failed to pause the timer!');
    }
    console.log('✅ Inactivity pause verified successfully!\n');

    // 5. Test Video Analytics
    console.log('➡️ STEP 4: Simulating video watch progress tracking...');
    
    // Find or seed a video
    let video = await Video.findOne();
    if (!video) {
      console.log('   - Seeding a dummy video for watch tracking...');
      const Course = require('./models/Course');
      let course = await Course.findOne();
      if (!course) {
        course = await Course.create({ courseName: 'Test Course', description: 'Test course details', duration: '3 months' });
      }
      video = await Video.create({
        title: 'Introduction to Activity Tracking',
        videoType: 'embedded',
        url: 'https://youtube.com/watch?v=123',
        duration: 300,
        course: course._id
      });
    }

    console.log(`   - Watching video "${video.title}"...`);
    // Watch 150 seconds (50%), incomplete
    await activityService.trackVideoActivity(user._id, video._id, 150, 50, false);
    // Watch 290 seconds (97%), complete
    await activityService.trackVideoActivity(user._id, video._id, 290, 97, true);

    activity = await UserActivity.findOne({ userId: user._id });

    console.log('   Verification:');
    console.log(`   - totalVideosWatched: ${activity.totalVideosWatched} (Expected: 1)`);
    console.log(`   - totalWatchTime: ${activity.videoAnalytics?.totalWatchTime}s (Expected: 290s)`);
    
    const watchedDetails = activity.videoAnalytics?.videosWatched.find(v => v.videoId.toString() === video._id.toString());
    console.log(`   - Video watch complete state: ${watchedDetails?.isCompleted} (Expected: true)`);
    console.log(`   - Video completion percentage: ${watchedDetails?.completionPercentage}% (Expected: 97%)`);

    if (activity.totalVideosWatched !== 1 || activity.videoAnalytics.totalWatchTime !== 290) {
      throw new Error('❌ Video watch analytics tracking failed!');
    }
    console.log('✅ Video analytics tracking verified successfully!\n');

    // 6. Test Assessment Analytics
    console.log('➡️ STEP 5: Simulating assessment attempt submission...');
    
    // Find or seed an assessment
    let assessment = await Assessment.findOne();
    if (!assessment) {
      console.log('   - Seeding a dummy assessment for attempt tracking...');
      const Domain = require('./models/Domain');
      let domain = await Domain.findOne();
      if (!domain) {
        domain = await Domain.create({ name: 'DSA', slug: 'dsa', shortDescription: 'DSA preparation track' });
      }
      assessment = await Assessment.create({
        title: 'MERN Stack Quiz',
        description: 'Test quiz details',
        domainId: domain._id,
        assessmentLink: 'https://hackerrank.com/test1'
      });
    }

    console.log(`   - Attempting assessment "${assessment.title}"...`);
    // Attempt 1: Failed, score 40, took 120s
    await activityService.trackAssessmentActivity(user._id, assessment._id, 40, false, 120);
    // Attempt 2: Passed, score 80, took 180s
    await activityService.trackAssessmentActivity(user._id, assessment._id, 80, true, 180);

    activity = await UserActivity.findOne({ userId: user._id });

    console.log('   Verification:');
    console.log(`   - totalAssessmentsAttempted: ${activity.totalAssessmentsAttempted} (Expected: 2)`);
    console.log(`   - totalPassed: ${activity.assessmentAnalytics?.totalPassed} (Expected: 1)`);
    console.log(`   - averageScore: ${activity.assessmentAnalytics?.averageScore}% (Expected: 60%)`);
    console.log(`   - totalTimeSpent: ${activity.assessmentAnalytics?.totalTimeSpent}s (Expected: 300s)`);

    if (activity.totalAssessmentsAttempted !== 2 || activity.assessmentAnalytics.totalPassed !== 1 || activity.assessmentAnalytics.averageScore !== 60) {
      throw new Error('❌ Assessment analytics tracking failed!');
    }
    console.log('✅ Assessment analytics tracking verified successfully!\n');

    // 7. Test Logout Tracking
    console.log('➡️ STEP 6: Simulating user logout session close...');
    
    // Record logout
    activity = await activityService.recordLogout(user._id);

    console.log('   Verification:');
    console.log(`   - currentSessionStart: ${activity.currentSessionStart} (Expected: null)`);
    console.log(`   - totalSessions: ${activity.totalSessions} (Expected: 1)`);
    console.log(`   - lastLogoutAt: ${activity.lastLogoutAt}`);
    console.log(`   - totalTimeSpentInSeconds: ${activity.totalTimeSpentInSeconds} seconds`);
    console.log(`   - longestSessionDuration: ${activity.longestSessionDuration} seconds`);

    if (activity.currentSessionStart !== null || activity.totalSessions !== 1) {
      throw new Error('❌ Logout session ending failed!');
    }
    console.log('✅ Logout session tracking verified successfully!\n');

    console.log('🎉 ALL USER ACTIVITY TRACKING SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed cleanly.');
  }
};

runTests();
