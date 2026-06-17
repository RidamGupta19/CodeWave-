const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
  console.log('Testing MONGODB_URI:', process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('SUCCESS! Connected to host:', conn.connection.host);
    process.exit(0);
  } catch (error) {
    console.error('FAILED to connect directly:', error.message);
    process.exit(1);
  }
};

testConnection();
