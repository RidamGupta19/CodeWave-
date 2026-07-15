const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectWithTimeout = (uri) => mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codewave';

    if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGODB_URI) {
      console.log('Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('In-memory MongoDB started at', uri);
    }

    const conn = await connectWithTimeout(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Programmatically drop the old unique indexes to support new daily index updates
    try {
      await conn.connection.db.collection('attendances').dropIndex('studentId_1_batchId_1_date_1');
      console.log('Successfully dropped old unique index studentId_1_batchId_1_date_1');
    } catch (e) {
      // index might not exist or collection is not seeded yet, ignore safely
    }
    try {
      await conn.connection.db.collection('attendances').dropIndex('studentId_1_batchId_1_date_1_courseId_1');
      console.log('Successfully dropped old unique index studentId_1_batchId_1_date_1_courseId_1');
    } catch (e) {
      // ignore safely
    }
    try {
      await conn.connection.db.collection('attendances').dropIndex('studentId_1_date_1');
      console.log('Successfully dropped old unique index studentId_1_date_1');
    } catch (e) {
      // ignore safely
    }

    return { conn, isMemory: !!mongoServer };
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (!mongoServer) {
      console.log('Local MongoDB connection failed. Falling back to in-memory DB...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        const conn = await connectWithTimeout(uri);
        console.log(`In-memory MongoDB connected at ${uri}`);
        return { conn, isMemory: true };
      } catch (memErr) {
        console.error(`In-memory DB error: ${memErr.message}`);
        process.exit(1);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
