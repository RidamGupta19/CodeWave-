const os = require('os');
console.log('OS platform:', os.platform());
console.log('OS arch:', os.arch());
console.log('OS release:', os.release());
console.log('Node version:', process.version);
console.log('Node arch:', process.arch);
console.log('CPUs:', os.cpus().map(c => c.model));
