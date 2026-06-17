const fs = require('fs');
const file = 'C:\\Users\\Asus\\.cache\\mongodb-binaries\\mongod-x64-win32-8.2.6.exe';
console.log('Exists:', fs.existsSync(file));
if (fs.existsSync(file)) {
  const stat = fs.statSync(file);
  console.log('Size:', stat.size, 'bytes');
}
