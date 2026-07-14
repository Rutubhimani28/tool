const fs = require('fs');

function addVerbosity(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace { data: arrayBuffer } with { data: arrayBuffer, verbosity: 0 }
    content = content.replace(/pdfjsLib\.getDocument\(\{ data: arrayBuffer \}\)/g, 'pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 })');
    
    // Replace { data: arrayBuffer, password } with { data: arrayBuffer, password, verbosity: 0 }
    content = content.replace(/pdfjsLib\.getDocument\(\{ data: arrayBuffer, password \}\)/g, 'pdfjsLib.getDocument({ data: arrayBuffer, password, verbosity: 0 })');

    fs.writeFileSync(filePath, content);
    console.log(`Successfully applied verbosity to ${filePath}`);
}

addVerbosity('app/pdf-to-jpg/page.tsx');
addVerbosity('app/pdf-to-word/page.tsx');
addVerbosity('app/rotate-pdf/page.tsx');
addVerbosity('app/unlock-pdf/page.tsx');
