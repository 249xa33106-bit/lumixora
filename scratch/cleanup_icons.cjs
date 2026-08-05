const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    const colors = ['teal', 'blue', 'pink', 'purple', 'orange'];
    
    colors.forEach(c => {
        // Replace full wrapper combinations
        let regex = new RegExp(`bg-brand-${c}\\/10.*?text-brand-${c}.*?border border-[^ ]+`, 'g');
        content = content.replace(regex, `icon-3d-${c}`);

        // Try simpler combinations
        let regex2 = new RegExp(`bg-brand-${c}\\/10 text-brand-${c}`, 'g');
        content = content.replace(regex2, `icon-3d-${c}`);
        
        let regex3 = new RegExp(`text-brand-${c} bg-brand-${c}\\/10`, 'g');
        content = content.replace(regex3, `icon-3d-${c}`);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${changedCount} files.`);
