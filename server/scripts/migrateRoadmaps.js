const Student = require('../models/Student');
const UserRoadmap = require('../models/UserRoadmap');
const VideoProgress = require('../models/VideoProgress');
const RoadmapProgress = require('../models/RoadmapProgress');
const { createRoadmapForUser, recalculateRoadmapProgress } = require('../controllers/userRoadmapController');

const migrateExistingRoadmaps = async () => {
  try {
    const students = await Student.find({ course: { $ne: null } });
    console.log(`[Migration] Found ${students.length} students with assigned courses.`);

    for (const student of students) {
      if (!student.userId) continue;

      let roadmap = await UserRoadmap.findOne({ userId: student.userId, courseId: student.course });
      if (!roadmap) {
        console.log(`[Migration] Creating new roadmap for user: ${student.fullName || student.email} - Course: ${student.course}`);
        roadmap = await createRoadmapForUser(student.userId, student.course, null, 'default');
      }

      // Sync watched videos for this student
      const videoProgresses = await VideoProgress.find({ user: student.userId, isCompleted: true }).populate('video');
      const courseVideoIds = videoProgresses
        .filter(vp => vp.video && vp.video.course && vp.video.course.toString() === student.course.toString())
        .map(vp => vp.video._id);

      roadmap.watchedVideos = courseVideoIds;

      // Sync completed assessments (passed assessments)
      const oldProgress = await RoadmapProgress.findOne({ student: student._id, course: student.course });
      if (oldProgress) {
        const passedAssIds = oldProgress.assessmentStatus
          .filter(a => a.isPassed)
          .map(a => a.assessmentId);
        roadmap.completedAssessments = passedAssIds;
      }

      // Recalculate level config locks, completedLevels, and roadmapProgress
      recalculateRoadmapProgress(roadmap);
      await roadmap.save();
    }
    console.log('[Migration] UserRoadmap migration completed successfully!');
  } catch (err) {
    console.error('[Migration] Failed to run roadmap migration:', err.message);
  }
};

module.exports = { migrateExistingRoadmaps };
