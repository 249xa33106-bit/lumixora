const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = getFiles(path.join(dir, file), fileList);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

const files = getFiles('src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/(\w+\??\.email\??\.toLowerCase\(\))\s*===\s*['"]admin@lumixora\.com['"]/g, 
    `$1 === 'admin@lumixora.com' || $1 === 'sowban@lumixora.com'`);
    
  newContent = newContent.replace(/(?<!\.)(email\??\.toLowerCase\(\))\s*===\s*['"]admin@lumixora\.com['"]/g, 
    `$1 === 'admin@lumixora.com' || $1 === 'sowban@lumixora.com'`);

  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated', f);
  }
});
