const fs = require('fs');
let content = fs.readFileSync('app/word-to-pdf/page.tsx', 'utf8');

content = content.replace(
    "jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }",
    "jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },\n                                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }"
);

fs.writeFileSync('app/word-to-pdf/page.tsx', content);
