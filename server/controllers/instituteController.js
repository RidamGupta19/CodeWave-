const mongoose = require('mongoose');
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
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Helper to provision user account
async function provisionUser(fullName, email, role) {
  let user = await User.findOne({ email });
  if (user) {
    user.role = role;
    await user.save();
    return user;
  }
  const defaultPassword = 'CodeWave@123'; // Standard default password
  user = await User.create({
    fullName,
    email,
    password: defaultPassword,
    role
  });
  return user;
}

// ==========================================
// 1. STUDENT MANAGEMENT
// ==========================================
exports.getStudents = async (req, res) => {
  try {
    const { search, course, batch, status } = req.query;
    let query = {};

    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (teacher) {
        const teacherBatches = await Batch.find({ assignedTeacher: teacher._id });
        const batchIds = teacherBatches.map(tb => tb._id);
        
        if (batch) {
          // If a specific batch is queried, make sure the teacher is assigned to it
          if (batchIds.map(id => id.toString()).includes(batch.toString())) {
            query.batch = batch;
          } else {
            return res.json({ success: true, data: [] });
          }
        } else {
          // Otherwise, filter by any of the teacher's batches
          query.batch = { $in: batchIds };
        }
      } else {
        return res.json({ success: true, data: [] });
      }
    } else {
      if (batch) query.batch = batch;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (course) query.course = course;
    if (status) query.status = status;

    const students = await Student.find(query)
      .populate('course')
      .populate('batch');

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { rollNumber, fullName, email, phone, address, course, batch, admissionDate, status, profilePhoto } = req.body;

    const existingStudent = await Student.findOne({ $or: [{ rollNumber }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this Roll Number or Email already exists.' });
    }

    // Provision User account
    const user = await provisionUser(fullName, email, 'student');

    const student = await Student.create({
      userId: user._id,
      rollNumber,
      fullName,
      email,
      phone,
      address,
      course: course || null,
      batch: batch || null,
      admissionDate: admissionDate || Date.now(),
      status: status || 'active',
      profilePhoto: profilePhoto || ''
    });

    // If batch assigned, add student to batch
    if (batch) {
      await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
    }

    // Initialize Fee entry if course is selected
    if (course) {
      const courseObj = await Course.findById(course);
      if (courseObj) {
        await Fee.create({
          student: student._id,
          course: courseObj._id,
          totalFees: courseObj.fees,
          remainingAmount: courseObj.fees
        });
      }
      try {
        const { createRoadmapForUser } = require('./userRoadmapController');
        await createRoadmapForUser(user._id, course, req.user._id, 'default');
      } catch (err) {
        console.error('Failed to auto-create user roadmap:', err.message);
      }
    }

    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { fullName, email, phone, address, course, batch, status, profilePhoto } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Handle batch changes in Batch model
    if (batch && student.batch && student.batch.toString() !== batch) {
      // Remove from old batch
      await Batch.findByIdAndUpdate(student.batch, { $pull: { students: student._id } });
      // Add to new batch
      await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
    } else if (batch && !student.batch) {
      await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
    }

    const oldCourse = student.course;
    student.fullName = fullName || student.fullName;
    student.phone = phone !== undefined ? phone : student.phone;
    student.address = address !== undefined ? address : student.address;
    student.course = course !== undefined ? (course || null) : student.course;
    student.batch = batch !== undefined ? (batch || null) : student.batch;
    student.status = status || student.status;
    student.profilePhoto = profilePhoto !== undefined ? profilePhoto : student.profilePhoto;

    await student.save();

    if (course !== undefined && course !== null && (!oldCourse || oldCourse.toString() !== course.toString())) {
      try {
        const { createRoadmapForUser } = require('./userRoadmapController');
        await createRoadmapForUser(student.userId, course, req.user._id, 'default');
      } catch (err) {
        console.error('Failed to auto-provision updated user roadmap:', err.message);
      }
    }

    // Sync user details
    await User.findByIdAndUpdate(student.userId, { fullName: student.fullName });

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Remove from Batch students array
    if (student.batch) {
      await Batch.findByIdAndUpdate(student.batch, { $pull: { students: student._id } });
    }

    // Delete associated User
    await User.findByIdAndDelete(student.userId);

    // Delete fee records
    await Fee.deleteMany({ student: student._id });

    // Delete attendance records
    await Attendance.deleteMany({ studentId: student._id });

    // Finally delete student
    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Student and related records deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. TEACHER MANAGEMENT
// ==========================================
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json({ success: true, data: teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, qualification, experience, salary, joiningDate } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher with this email already exists.' });
    }

    // Provision User account as teacher
    const user = await provisionUser(name, email, 'teacher');

    const teacher = await Teacher.create({
      userId: user._id,
      name,
      email,
      phone,
      subject,
      qualification,
      experience,
      salary: salary || 0,
      joiningDate: joiningDate || Date.now()
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, phone, subject, qualification, experience, salary } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    teacher.name = name || teacher.name;
    teacher.phone = phone !== undefined ? phone : teacher.phone;
    teacher.subject = subject || teacher.subject;
    teacher.qualification = qualification !== undefined ? qualification : teacher.qualification;
    teacher.experience = experience !== undefined ? experience : teacher.experience;
    teacher.salary = salary !== undefined ? salary : teacher.salary;

    await teacher.save();

    // Sync user details
    await User.findByIdAndUpdate(teacher.userId, { fullName: teacher.name });

    res.json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    // Remove as assigned teacher in Courses and Batches
    await Course.updateMany({ assignedTeacher: teacher._id }, { $unset: { assignedTeacher: '' } });
    await Batch.updateMany({ assignedTeacher: teacher._id }, { $unset: { assignedTeacher: '' } });

    // Delete associated User
    await User.findByIdAndDelete(teacher.userId);

    // Finally delete teacher
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. COURSE MANAGEMENT
// ==========================================
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('assignedTeacher');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseName, description, duration, fees, assignedTeacher } = req.body;
    const course = await Course.create({
      courseName,
      description,
      duration,
      fees,
      assignedTeacher: assignedTeacher || null
    });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseName, description, duration, fees, assignedTeacher } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    course.courseName = courseName || course.courseName;
    course.description = description !== undefined ? description : course.description;
    course.duration = duration || course.duration;
    course.fees = fees !== undefined ? fees : course.fees;
    course.assignedTeacher = assignedTeacher !== undefined ? (assignedTeacher || null) : course.assignedTeacher;

    await course.save();
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. BATCH MANAGEMENT
// ==========================================
exports.getBatches = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (teacher) {
        query.assignedTeacher = teacher._id;
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    const batches = await Batch.find(query)
      .populate('assignedTeacher')
      .populate('students');
    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const { batchName, startDate, endDate, timing, assignedTeacher, students } = req.body;
    const batch = await Batch.create({
      batchName,
      startDate,
      endDate: endDate || null,
      timing,
      assignedTeacher: assignedTeacher || null,
      students: students || []
    });

    // Update students batch reference
    if (students && students.length > 0) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $set: { batch: batch._id } }
      );
    }

    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { batchName, startDate, endDate, timing, assignedTeacher, students } = req.body;
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Handle student changes in batch
    if (students !== undefined) {
      // Clear old students references to this batch
      await Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });
      // Update new students batch references
      await Student.updateMany({ _id: { $in: students } }, { $set: { batch: batch._id } });
      batch.students = students;
    }

    batch.batchName = batchName || batch.batchName;
    batch.startDate = startDate || batch.startDate;
    batch.endDate = endDate !== undefined ? endDate : batch.endDate;
    batch.timing = timing || batch.timing;
    batch.assignedTeacher = assignedTeacher !== undefined ? (assignedTeacher || null) : batch.assignedTeacher;

    await batch.save();
    res.json({ success: true, data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Clear student references to this batch
    await Student.updateMany({ batch: batch._id }, { $unset: { batch: '' } });

    await Batch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 5. ATTENDANCE MANAGEMENT
// ==========================================
exports.markAttendance = async (req, res) => {
  try {
    const { batchId, date, courseId, records } = req.body; // records: [{ studentId, status }]

    // Input Validation
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'Batch ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ success: false, message: 'Invalid Batch ID format' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Records array is required and cannot be empty' });
    }

    // Find teacher profile if role is teacher
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only instructors or admins can log attendance.' });
    }

    // Normalize date to UTC midnight (00:00:00.000Z) to avoid timezone shifts
    const formattedDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));

    // Deduplicate records by studentId to prevent duplicate processing
    const uniqueRecords = [];
    const seenStudents = new Set();
    for (const record of records) {
      if (record.studentId && !seenStudents.has(record.studentId.toString())) {
        seenStudents.add(record.studentId.toString());
        uniqueRecords.push(record);
      }
    }

    const logs = [];
    for (const record of uniqueRecords) {
      if (!record.studentId || !record.status) {
        return res.status(400).json({ success: false, message: 'Each record must have a studentId and status' });
      }
      if (!mongoose.Types.ObjectId.isValid(record.studentId)) {
        return res.status(400).json({ success: false, message: `Invalid studentId format: ${record.studentId}` });
      }
      if (!['Present', 'Absent', 'Leave', 'Holiday'].includes(record.status)) {
        return res.status(400).json({ success: false, message: `Invalid status '${record.status}'. Must be Present, Absent, Leave, or Holiday` });
      }

      // Fetch student to get default course if not supplied
      const studentObj = await Student.findById(record.studentId);
      if (!studentObj) {
        return res.status(404).json({ success: false, message: `Student not found with ID: ${record.studentId}` });
      }
      const finalCourseId = courseId || studentObj.course;

      // Match strictly on unique compound index properties { studentId, courseId, batchId, date }
      const query = { 
        studentId: record.studentId, 
        courseId: finalCourseId,
        batchId: batchId,
        date: formattedDate
      };
      
      const update = { 
        status: record.status,
        teacherId: teacher ? teacher._id : undefined,
        markedBy: req.user._id,
        markedAt: new Date()
      };
      
      const attendance = await Attendance.findOneAndUpdate(query, update, { upsert: true, new: true });
      logs.push(attendance);
    }

    // Add attendance audit logs
    const AuditLogs = require('../models/AuditLogs');
    try {
      await AuditLogs.create({
        userId: req.user._id,
        userEmail: req.user.email,
        action: 'MARK_ATTENDANCE',
        details: `Saved attendance for batch ${batchId} on ${formattedDate.toUTCString()}. Total records: ${uniqueRecords.length}`,
        ipAddress: req.ip || '127.0.0.1',
        deviceInfo: req.headers['user-agent'] || 'Unknown'
      });
    } catch (auditErr) {
      console.error('Failed to log attendance audit record:', auditErr.message);
    }

    res.json({ success: true, message: 'Attendance records saved successfully', data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { batchId, studentId, courseId, status, startDate, endDate, date } = req.query;
    let query = {};
    
    if (batchId) query.batchId = batchId;
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;
    
    if (date) {
      const searchDate = new Date(date);
      const utcSearchDate = new Date(Date.UTC(searchDate.getUTCFullYear(), searchDate.getUTCMonth(), searchDate.getUTCDate()));
      query.date = utcSearchDate;
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        query.date.$gte = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      }
      if (endDate) {
        const end = new Date(endDate);
        query.date.$lte = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999));
      }
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId')
      .populate('courseId')
      .sort({ date: -1 });

    res.json({ success: true, data: attendanceRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAttendanceById = async (req, res) => {
  try {
    const { status, date } = req.body;
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (status) {
      if (!['Present', 'Absent', 'Leave', 'Holiday'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status. Must be Present, Absent, Leave, or Holiday' });
      }
      attendance.status = status;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date format' });
      }
      const utcDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));
      attendance.date = utcDate;
    }

    await attendance.save();
    res.json({ success: true, message: 'Attendance record updated successfully', data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }
    const records = await Attendance.find({ studentId })
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId')
      .populate('courseId')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ success: false, message: 'Invalid batch ID format' });
    }
    const records = await Attendance.find({ batchId })
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId')
      .populate('courseId')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }
    const records = await Attendance.find({ courseId })
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId')
      .populate('courseId')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGeneralAttendanceReport = async (req, res) => {
  try {
    const { batchId, studentId, courseId, startDate, endDate } = req.query;
    let query = {};
    
    if (batchId) query.batchId = batchId;
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        query.date.$gte = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      }
      if (endDate) {
        const end = new Date(endDate);
        query.date.$lte = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999));
      }
    }

    const records = await Attendance.find(query)
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId')
      .populate('courseId')
      .sort({ date: -1 });

    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const leave = records.filter(r => r.status === 'Leave').length;
    const holiday = records.filter(r => r.status === 'Holiday').length;
    
    const percentage = total > 0 ? Math.round(((present + leave + holiday) / total) * 100) : 100;

    res.json({
      success: true,
      data: {
        statistics: {
          total,
          present,
          absent,
          leave,
          holiday,
          percentage
        },
        records
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStudentAttendanceStats = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const attendance = await Attendance.find({ studentId: student._id });
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const leave = attendance.filter(a => a.status === 'Leave').length;
    const percentage = total > 0 ? Math.round(((present + leave) / total) * 100) : 100;

    res.json({
      success: true,
      data: {
        total,
        present,
        absent: total - present - leave,
        leave,
        percentage,
        records: attendance
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get complete student attendance report (statistics, subject-wise, monthly, calendar, and paginated logs)
// @route   GET /api/institute/attendance/report
// @access  Private (student only)
exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { courseId, month, year, page = 1, limit = 10 } = req.query;

    // 1. Overall stats query
    let statsQuery = { studentId: student._id };
    const allAttendance = await Attendance.find(statsQuery).populate('courseId');

    const total = allAttendance.length;
    const present = allAttendance.filter(a => a.status === 'Present').length;
    const leave = allAttendance.filter(a => a.status === 'Leave').length;
    const percentage = total > 0 ? Math.round(((present + leave) / total) * 100) : 100;

    // 2. Subject-wise (course-wise) grouping
    const subjectWiseMap = {};
    allAttendance.forEach(a => {
      const courseName = a.courseId?.courseName || 'General';
      const key = a.courseId?._id?.toString() || 'general';

      if (!subjectWiseMap[key]) {
        subjectWiseMap[key] = {
          courseId: a.courseId?._id || null,
          courseName,
          total: 0,
          present: 0,
          leave: 0
        };
      }
      subjectWiseMap[key].total += 1;
      if (a.status === 'Present') subjectWiseMap[key].present += 1;
      if (a.status === 'Leave') subjectWiseMap[key].leave += 1;
    });

    const subjectWise = Object.values(subjectWiseMap).map(sub => ({
      ...sub,
      percentage: sub.total > 0 ? Math.round(((sub.present + sub.leave) / sub.total) * 100) : 100
    }));

    // 3. Filtered calendar logs & history list
    let filterQuery = { studentId: student._id };
    if (courseId) {
      filterQuery.courseId = courseId;
    }

    // Handle calendar month/year filter
    const filterMonth = parseInt(month);
    const filterYear = parseInt(year);
    if (!isNaN(filterMonth) && !isNaN(filterYear)) {
      const start = new Date(Date.UTC(filterYear, filterMonth - 1, 1));
      const end = new Date(Date.UTC(filterYear, filterMonth, 0, 23, 59, 59, 999));
      filterQuery.date = { $gte: start, $lte: end };
    }

    const calendarRecords = await Attendance.find(filterQuery)
      .populate('courseId')
      .populate('batchId')
      .populate('teacherId');

    // Paginated history list
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = calendarRecords.length;
    const paginatedRecords = calendarRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        statistics: {
          total,
          present,
          absent: total - present - leave,
          leave,
          percentage
        },
        subjectWise,
        calendarData: calendarRecords.map(r => ({
          date: r.date.toISOString().split('T')[0],
          status: r.status,
          topic: r.topic || 'Classroom session'
        })),
        history: {
          records: paginatedRecords,
          totalPages: Math.ceil(totalRecords / parseInt(limit)),
          currentPage: parseInt(page),
          totalRecords
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 6. FEES MANAGEMENT
// ==========================================
exports.getFees = async (req, res) => {
  try {
    const { studentId } = req.query;
    let query = {};
    if (studentId) query.student = studentId;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) query.student = student._id;
    }

    const fees = await Fee.find(query)
      .populate({
        path: 'student',
        populate: { path: 'batch' }
      })
      .populate('course');

    res.json({ success: true, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.recordFeePayment = async (req, res) => {
  try {
    const { paidAmount } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee ledger not found' });

    fee.paidAmount = (fee.paidAmount || 0) + Number(paidAmount);
    fee.paymentDate = Date.now();
    await fee.save();

    res.json({ success: true, data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 7. NOTICE BOARD
// ==========================================
exports.getNotices = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.targetRoles = { $in: ['all', 'student'] };
    } else if (req.user.role === 'teacher') {
      query.targetRoles = { $in: ['all', 'teacher'] };
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetRoles } = req.body;
    const notice = await Notice.create({
      title,
      content,
      targetRoles: targetRoles || ['all'],
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 8. STUDY MATERIAL
// ==========================================
exports.getStudyMaterials = async (req, res) => {
  try {
    const { courseId, batchId } = req.query;
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        const batchId = student.batch ? student.batch : null;
        const courseId = student.course ? student.course : null;
        query.$or = [
          { batch: batchId, course: courseId },
          { batch: null, course: courseId },
          { batch: batchId, course: null },
          { batch: null, course: null }
        ];
      }
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (teacher) {
        const teacherBatches = await Batch.find({ assignedTeacher: teacher._id });
        const batchIds = teacherBatches.map(tb => tb._id);
        
        query.$or = [
          { uploadedBy: req.user._id },
          { batch: { $in: batchIds } }
        ];

        if (courseId) query.course = courseId;
        if (batchId && batchIds.map(id => id.toString()).includes(batchId.toString())) {
          query.batch = batchId;
        }
      } else {
        return res.json({ success: true, data: [] });
      }
    } else {
      if (courseId) query.course = courseId;
      if (batchId) query.batch = batchId;
    }

    const materials = await StudyMaterial.find(query)
      .populate('course')
      .populate('batch')
      .populate('uploadedBy', 'fullName role')
      .populate('versions.updatedBy', 'fullName role')
      .populate('downloads.user', 'fullName email role');

    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadStudyMaterial = async (req, res) => {
  try {
    const { title, description, materialType, fileUrl, course, batch } = req.body;
    const material = await StudyMaterial.create({
      title,
      description,
      materialType,
      fileUrl,
      course: course || null,
      batch: batch || null,
      uploadedBy: req.user._id,
      version: 1,
      versions: [],
      downloads: [],
      downloadCount: 0
    });
    
    const populated = await StudyMaterial.findById(material._id)
      .populate('course')
      .populate('batch')
      .populate('uploadedBy', 'fullName role');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStudyMaterial = async (req, res) => {
  try {
    const { title, description, materialType, fileUrl, course, batch } = req.body;
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    // Version management logic:
    // If the fileUrl, title, or description has changed, save the previous state to the versions history list
    const fileChanged = fileUrl && fileUrl !== material.fileUrl;
    const infoChanged = title !== material.title || description !== material.description || materialType !== material.materialType;
    
    if (fileChanged || infoChanged) {
      material.versions.push({
        versionNumber: material.version,
        title: material.title,
        description: material.description,
        fileUrl: material.fileUrl,
        updatedAt: material.updatedAt || new Date(),
        updatedBy: material.uploadedBy || req.user._id
      });
      material.version += 1;
    }

    material.title = title || material.title;
    material.description = description !== undefined ? description : material.description;
    material.materialType = materialType || material.materialType;
    material.fileUrl = fileUrl || material.fileUrl;
    material.course = course || null;
    material.batch = batch || null;
    
    // Track who did the last update
    material.uploadedBy = req.user._id;

    await material.save();
    
    // Return populated document
    const updated = await StudyMaterial.findById(material._id)
      .populate('course')
      .populate('batch')
      .populate('uploadedBy', 'fullName role')
      .populate('versions.updatedBy', 'fullName role')
      .populate('downloads.user', 'fullName email role');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStudyMaterial = async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Study material deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackDownload = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }
    
    material.downloadCount += 1;
    material.downloads.push({
      user: req.user._id,
      downloadedAt: new Date()
    });
    
    await material.save();
    res.json({ success: true, message: 'Download tracked successfully', downloadCount: material.downloadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 9. CLASS SCHEDULER
// ==========================================
// Helper to compute start datetime
function getClassStartDateTime(dateObj, timeStr) {
  try {
    const start = new Date(dateObj);
    let hours = 0;
    let minutes = 0;
    
    const cleanTime = timeStr.trim().toUpperCase();
    if (cleanTime.includes('AM') || cleanTime.includes('PM')) {
      const parts = cleanTime.replace(/AM|PM/, '').trim().split(':');
      hours = parseInt(parts[0], 10);
      minutes = parts[1] ? parseInt(parts[1], 10) : 0;
      
      if (cleanTime.includes('PM') && hours < 12) {
        hours += 12;
      }
      if (cleanTime.includes('AM') && hours === 12) {
        hours = 0;
      }
    } else {
      const parts = cleanTime.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    }
    
    start.setHours(hours, minutes, 0, 0);
    return start;
  } catch (err) {
    return new Date(dateObj);
  }
}

exports.getSchedules = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        query.batch = student.batch;
      }
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (teacher) {
        query.teacher = teacher._id;
      }
    }

    const schedules = await Schedule.find(query)
      .populate('course')
      .populate('batch')
      .populate('teacher')
      .sort({ date: 1 });

    const now = new Date();
    const enriched = schedules.map(s => {
      const startDateTime = getClassStartDateTime(s.date, s.time);
      // Assume class lasts for 90 minutes
      const endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
      
      const isLive = now >= startDateTime && now <= endDateTime;
      const minutesToStart = Math.round((startDateTime - now) / 60000);
      
      let status = 'UPCOMING';
      if (isLive) {
        status = 'LIVE';
      } else if (now > endDateTime) {
        status = 'COMPLETED';
      }

      return {
        ...s.toObject(),
        startDateTime,
        isLive,
        minutesToStart,
        status
      };
    });

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { course, teacher, batch, date, time, meetingLink, topic } = req.body;
    const schedule = await Schedule.create({
      course,
      teacher,
      batch,
      date,
      time,
      meetingLink,
      topic
    });
    res.status(201).json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Class schedule cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 10. ASSIGNMENTS
// ==========================================
exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        query.batch = student.batch;
      }
    } else if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (teacher) {
        const teacherBatches = await Batch.find({ assignedTeacher: teacher._id });
        const batchIds = teacherBatches.map(tb => tb._id);
        
        query.$or = [
          { uploadedBy: req.user._id },
          { batch: { $in: batchIds } }
        ];
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    const assignments = await Assignment.find(query)
      .populate('course')
      .populate('batch')
      .populate('submissions.student');

    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course, batch, dueDate, fileUrl } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      course,
      batch,
      dueDate,
      fileUrl,
      uploadedBy: req.user._id
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    // Remove old submission from this student if exists
    assignment.submissions = assignment.submissions.filter(s => s.student.toString() !== student._id.toString());
    
    // Add new submission
    assignment.submissions.push({
      student: student._id,
      fileUrl,
      submittedAt: Date.now(),
      status: 'Pending'
    });

    await assignment.save();

    // Track assignment submission in UserActivity
    try {
      const { trackAssignmentSubmission } = require('../services/activityService');
      await trackAssignmentSubmission(student.userId, assignment._id);
    } catch (e) {
      console.error('Failed to track assignment submission:', e);
    }

    res.json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.gradeAssignment = async (req, res) => {
  try {
    const { submissionId, grade, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const sub = assignment.submissions.id(submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });

    sub.grade = grade;
    sub.feedback = feedback;
    sub.status = 'Graded';

    await assignment.save();
    res.json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 11. DASHBOARD ANALYTICS API
// ==========================================
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({});
    const totalTeachers = await Teacher.countDocuments({});
    const totalCourses = await Course.countDocuments({});
    const totalBatches = await Batch.countDocuments({});
    const activeCareerLearners = await User.countDocuments({ role: 'student', activeDomain: { $ne: null } });

    // Recharts Fees Analytics
    const fees = await Fee.find({});
    const totalFeesExpected = fees.reduce((acc, f) => acc + (f.totalFees || 0), 0);
    const totalFeesCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
    const totalFeesPending = fees.reduce((acc, f) => acc + (f.remainingAmount || 0), 0);

    // Recharts Attendance Rate (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const attendanceLogs = await Attendance.find({ date: { $gte: thirtyDaysAgo } });
    const presents = attendanceLogs.filter(a => a.status === 'Present').length;
    const totalAttendanceCount = attendanceLogs.length;
    const overallAttendanceRate = totalAttendanceCount > 0 ? Math.round((presents / totalAttendanceCount) * 100) : 100;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalBatches,
        activeCareerLearners,
        financials: {
          expected: totalFeesExpected,
          collected: totalFeesCollected,
          pending: totalFeesPending
        },
        overallAttendanceRate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });

    const batches = await Batch.find({ assignedTeacher: teacher._id }).populate('students');
    const studentCount = batches.reduce((acc, b) => acc + b.students.length, 0);

    const now = new Date();
    // Get all schedules for this teacher today or in the future
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const schedules = await Schedule.find({ 
      teacher: teacher._id, 
      date: { $gte: startOfToday } 
    }).populate('batch').populate('course').sort({ date: 1 });

    // Pending assignments count
    const teacherAssignments = await Assignment.find({ uploadedBy: req.user._id });
    let pendingAssignmentsCount = 0;
    teacherAssignments.forEach(a => {
      pendingAssignmentsCount += a.submissions.filter(s => s.status === 'Pending').length;
    });

    // Recent announcements/notices
    const notices = await Notice.find({ 
      targetRoles: { $in: ['all', 'teacher'] } 
    }).sort({ createdAt: -1 }).limit(5);

    // Attendance summary for teacher's batches
    const batchIds = batches.map(b => b._id);
    const Attendance = require('../models/Attendance');
    const attendanceRecords = await Attendance.find({ batchId: { $in: batchIds } });
    const totalAtt = attendanceRecords.length;
    const presentAtt = attendanceRecords.filter(a => a.status === 'Present').length;
    const leaveAtt = attendanceRecords.filter(a => a.status === 'Leave').length;
    const attendancePercentage = totalAtt > 0 ? Math.round(((presentAtt + leaveAtt) / totalAtt) * 100) : 100;

    res.json({
      success: true,
      data: {
        teacher,
        totalBatches: batches.length,
        studentCount,
        upcomingClasses: schedules,
        pendingAssignmentsCount,
        recentAnnouncements: notices,
        attendanceSummary: {
          totalRecords: totalAtt,
          presentCount: presentAtt,
          leaveCount: leaveAtt,
          percentage: attendancePercentage
        },
        batches: batches.map(b => ({
          _id: b._id,
          batchName: b.batchName,
          studentCount: b.students.length,
          timing: b.timing
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('batch')
      .populate('course');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found. Please ask admin to register your profile.' });
    }

    const user = await User.findById(req.user._id).populate('activeDomain');

    const attendance = await Attendance.find({ studentId: student._id });
    const totalAtt = attendance.length;
    const presentAtt = attendance.filter(a => a.status === 'Present').length;
    const leaveAtt = attendance.filter(a => a.status === 'Leave').length;
    const holidayAtt = attendance.filter(a => a.status === 'Holiday').length;
    const attPercentage = totalAtt > 0 ? Math.round(((presentAtt + leaveAtt + holidayAtt) / totalAtt) * 100) : 100;

    // 1. Today's status
    const todayUTC = new Date();
    const todayFormatted = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate()));
    const todayRecord = attendance.find(a => new Date(a.date).getTime() === todayFormatted.getTime());
    const todayStatus = todayRecord ? todayRecord.status : 'Not Marked';

    // 2. Monthly percentage
    const currentMonth = todayUTC.getUTCMonth();
    const currentYear = todayUTC.getUTCFullYear();
    const monthlyRecords = attendance.filter(a => {
      const d = new Date(a.date);
      return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
    });
    const monthlyTotal = monthlyRecords.length;
    const monthlyPresent = monthlyRecords.filter(a => a.status === 'Present').length;
    const monthlyLeave = monthlyRecords.filter(a => a.status === 'Leave').length;
    const monthlyHoliday = monthlyRecords.filter(a => a.status === 'Holiday').length;
    const monthlyPercentage = monthlyTotal > 0 ? Math.round(((monthlyPresent + monthlyLeave + monthlyHoliday) / monthlyTotal) * 100) : 100;

    // 3. Attendance trend
    const sortedAttendance = [...attendance].sort((a,b) => new Date(b.date) - new Date(a.date));
    const last5 = sortedAttendance.slice(0, 5);
    const prev5 = sortedAttendance.slice(5, 10);
    const last5Rate = last5.length > 0 ? (last5.filter(a => ['Present', 'Leave', 'Holiday'].includes(a.status)).length / last5.length) * 100 : 100;
    const prev5Rate = prev5.length > 0 ? (prev5.filter(a => ['Present', 'Leave', 'Holiday'].includes(a.status)).length / prev5.length) * 100 : 100;
    const trendDiff = Math.round(last5Rate - prev5Rate);
    const attendanceTrend = trendDiff >= 0 ? `+${trendDiff}%` : `${trendDiff}%`;

    const fees = await Fee.findOne({ student: student._id });

    const today = new Date();
    today.setHours(0,0,0,0);
    const classes = await Schedule.find({ batch: student.batch, date: { $gte: today } }).populate('teacher').populate('course');

    const assignments = await Assignment.find({ batch: student.batch });
    const pendingAssignments = assignments.filter(a => 
      !a.submissions.some(s => s.student.toString() === student._id.toString())
    );

    const recentNotes = await StudyMaterial.find({ batch: student.batch, materialType: { $in: ['Notes', 'PDF'] } })
      .sort({ createdAt: -1 })
      .limit(5);

    const notices = await Notice.find({ targetRoles: { $in: ['all', 'student'] } })
      .sort({ createdAt: -1 })
      .limit(5);

    let upcomingAssessments = [];
    if (user && user.activeDomain) {
      const Assessment = require('../models/Assessment');
      upcomingAssessments = await Assessment.find({ domainId: user.activeDomain._id, isActive: true })
        .sort('order')
        .limit(5);
    }

    res.json({
      success: true,
      data: {
        student: {
          ...student.toObject(),
          activeDomain: user?.activeDomain
        },
        attPercentage,
        todayStatus,
        monthlyPercentage,
        attendanceTrend,
        fees,
        upcomingClasses: classes,
        pendingAssignments,
        recentNotes,
        notices,
        upcomingAssessments,
        materialsCount: await StudyMaterial.countDocuments({ batch: student.batch })
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTeacherStudentResults = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });

    const teacherBatches = await Batch.find({ assignedTeacher: teacher._id });
    const batchIds = teacherBatches.map(tb => tb._id);

    const students = await Student.find({ batch: { $in: batchIds } })
      .populate({
        path: 'userId',
        select: 'fullName email testResults',
        populate: {
          path: 'testResults.assessmentId',
          select: 'title passingScore platform'
        }
      })
      .populate('batch');

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
