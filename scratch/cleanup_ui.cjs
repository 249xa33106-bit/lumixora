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

    // 1. Remove bg-clip-text text-transparent gradients
    content = content.replace(/bg-gradient-to-[a-z]+ from-[a-z0-9-/]+ (via-[a-z0-9-/]+ )?to-[a-z0-9-/]+ bg-clip-text text-transparent/g, 'text-gray-100');
    content = content.replace(/bg-gradient-to-[a-z]+ from-[a-z0-9-/]+ (via-[a-z0-9-/]+ )?to-[a-z0-9-/]+ text-transparent bg-clip-text/g, 'text-gray-100');
    
    // 2. Reduce font-black to font-bold or font-semibold for less aggressive look
    content = content.replace(/font-black/g, 'font-semibold');
    
    // 3. Remove excessive tracking (uppercase tracking-widest -> font-medium)
    content = content.replace(/uppercase tracking-widest/g, 'tracking-wide');
    content = content.replace(/uppercase tracking-wider/g, 'tracking-wide');

    // 4. Tone down glass-panel borders (already handled in CSS, but let's remove inline bright border-brand-* if any)
    content = content.replace(/border-brand-[a-z]+\/\d+/g, 'border-white/10');
    content = content.replace(/shadow-\[0_0_\d+px_rgba[^\]]+\]/g, 'shadow-sm');
    content = content.replace(/shadow-\[0_0_\d+px_[^\]]+\]/g, 'shadow-sm');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${changedCount} files.`);
