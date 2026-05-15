const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';
    
    // Check if we should use memory server
    if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGODB_URI) {
      console.log('🔄 Starting In-Memory MongoDB Server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('✅ In-Memory MongoDB Started at', uri);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    return { conn, isMemory: !!mongoServer };
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Fallback to memory server if local connection fails
    if (!mongoServer) {
      console.log('⚠️ Local MongoDB connection failed. Falling back to In-Memory DB...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`✅ In-Memory MongoDB Connected at ${uri}`);
        return { conn, isMemory: true };
      } catch (memErr) {
        console.error(`❌ In-Memory DB Error: ${memErr.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
