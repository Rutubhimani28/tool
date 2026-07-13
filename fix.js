const fs = require('fs');
let content = fs.readFileSync('app/split-pdf/page.tsx', 'utf8');
content = content.replace('setResultFileName(`${file.name.replace(".pdf", "")}_extracted.pdf`);', 'setResultFileName(file.name);');
content = content.replace('setResultFileName(`${file.name.replace(".pdf", "")}_extracted.zip`);', 'setResultFileName(`${file.name.replace(".pdf", "")}.zip`);');
fs.writeFileSync('app/split-pdf/page.tsx', content);
