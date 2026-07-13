const fs = require('fs');

const files = [
    'app/pdf-to-jpg/page.tsx',
    'app/rotate-pdf/page.tsx',
    'app/pdf-to-word/page.tsx',
    'app/unlock-pdf/page.tsx'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\s*\(pdfjsLib as any\)\.verbosity = 0;/g, '');
    fs.writeFileSync(file, content);
}
