const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.copyFileSync(path.join(srcDir, 'server.js'), path.join(distDir, 'server.js'));
console.log('Build complete: dist/server.js created');
