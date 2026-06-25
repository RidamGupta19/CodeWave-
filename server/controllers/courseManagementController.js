const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// ==========================================
// 1. SUBJECT CONTROLLERS
// ==========================================

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ subjectName: 1 });
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, description } = req.body;
    if (!subjectName || !subjectCode) {
      return res.status(400).json({ success: false, message: 'Subject name and code are required' });
    }

    const existing = await Subject.findOne({ $or: [{ subjectName }, { subjectCode }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Subject name or code already exists' });
    }

    const subject = await Subject.create({ subjectName, subjectCode, description });
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, description } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

    if (subjectName) subject.subjectName = subjectName;
    if (subjectCode) subject.subjectCode = subjectCode;
    if (description !== undefined) subject.description = description;

    await subject.save();
    res.json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Pull references from Course model
    await Course.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    );

    // Pull references from Batch model
    await Batch.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    );

    await Subject.findByIdAndDelete(subjectId);
    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. COURSE CONTROLLERS
// ==========================================

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('subjects')
      .populate('batches')
      .populate('assignedTeacher')
      .sort({ courseName: 1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseName, description, duration, fees, assignedTeacher, subjects } = req.body;
    if (!courseName || !duration || fees === undefined) {
      return res.status(400).json({ success: false, message: 'Course name, duration, and fees are required' });
    }

    const existing = await Course.findOne({ courseName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Course with this name already exists' });
    }

    const course = await Course.create({
      courseName,
      description: description || '',
      duration,
      fees,
      assignedTeacher: assignedTeacher || null,
      subjects: subjects || []
    });

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseName, description, duration, fees, assignedTeacher, subjects } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (courseName) course.courseName = courseName;
    if (description !== undefined) course.description = description;
    if (duration) course.duration = duration;
    if (fees !== undefined) course.fees = fees;
    if (assignedTeacher !== undefined) course.assignedTeacher = assignedTeacher || null;
    if (subjects !== undefined) course.subjects = subjects;

    await course.save();
    
    const updated = await Course.findById(course._id)
      .populate('subjects')
      .populate('batches')
      .populate('assignedTeacher');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Remove course reference from batches
    await Batch.updateMany(
      { course: course._id },
      { $unset: { course: '' } }
    );

    // Remove course from student records
    await Student.updateMany(
      { course: course._id },
      { $unset: { course: '' } }
    );

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. BATCH CONTROLLERS
// ==========================================

exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find({})
      .populate('course')
      .populate('students')
      .populate('teachers')
      .populate('subjects')
      .populate('assignedTeacher')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const { batchName, startDate, endDate, timing, capacity, academicSession, status, course, teachers, subjects } = req.body;
    if (!batchName || !startDate || !timing || !course) {
      return res.status(400).json({ success: false, message: 'Batch name, start date, timing, and course are required' });
    }

    const existing = await Batch.findOne({ batchName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Batch name already exists' });
    }

    const batch = await Batch.create({
      batchName,
      startDate,
      endDate: endDate || null,
      timing,
      capacity: capacity || 30,
      academicSession: academicSession || '2026-2027',
      status: status || 'active',
      course,
      teachers: teachers || [],
      subjects: subjects || [],
      students: []
    });

    // Add batch reference to course
    await Course.findByIdAndUpdate(course, { $addToSet: { batches: batch._id } });

    // Link teachers to batch
    if (teachers && teachers.length > 0) {
      await Teacher.updateMany(
        { _id: { $in: teachers } },
        { $addToSet: { batches: batch._id } }
      );
    }

    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { batchName, startDate, endDate, timing, capacity, academicSession, status, course, teachers, subjects } = req.body;
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Enforce capacity check if capacity is being reduced below current student headcount
    if (capacity !== undefined && capacity < batch.students.length) {
      return res.status(400).json({ success: false, message: `Cannot reduce capacity to ${capacity}. There are currently ${batch.students.length} students assigned to this batch.` });
    }

    // Handle course change in Course model references
    if (course !== undefined && batch.course && batch.course.toString() !== course) {
      await Course.findByIdAndUpdate(batch.course, { $pull: { batches: batch._id } });
      if (course) {
        await Course.findByIdAndUpdate(course, { $addToSet: { batches: batch._id } });
      }
    } else if (course && !batch.course) {
      await Course.findByIdAndUpdate(course, { $addToSet: { batches: batch._id } });
    }

    // Handle teacher relationship syncs
    if (teachers !== undefined) {
      const oldTeachers = batch.teachers || [];
      const newTeachers = teachers || [];

      // Remove batch reference from teachers who were removed
      const removedTeachers = oldTeachers.filter(t => !newTeachers.includes(t.toString()));
      if (removedTeachers.length > 0) {
        await Teacher.updateMany(
          { _id: { $in: removedTeachers } },
          { $pull: { batches: batch._id } }
        );
      }

      // Add batch reference to new teachers
      if (newTeachers.length > 0) {
        await Teacher.updateMany(
          { _id: { $in: newTeachers } },
          { $addToSet: { batches: batch._id } }
        );
      }
      batch.teachers = newTeachers;
    }

    if (batchName) batch.batchName = batchName;
    if (startDate) batch.startDate = startDate;
    if (endDate !== undefined) batch.endDate = endDate;
    if (timing) batch.timing = timing;
    if (capacity !== undefined) batch.capacity = capacity;
    if (academicSession) batch.academicSession = academicSession;
    if (status) batch.status = status;
    if (course !== undefined) batch.course = course || null;
    if (subjects !== undefined) batch.subjects = subjects;

    await batch.save();

    const updated = await Batch.findById(batch._id)
      .populate('course')
      .populate('students')
      .populate('teachers')
      .populate('subjects');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Pull references from Course model
    if (batch.course) {
      await Course.findByIdAndUpdate(batch.course, { $pull: { batches: batch._id } });
    }

    // Pull references from Teacher model
    await Teacher.updateMany(
      { batches: batch._id },
      { $pull: { batches: batch._id } }
    );

    // Unlink student records
    await Student.updateMany(
      { batch: batch._id },
      { $unset: { batch: '' } }
    );

    await Batch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Allocate members (Students / Teachers / Subjects) to batch with capacity check
exports.assignBatchMembers = async (req, res) => {
  try {
    const { studentIds, teacherIds, subjectIds } = req.body;
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Enforce capacity check
    if (studentIds !== undefined) {
      if (studentIds.length > batch.capacity) {
        return res.status(400).json({
          success: false,
          message: `Cannot assign ${studentIds.length} students. Batch capacity limit is ${batch.capacity}.`
        });
      }

      // Sync student records: Set batch to null for students currently in this batch but not in the new list
      const oldStudentIds = batch.students.map(s => s.toString());
      const removedStudents = oldStudentIds.filter(id => !studentIds.includes(id));
      if (removedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: removedStudents } },
          { $unset: { batch: '' } }
        );
      }

      // Assign batch to the selected student records
      if (studentIds.length > 0) {
        await Student.updateMany(
          { _id: { $in: studentIds } },
          { $set: { batch: batch._id } }
        );
      }

      batch.students = studentIds;
    }

    // Sync teachers list
    if (teacherIds !== undefined) {
      const oldTeacherIds = batch.teachers.map(t => t.toString());
      
      const removedTeachers = oldTeacherIds.filter(id => !teacherIds.includes(id));
      if (removedTeachers.length > 0) {
        await Teacher.updateMany(
          { _id: { $in: removedTeachers } },
          { $pull: { batches: batch._id } }
        );
      }

      if (teacherIds.length > 0) {
        await Teacher.updateMany(
          { _id: { $in: teacherIds } },
          { $addToSet: { batches: batch._id } }
        );
      }

      batch.teachers = teacherIds;
      if (teacherIds.length > 0) {
        batch.assignedTeacher = teacherIds[0]; // fallback legacy field
      } else {
        batch.assignedTeacher = null;
      }
    }

    // Sync subjects list
    if (subjectIds !== undefined) {
      batch.subjects = subjectIds;
    }

    await batch.save();

    const updated = await Batch.findById(batch._id)
      .populate('course')
      .populate('students')
      .populate('teachers')
      .populate('subjects');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
