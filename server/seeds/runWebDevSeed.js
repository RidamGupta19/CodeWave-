const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
if (!process.env.MONGODB_URI) dotenv.config({ path: '.env' });

const mongoose = require('mongoose');
const seedWebDev = require('./webDevSeed');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codewave';
  await mongoose.connect(uri);
  await seedWebDev();
  process.exit(0);
}

run();
