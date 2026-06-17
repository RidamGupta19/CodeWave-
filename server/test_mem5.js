const fs = require('fs');
const file = 'C:\\Users\\Asus\\OneDrive\\Desktop\\CodeWave\\server\\node_modules\\.cache\\mongodb-memory-server\\mongod-x64-win32-8.2.6.exe';
if (fs.existsSync(file)) {
  const fd = fs.openSync(file, 'r');
  const buffer = Buffer.alloc(4);
  fs.readSync(fd, buffer, 0, 4, 0);
  console.log('Magic bytes (Hex):', buffer.toString('hex'));
  console.log('Magic bytes (ASCII):', buffer.toString('ascii'));
  fs.closeSync(fd);
} else {
  console.log('File does not exist');
}
