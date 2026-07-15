const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Batch = require('./models/Batch');
const Attendance = require('./models/Attendance');
const { markAttendance } = require('./controllers/instituteController');
const seedDB = require('./seeds/seedAll');

async function run() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected.');

    // Seed if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database empty, running seed...');
      await seedDB();
      console.log('🌱 Seed complete.');
    }

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found!');
      process.exit(1);
    }
    console.log(`Admin User: ${adminUser.email} (_id: ${adminUser._id})`);

    // Find student
    const student = await Student.findOne();
    if (!student) {
      console.error('No student found!');
      process.exit(1);
    }
    console.log(`Student: ${student.fullName} (_id: ${student._id}, course: ${student.course}, batch: ${student.batch})`);

    if (!student.batch) {
      console.error('Student has no batch!');
      process.exit(1);
    }

    // Mock Express req and res
    const req = {
      user: adminUser,
      body: {
        batchId: student.batch.toString(),
        date: new Date().toISOString().substring(0, 10),
        records: [
          {
            studentId: student._id.toString(),
            status: 'Present'
          }
        ]
      },
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'NodeTest'
      }
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        console.log(`Response (Status ${this.statusCode}):`, JSON.stringify(data, null, 2));
      }
    };

    console.log('Invoking markAttendance...');
    await markAttendance(req, res);

    console.log('Check if document was saved to DB...');
    const doc = await Attendance.findOne({ studentId: student._id }).populate('teacherId');
    console.log('Found attendance doc:', doc);

    process.exit(0);
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

run();
