const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx') && !filePath.endsWith('.html')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\.jpg/g, '.webp').replace(/\.png/g, '.webp');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir(path.join(__dirname, 'src'), replaceInFile);
replaceInFile(path.join(__dirname, 'index.html'));
console.log('Replacement complete.');
