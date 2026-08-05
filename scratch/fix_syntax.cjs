const fs = require('fs');

const files = [
    'src/components/FounderFrequentUsers.jsx',
    'src/components/FounderSubmissionsManager.jsx',
    'src/components/NetworkProfile.jsx',
    'src/pages/CodingPractice.jsx',
    'src/pages/FounderPortal.jsx',
    'src/pages/TestPortal.jsx'
];

let fixed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix icon-3d-[color] followed by lots of spaces and a '<' or '{' without a closing quote
    content = content.replace(/icon-3d-([a-z]+)\s+([<{])/g, 'icon-3d-$1 flex items-center justify-center">\n$2');
    
    // Some might have been caught by the above if they were already correct?
    // No, if they were correct they would have a quote `"` before the spaces/newline.
    // e.g. `icon-3d-teal">\n  <svg` vs `icon-3d-teal      <svg`
    // The regex `icon-3d-([a-z]+)\s+([<{])` explicitly looks for spaces immediately following the class name without a quote.
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        fixed++;
        console.log(`Fixed ${file}`);
    }
});

console.log(`Fixed ${fixed} files.`);
