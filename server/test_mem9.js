const fs = require('fs');
const path = require('path');

const cacheDir = 'C:\\Users\\Asus\\OneDrive\\Desktop\\CodeWave\\server\\node_modules\\.cache\\mongodb-memory-server';

const checkDir = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    console.log(`Contents of ${dir}:`, files);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkDir(fullPath);
      } else {
        console.log(`  File: ${file}, Size: ${stat.size} bytes`);
      }
    }
  } else {
    console.log(`${dir} does not exist`);
  }
};

checkDir(cacheDir);
