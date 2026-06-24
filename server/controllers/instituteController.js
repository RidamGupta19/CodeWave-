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

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (course) query.course = course;
    if (batch) query.batch = batch;
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

    student.fullName = fullName || student.fullName;
    student.phone = phone !== undefined ? phone : student.phone;
    student.address = address !== undefined ? address : student.address;
    student.course = course !== undefined ? (course || null) : student.course;
    student.batch = batch !== undefined ? (batch || null) : student.batch;
    student.status = status || student.status;
    student.profilePhoto = profilePhoto !== undefined ? profilePhoto : student.profilePhoto;

    await student.save();

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
    const batches = await Batch.find({})
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
    const { batchId, date, records } = req.body; // records: [{ studentId, status }]
    
    // Find teacher
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only instructors can log attendance.' });
    }
    const teacherId = teacher ? teacher._id : null;

    const formattedDate = new Date(date);
    formattedDate.setHours(0,0,0,0);

    const logs = [];
    for (const record of records) {
      const query = { studentId: record.studentId, batchId, date: formattedDate };
      const update = { 
        status: record.status,
        teacherId: teacherId || req.user._id // Fallback to admin id
      };
      
      const attendance = await Attendance.findOneAndUpdate(query, update, { upsert: true, new: true });
      logs.push(attendance);
    }

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { batchId, studentId, date } = req.query;
    let query = {};
    if (batchId) query.batchId = batchId;
    if (studentId) query.studentId = studentId;
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0,0,0,0);
      query.date = searchDate;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('studentId')
      .populate('batchId')
      .populate('teacherId');

    res.json({ success: true, data: attendanceRecords });
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
        query.batch = student.batch;
        query.course = student.course;
      }
    } else {
      if (courseId) query.course = courseId;
      if (batchId) query.batch = batchId;
    }

    const materials = await StudyMaterial.find(query)
      .populate('course')
      .populate('batch');

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
      uploadedBy: req.user._id
    });
    res.status(201).json({ success: true, data: material });
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

// ==========================================
// 9. CLASS SCHEDULER
// ==========================================
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

    res.json({ success: true, data: schedules });
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

    const today = new Date();
    today.setHours(0,0,0,0);
    const schedules = await Schedule.find({ teacher: teacher._id, date: today }).populate('batch').populate('course');

    const assignments = await Assignment.find({ uploadedBy: req.user._id });

    res.json({
      success: true,
      data: {
        teacher,
        batches,
        studentCount,
        todayClasses: schedules,
        assignmentsCount: assignments.length
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
    const attPercentage = totalAtt > 0 ? Math.round(((presentAtt + leaveAtt) / totalAtt) * 100) : 100;

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
