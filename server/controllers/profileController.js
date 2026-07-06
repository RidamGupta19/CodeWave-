const Course = require('../models/Course');
const Batch = require('../models/Batch');
const BatchSchedule = require('../models/BatchSchedule');
const UserRoadmap = require('../models/UserRoadmap');
const User = require('../models/User');

const getNextClassDate = (classDays, startTime) => {
  if (!classDays || classDays.length === 0 || !startTime) return null;
  
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };

  const now = new Date();
  const currentDay = now.getDay();
  
  let hours = 19;
  let minutes = 0;
  
  if (startTime.includes(':')) {
    const parts = startTime.split(':');
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
    if (startTime.toLowerCase().includes('pm') && hours < 12) hours += 12;
    if (startTime.toLowerCase().includes('am') && hours === 12) hours = 0;
  }

  let minDiff = 100;
  let nextDate = null;

  classDays.forEach(day => {
    const targetDayNum = dayMap[day];
    if (targetDayNum === undefined) return;
    
    let diff = targetDayNum - currentDay;
    if (diff < 0) diff += 7;
    if (diff === 0) {
      const classTime = new Date(now);
      classTime.setHours(hours, minutes, 0, 0);
      if (classTime <= now) {
        diff = 7;
      }
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      nextDate = new Date(now);
      nextDate.setDate(now.getDate() + diff);
      nextDate.setHours(hours, minutes, 0, 0);
    }
  });

  return nextDate;
};

// @desc    Get student course details
// @route   GET /api/profile/course
exports.getCourseDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.courseId) {
      return res.json({ success: true, message: 'No course assigned.', data: null });
    }

    const course = await Course.findById(user.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Assigned course not found.' });
    }

    res.json({
      success: true,
      data: {
        courseName: course.courseName,
        description: course.description,
        duration: course.duration,
        enrollmentDate: user.enrollmentDate,
        courseStatus: user.courseStatus,
        startDate: user.enrollmentDate,
        endDate: new Date(new Date(user.enrollmentDate).setMonth(new Date(user.enrollmentDate).getMonth() + (parseInt(course.duration) || 6)))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get student batch details
// @route   GET /api/profile/batch
exports.getBatchDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.batchId) {
      return res.json({ success: true, message: 'No batch assigned.', data: null });
    }

    const batch = await Batch.findById(user.batchId).populate('assignedTeacher');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Assigned batch not found.' });
    }

    res.json({
      success: true,
      data: {
        batchName: batch.batchName,
        assignedTeacher: batch.assignedTeacher ? batch.assignedTeacher.name : 'Not Assigned',
        studentsCount: batch.students ? batch.students.length : 0,
        timing: batch.timing || 'Not Specified',
        createdAt: batch.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get student class schedule
// @route   GET /api/profile/schedule
exports.getScheduleDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.batchId) {
      return res.json({ success: true, message: 'No schedule active.', data: null });
    }

    const schedule = await BatchSchedule.findOne({ batchId: user.batchId });
    const batch = await Batch.findById(user.batchId);
    
    // Fetch Level progress summary
    const roadmap = await UserRoadmap.findOne({ userId: req.user._id, courseId: user.courseId });

    if (!schedule) {
      return res.json({
        success: true,
        data: {
          classDays: [],
          startTime: '',
          endTime: '',
          timezone: 'Asia/Kolkata',
          holidayDates: [],
          upcomingClass: null,
          roadmap: roadmap ? {
            currentLevel: roadmap.currentLevel,
            progress: roadmap.roadmapProgress
          } : null
        }
      });
    }

    // Calculate upcoming class
    let upcomingClass = null;
    const nextDate = getNextClassDate(schedule.classDays, schedule.startTime);
    if (nextDate) {
      upcomingClass = {
        date: nextDate,
        time: schedule.startTime
      };
    }

    // Check if there is an extra class that is sooner
    if (schedule.extraClasses && schedule.extraClasses.length > 0) {
      const now = new Date();
      const futureExtraClasses = schedule.extraClasses
        .filter(ec => new Date(ec.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (futureExtraClasses.length > 0) {
        const earliestExtra = futureExtraClasses[0];
        const extraDate = new Date(earliestExtra.date);
        
        let extraHours = 19;
        let extraMins = 0;
        if (earliestExtra.startTime.includes(':')) {
          const parts = earliestExtra.startTime.split(':');
          extraHours = parseInt(parts[0]);
          extraMins = parseInt(parts[1]);
        }
        extraDate.setHours(extraHours, extraMins, 0, 0);

        if (!upcomingClass || extraDate < upcomingClass.date) {
          upcomingClass = {
            date: extraDate,
            time: earliestExtra.startTime,
            isExtra: true,
            topic: earliestExtra.topic
          };
        }
      }
    }

    res.json({
      success: true,
      data: {
        classDays: schedule.classDays,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        timezone: schedule.timezone,
        holidayDates: schedule.holidayDates,
        upcomingClass,
        roadmap: roadmap ? {
          currentLevel: roadmap.currentLevel,
          progress: roadmap.roadmapProgress,
          currentModule: roadmap.customRoadmapConfig?.find(l => l.levelNumber === roadmap.currentLevel)?.name || 'Baseline'
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
