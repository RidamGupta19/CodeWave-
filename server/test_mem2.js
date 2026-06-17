const { MongoMemoryServer } = require('mongodb-memory-server');

async function test() {
  console.log('Starting memory server test...');
  try {
    // Enable debugging inside the library if possible
    process.env.MONGOMS_DEBUG = '1';
    
    const mongoServer = await MongoMemoryServer.create();
    console.log('SUCCESS! In-memory MongoDB started at:', mongoServer.getUri());
    await mongoServer.stop();
  } catch (err) {
    console.error('ERROR during MongoMemoryServer.create():');
    console.error(err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
}

test();
