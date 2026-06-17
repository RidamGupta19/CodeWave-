const { spawn } = require('child_process');
const file = 'C:\\Users\\Asus\\OneDrive\\Desktop\\CodeWave\\server\\node_modules\\.cache\\mongodb-memory-server\\mongod-x64-win32-8.2.6.exe';

console.log('Spawning:', file);
const child = spawn(file, ['--version']);

child.on('error', (err) => {
  console.error('Spawn error:', err);
});

child.stdout.on('data', (data) => {
  console.log('stdout:', data.toString());
});

child.stderr.on('data', (data) => {
  console.log('stderr:', data.toString());
});

child.on('close', (code) => {
  console.log('Process exited with code:', code);
});
