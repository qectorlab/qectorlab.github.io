const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
};

const srcDir = 'c:\\Users\\Clinque du Batiment\\Desktop\\qectorlab.github.io-main\\src\\components';
const files = walk(srcDir);

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('--')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('--')) {
        // Skip ui folder if we want to focus on our own components
        if (!file.includes('ui' + path.sep)) {
          console.log(`${path.basename(file)}:${idx + 1}: ${line.trim()}`);
        }
      }
    });
  }
});
