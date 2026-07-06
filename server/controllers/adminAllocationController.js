const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Teacher = require('../models/Teacher');
const BatchSchedule = require('../models/BatchSchedule');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const sendNotification = async (userId, title, message) => {
  try {
    await Notification.create({
      userId,
      type: 'info',
      title,
      message
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

const syncStudentDetails = async (userId, courseId, batchId) => {
  await User.findByIdAndUpdate(userId, { courseId, batchId });
  await Student.findOneAndUpdate(
    { userId }, 
    { course: courseId || null, batch: batchId || null },
    { new: true }
  );
};

// @desc    Assign Course to student
// @route   POST /api/admin/course/assign
exports.assignCourse = async (req, res) => {
  try {
    const { userId, studentId, courseId, batchId, courseStatus } = req.body;
    let resolvedUserId = userId;

    if (!resolvedUserId && studentId) {
      const stud = await Student.findById(studentId);
      if (stud) resolvedUserId = stud.userId;
    }

    if (!resolvedUserId || !courseId) {
      return res.status(400).json({ success: false, message: 'User ID and Course ID are required.' });
    }

    const courseObj = await Course.findById(courseId);
    if (!courseObj) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const updateFields = {
      courseId,
      courseStatus: courseStatus || 'Active'
    };
    if (batchId) {
      updateFields.batchId = batchId;
    }

    const user = await User.findByIdAndUpdate(resolvedUserId, updateFields, { new: true });
    await syncStudentDetails(resolvedUserId, courseId, batchId || user.batchId);

    // Auto-notify student
    await sendNotification(
      resolvedUserId,
      'Course Assigned',
      `You have been assigned to the course: ${courseObj.courseName}. Check your profile for schedule details!`
    );

    res.json({ success: true, message: 'Course assigned successfully.', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update Course details for student
// @route   PUT /api/admin/course/update
exports.updateCourseAssignment = async (req, res) => {
  try {
    const { userId, courseId, batchId, courseStatus } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const updateFields = {};
    if (courseId !== undefined) updateFields.courseId = courseId || null;
    if (batchId !== undefined) updateFields.batchId = batchId || null;
    if (courseStatus !== undefined) updateFields.courseStatus = courseStatus;

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    await syncStudentDetails(userId, user.courseId, user.batchId);

    if (courseId) {
      const courseObj = await Course.findById(courseId);
      await sendNotification(
        userId,
        'Course Assignment Updated',
        `Your course status has been updated. Course: ${courseObj ? courseObj.courseName : 'None'}. Status: ${user.courseStatus}.`
      );
    }

    res.json({ success: true, message: 'Course assignment updated successfully.', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Remove Course from student
// @route   DELETE /api/admin/course/remove
exports.removeCourse = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        courseId: null,
        batchId: null,
        courseStatus: 'Dropped'
      },
      { new: true }
    );

    await syncStudentDetails(userId, null, null);

    await sendNotification(
      userId,
      'Course Removed',
      'You have been removed from your active course. Please contact your coordinator for details.'
    );

    res.json({ success: true, message: 'Course removed successfully.', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create Batch
// @route   POST /api/admin/batch/create
exports.createBatch = async (req, res) => {
  try {
    const { batchName, assignedTeacher, timing, students, courseId } = req.body;

    if (!batchName) {
      return res.status(400).json({ success: false, message: 'Batch name is required.' });
    }

    // Create the Batch
    const batch = await Batch.create({
      batchName,
      startDate: req.body.startDate || new Date(),
      assignedTeacher: assignedTeacher || null,
      timing: timing || '19:00 - 21:00',
      students: students || []
    });

    // Create default BatchSchedule
    await BatchSchedule.create({
      batchId: batch._id,
      classDays: ['Monday', 'Wednesday', 'Friday'],
      startTime: '19:00',
      endTime: '21:00',
      timezone: 'Asia/Kolkata'
    });

    // Synchronize all added students
    if (students && students.length > 0) {
      for (const sId of students) {
        const student = await Student.findById(sId);
        if (student) {
          await User.findByIdAndUpdate(student.userId, { batchId: batch._id, courseId: courseId || student.course });
          await Student.findByIdAndUpdate(sId, { batch: batch._id, course: courseId || student.course });
          await sendNotification(
            student.userId,
            'Batch Assigned',
            `You have been allocated to batch: ${batchName}.`
          );
        }
      }
    }

    res.status(201).json({ success: true, message: 'Batch created successfully.', data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update Batch details
// @route   PUT /api/admin/batch/update
exports.updateBatch = async (req, res) => {
  try {
    const { batchId, batchName, assignedTeacher, timing, students } = req.body;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'Batch ID is required.' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const oldTeacher = batch.assignedTeacher;
    const oldStudents = new Set((batch.students || []).map(id => id.toString()));

    batch.batchName = batchName || batch.batchName;
    batch.assignedTeacher = assignedTeacher !== undefined ? (assignedTeacher || null) : batch.assignedTeacher;
    batch.timing = timing !== undefined ? timing : batch.timing;
    if (students !== undefined) {
      batch.students = students;
    }

    await batch.save();

    // Check if teacher changed
    if (assignedTeacher && (!oldTeacher || oldTeacher.toString() !== assignedTeacher.toString())) {
      const teacherObj = await Teacher.findById(assignedTeacher);
      // Notify all students in this batch
      const studentsList = await Student.find({ batch: batch._id });
      for (const s of studentsList) {
        await sendNotification(
          s.userId,
          'Instructor Assigned',
          `A new instructor, ${teacherObj ? teacherObj.name : 'Mentor'}, has been assigned to your batch ${batch.batchName}.`
        );
      }
    }

    // Handle student additions/removals
    if (students !== undefined) {
      const newStudents = new Set(students.map(id => id.toString()));
      
      // Removed students
      for (const sId of oldStudents) {
        if (!newStudents.has(sId)) {
          const student = await Student.findById(sId);
          if (student) {
            await User.findByIdAndUpdate(student.userId, { batchId: null });
            await Student.findByIdAndUpdate(sId, { batch: null });
            await sendNotification(student.userId, 'Batch Removed', `You have been removed from batch: ${batch.batchName}.`);
          }
        }
      }

      // Added students
      for (const sId of newStudents) {
        if (!oldStudents.has(sId)) {
          const student = await Student.findById(sId);
          if (student) {
            await User.findByIdAndUpdate(student.userId, { batchId: batch._id });
            await Student.findByIdAndUpdate(sId, { batch: batch._id });
            await sendNotification(student.userId, 'Batch Allocated', `You have been allocated to batch: ${batch.batchName}.`);
          }
        }
      }
    }

    res.json({ success: true, message: 'Batch updated successfully.', data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update Batch Schedule
// @route   PUT /api/admin/schedule/update
exports.updateSchedule = async (req, res) => {
  try {
    const { batchId, classDays, startTime, endTime, timezone, holidayDates, extraClasses, cancelledClasses } = req.body;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'Batch ID is required.' });
    }

    let schedule = await BatchSchedule.findOne({ batchId });
    if (!schedule) {
      schedule = new BatchSchedule({ batchId });
    }

    if (classDays !== undefined) schedule.classDays = classDays;
    if (startTime !== undefined) schedule.startTime = startTime;
    if (endTime !== undefined) schedule.endTime = endTime;
    if (timezone !== undefined) schedule.timezone = timezone;
    if (holidayDates !== undefined) schedule.holidayDates = holidayDates;
    if (extraClasses !== undefined) schedule.extraClasses = extraClasses;
    if (cancelledClasses !== undefined) schedule.cancelledClasses = cancelledClasses;

    await schedule.save();

    // Notify batch members of schedule changes
    const batch = await Batch.findById(batchId);
    const studentsList = await Student.find({ batch: batchId });

    for (const s of studentsList) {
      if (extraClasses && extraClasses.length > 0) {
        await sendNotification(
          s.userId,
          'Extra Class Scheduled',
          `An extra class has been added to batch ${batch ? batch.batchName : ''}. Check your profile schedule.`
        );
      } else {
        await sendNotification(
          s.userId,
          'Class Schedule Updated',
          `Class schedules have been updated for batch ${batch ? batch.batchName : ''}.`
        );
      }
    }

    res.json({ success: true, message: 'Schedule updated successfully.', data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
