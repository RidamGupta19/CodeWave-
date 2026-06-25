const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
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
    const { search, course, batch, status, page = 1, limit = 10 } = req.query;
    const query = {};

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

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('course')
      .populate('batch')
      .skip(skipIndex)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
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

    const user = await provisionUser(fullName, email, 'student');

    const student = await Student.create({
      userId: user._id,
      rollNumber,
      fullName,
      email,
      phone: phone || '',
      address: address || '',
      course: course || null,
      batch: batch || null,
      admissionDate: admissionDate || Date.now(),
      status: status || 'active',
      profilePhoto: profilePhoto || ''
    });

    if (batch) {
      await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
    }

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
    const { fullName, email, phone, address, course, batch, status, profilePhoto, rollNumber } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Handle batch changes in Batch model
    if (batch !== undefined && student.batch && student.batch.toString() !== batch) {
      await Batch.findByIdAndUpdate(student.batch, { $pull: { students: student._id } });
      if (batch) {
        await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
      }
    } else if (batch && !student.batch) {
      await Batch.findByIdAndUpdate(batch, { $addToSet: { students: student._id } });
    }

    // Fee record adjustment if course changes and fee records do not exist
    if (course !== undefined && student.course && student.course.toString() !== course) {
      const feeExists = await Fee.findOne({ student: student._id, course });
      if (!feeExists && course) {
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
    }

    student.fullName = fullName || student.fullName;
    student.rollNumber = rollNumber || student.rollNumber;
    student.phone = phone !== undefined ? phone : student.phone;
    student.address = address !== undefined ? address : student.address;
    student.course = course !== undefined ? (course || null) : student.course;
    student.batch = batch !== undefined ? (batch || null) : student.batch;
    student.status = status || student.status;
    student.profilePhoto = profilePhoto !== undefined ? profilePhoto : student.profilePhoto;

    await student.save();

    // Sync user details
    await User.findByIdAndUpdate(student.userId, { 
      fullName: student.fullName,
      status: student.status
    });

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (student.batch) {
      await Batch.findByIdAndUpdate(student.batch, { $pull: { students: student._id } });
    }

    await User.findByIdAndDelete(student.userId);
    await Fee.deleteMany({ student: student._id });
    await Attendance.deleteMany({ studentId: student._id });
    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleStudentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' | 'suspended'
    if (!['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.status = status;
    await student.save();

    // Sync status back to corresponding User account
    await User.findByIdAndUpdate(student.userId, { status });

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetStudentPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const user = await User.findById(student.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Associated User account not found' });

    user.password = password;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// JSON payload import of student records
exports.importStudents = async (req, res) => {
  try {
    const { students } = req.body; // Array of student objects
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a non-empty array of students to import' });
    }

    const results = {
      successCount: 0,
      errors: []
    };

    for (const data of students) {
      try {
        const { rollNumber, fullName, email, phone, address, courseName, batchName } = data;

        if (!rollNumber || !fullName || !email) {
          results.errors.push({ email: email || 'unknown', message: 'Missing required fields (rollNumber, fullName, or email)' });
          continue;
        }

        const existing = await Student.findOne({ $or: [{ rollNumber }, { email }] });
        if (existing) {
          results.errors.push({ email, message: `Student with Roll Number ${rollNumber} or Email ${email} already exists` });
          continue;
        }

        // Search Course & Batch by name
        let courseId = null;
        let batchId = null;

        if (courseName) {
          const courseObj = await Course.findOne({ courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } });
          if (courseObj) courseId = courseObj._id;
        }

        if (batchName) {
          const batchObj = await Batch.findOne({ batchName: { $regex: new RegExp(`^${batchName}$`, 'i') } });
          if (batchObj) batchId = batchObj._id;
        }

        const user = await provisionUser(fullName, email, 'student');
        const student = await Student.create({
          userId: user._id,
          rollNumber,
          fullName,
          email,
          phone: phone || '',
          address: address || '',
          course: courseId,
          batch: batchId,
          status: 'active'
        });

        if (batchId) {
          await Batch.findByIdAndUpdate(batchId, { $addToSet: { students: student._id } });
        }

        if (courseId) {
          const courseObj = await Course.findById(courseId);
          if (courseObj) {
            await Fee.create({
              student: student._id,
              course: courseObj._id,
              totalFees: courseObj.fees,
              remainingAmount: courseObj.fees
            });
          }
        }

        results.successCount++;
      } catch (err) {
        results.errors.push({ email: data.email || 'unknown', message: err.message });
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. TEACHER MANAGEMENT
// ==========================================

exports.getTeachers = async (req, res) => {
  try {
    const { search, subject, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (subject) {
      query.$or = [
        { subject: { $regex: subject, $options: 'i' } },
        { subjects: { $in: [subject] } }
      ];
    }
    if (status) query.status = status;

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .populate('batches')
      .skip(skipIndex)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: teachers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, subjects, qualification, experience, salary, joiningDate, status, batches } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher with this email already exists.' });
    }

    const user = await provisionUser(name, email, 'teacher');

    const teacher = await Teacher.create({
      userId: user._id,
      name,
      email,
      phone: phone || '',
      subject: subject || (subjects && subjects[0]) || '',
      subjects: subjects || [],
      batches: batches || [],
      qualification: qualification || '',
      experience: experience || '',
      salary: salary || 0,
      joiningDate: joiningDate || Date.now(),
      status: status || 'active'
    });

    // Assign teacher inside Batch models if batches are specified
    if (batches && batches.length > 0) {
      await Batch.updateMany(
        { _id: { $in: batches } },
        { $set: { assignedTeacher: teacher._id } }
      );
    }

    res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, phone, subject, subjects, qualification, experience, salary, status } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    teacher.name = name || teacher.name;
    teacher.phone = phone !== undefined ? phone : teacher.phone;
    teacher.subject = subject || teacher.subject;
    teacher.subjects = subjects !== undefined ? subjects : teacher.subjects;
    teacher.qualification = qualification !== undefined ? qualification : teacher.qualification;
    teacher.experience = experience !== undefined ? experience : teacher.experience;
    teacher.salary = salary !== undefined ? salary : teacher.salary;
    teacher.status = status || teacher.status;

    await teacher.save();

    // Sync user details
    await User.findByIdAndUpdate(teacher.userId, { 
      fullName: teacher.name,
      status: teacher.status
    });

    res.json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    await Course.updateMany({ assignedTeacher: teacher._id }, { $unset: { assignedTeacher: '' } });
    await Batch.updateMany({ assignedTeacher: teacher._id }, { $unset: { assignedTeacher: '' } });

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignTeacherBatchesAndSubjects = async (req, res) => {
  try {
    const { subjects, batches } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    // Handle batch assignment updates
    const oldBatches = teacher.batches || [];
    const newBatches = batches || [];

    // Unassign old batches that are not in the new list
    const unassignBatches = oldBatches.filter(b => !newBatches.includes(b.toString()));
    if (unassignBatches.length > 0) {
      await Batch.updateMany(
        { _id: { $in: unassignBatches }, assignedTeacher: teacher._id },
        { $unset: { assignedTeacher: '' } }
      );
    }

    // Assign new batches
    if (newBatches.length > 0) {
      await Batch.updateMany(
        { _id: { $in: newBatches } },
        { $set: { assignedTeacher: teacher._id } }
      );
    }

    teacher.subjects = subjects !== undefined ? subjects : teacher.subjects;
    teacher.batches = newBatches;
    if (subjects && subjects.length > 0) {
      teacher.subject = subjects[0]; // legacy fallback
    }

    await teacher.save();
    res.json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleTeacherStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' | 'inactive'
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    teacher.status = status;
    await teacher.save();

    // Sync status to User status
    await User.findByIdAndUpdate(teacher.userId, { status: status === 'active' ? 'active' : 'inactive' });

    res.json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. ADMIN & SUB-ADMIN MANAGEMENT
// ==========================================

exports.getSubAdmins = async (req, res) => {
  try {
    // Sub-admins are users with role admin but isSuperAdmin false
    const subAdmins = await User.find({ role: 'admin', isSuperAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: subAdmins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSubAdmin = async (req, res) => {
  try {
    const { fullName, email, password, permissions, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const subAdmin = await User.create({
      fullName,
      email,
      password,
      role: 'admin',
      isSuperAdmin: false,
      permissions: permissions || [],
      phone: phone || '',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: subAdmin._id,
        fullName: subAdmin.fullName,
        email: subAdmin.email,
        role: subAdmin.role,
        isSuperAdmin: subAdmin.isSuperAdmin,
        permissions: subAdmin.permissions,
        phone: subAdmin.phone,
        status: subAdmin.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSubAdmin = async (req, res) => {
  try {
    const { fullName, permissions, status, phone, password } = req.body;
    const subAdmin = await User.findById(req.params.id);
    if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-Admin not found' });

    if (subAdmin.isSuperAdmin) {
      return res.status(400).json({ success: false, message: 'Cannot modify Super-Admin settings' });
    }

    subAdmin.fullName = fullName || subAdmin.fullName;
    subAdmin.permissions = permissions !== undefined ? permissions : subAdmin.permissions;
    subAdmin.status = status || subAdmin.status;
    subAdmin.phone = phone !== undefined ? phone : subAdmin.phone;

    if (password && password.length >= 6) {
      subAdmin.password = password;
    }

    await subAdmin.save();

    res.json({
      success: true,
      data: {
        _id: subAdmin._id,
        fullName: subAdmin.fullName,
        email: subAdmin.email,
        role: subAdmin.role,
        isSuperAdmin: subAdmin.isSuperAdmin,
        permissions: subAdmin.permissions,
        phone: subAdmin.phone,
        status: subAdmin.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await User.findById(req.params.id);
    if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-Admin not found' });

    if (subAdmin.isSuperAdmin) {
      return res.status(400).json({ success: false, message: 'Cannot delete Super-Admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Sub-Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. BULK & EXPORT ACTIONS
// ==========================================

exports.bulkAction = async (req, res) => {
  try {
    const { action, ids, targetRole, newStatus, resetPasswordValue } = req.body;
    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing action or user IDs' });
    }

    if (action === 'delete') {
      if (targetRole === 'student') {
        const studentsList = await Student.find({ _id: { $in: ids } });
        const userIds = studentsList.map(s => s.userId);
        
        await Batch.updateMany({}, { $pull: { students: { $in: ids } } });
        await Fee.deleteMany({ student: { $in: ids } });
        await Attendance.deleteMany({ studentId: { $in: ids } });
        await Student.deleteMany({ _id: { $in: ids } });
        await User.deleteMany({ _id: { $in: userIds } });
      } else if (targetRole === 'teacher') {
        const teachersList = await Teacher.find({ _id: { $in: ids } });
        const userIds = teachersList.map(t => t.userId);
        
        await Course.updateMany({ assignedTeacher: { $in: ids } }, { $unset: { assignedTeacher: '' } });
        await Batch.updateMany({ assignedTeacher: { $in: ids } }, { $unset: { assignedTeacher: '' } });
        await Teacher.deleteMany({ _id: { $in: ids } });
        await User.deleteMany({ _id: { $in: userIds } });
      } else {
        const adminsList = await User.find({ _id: { $in: ids }, isSuperAdmin: true });
        if (adminsList.length > 0) {
          return res.status(400).json({ success: false, message: 'Cannot delete Super-Admin user' });
        }
        await User.deleteMany({ _id: { $in: ids } });
      }
      return res.json({ success: true, message: 'Bulk delete operation completed successfully' });
    }

    if (action === 'status') {
      if (!newStatus) {
        return res.status(400).json({ success: false, message: 'Missing status value' });
      }

      if (targetRole === 'student') {
        const studentsList = await Student.find({ _id: { $in: ids } });
        const userIds = studentsList.map(s => s.userId);
        
        await Student.updateMany({ _id: { $in: ids } }, { $set: { status: newStatus } });
        await User.updateMany({ _id: { $in: userIds } }, { $set: { status: newStatus } });
      } else if (targetRole === 'teacher') {
        const teachersList = await Teacher.find({ _id: { $in: ids } });
        const userIds = teachersList.map(t => t.userId);
        
        await Teacher.updateMany({ _id: { $in: ids } }, { $set: { status: newStatus === 'active' ? 'active' : 'inactive' } });
        await User.updateMany({ _id: { $in: userIds } }, { $set: { status: newStatus === 'active' ? 'active' : 'inactive' } });
      } else {
        const adminsList = await User.find({ _id: { $in: ids }, isSuperAdmin: true });
        if (adminsList.length > 0) {
          return res.status(400).json({ success: false, message: 'Cannot deactivate Super-Admin user' });
        }
        await User.updateMany({ _id: { $in: ids } }, { $set: { status: newStatus } });
      }
      return res.json({ success: true, message: 'Bulk status update completed successfully' });
    }

    if (action === 'reset-password') {
      if (!resetPasswordValue || resetPasswordValue.length < 6) {
        return res.status(400).json({ success: false, message: 'Reset password must be at least 6 characters' });
      }

      let userIdsToReset = [];
      if (targetRole === 'student') {
        const studentsList = await Student.find({ _id: { $in: ids } });
        userIdsToReset = studentsList.map(s => s.userId);
      } else if (targetRole === 'teacher') {
        const teachersList = await Teacher.find({ _id: { $in: ids } });
        userIdsToReset = teachersList.map(t => t.userId);
      } else {
        userIdsToReset = ids;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(resetPasswordValue, salt);
      
      await User.updateMany(
        { _id: { $in: userIdsToReset } },
        { $set: { password: hashedPassword } }
      );

      return res.json({ success: true, message: 'Bulk password reset completed successfully' });
    }

    res.status(400).json({ success: false, message: 'Unknown bulk action type' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { role } = req.query;
    if (role === 'student') {
      const students = await Student.find({})
        .populate('course', 'courseName')
        .populate('batch', 'batchName')
        .sort({ rollNumber: 1 });
      return res.json({ success: true, data: students });
    } else if (role === 'teacher') {
      const teachers = await Teacher.find({})
        .populate('batches', 'batchName')
        .sort({ name: 1 });
      return res.json({ success: true, data: teachers });
    } else {
      const subAdmins = await User.find({ role: 'admin', isSuperAdmin: false })
        .select('-password')
        .sort({ fullName: 1 });
      return res.json({ success: true, data: subAdmins });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
