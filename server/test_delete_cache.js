const fs = require('fs');
const path = require('path');

const cacheDir = 'C:\\Users\\Asus\\OneDrive\\Desktop\\CodeWave\\server\\node_modules\\.cache\\mongodb-memory-server';

console.log('Checking cache dir:', cacheDir);
if (fs.existsSync(cacheDir)) {
  console.log('Deleting cache dir...');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('Deleted successfully!');
} else {
  console.log('Cache dir does not exist');
}
