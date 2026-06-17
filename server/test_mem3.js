const { MongoBinary } = require('mongodb-memory-server-core/lib/util/MongoBinary');
async function test() {
  try {
    const path = await MongoBinary.getPath();
    console.log('Binary path:', path);
  } catch (err) {
    console.error('Error getting binary path:', err);
  }
}
test();
