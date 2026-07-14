const fs = require('fs');

function applyWarningSuppression(filePath, functionName, tryBlockStartStr, finallyBlockEndStr) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already applied
    if (content.includes('const originalWarn = console.warn;')) {
        console.log(`Already applied to ${filePath}`);
        return;
    }

    // Find the function definition
    const funcRegex = new RegExp(`const ${functionName} = async \\([^)]*\\) => {`);
    const match = content.match(funcRegex);
    if (!match) {
        console.log(`Function ${functionName} not found in ${filePath}`);
        return;
    }

    // Find the try block
    const tryIndex = content.indexOf('try {', match.index);
    if (tryIndex === -1) {
        console.log(`try block not found in ${functionName} in ${filePath}`);
        return;
    }

    // Insert originalWarn before try {
    content = content.slice(0, tryIndex) + 'const originalWarn = console.warn;\n        console.warn = () => {};\n\n        ' + content.slice(tryIndex);

    // Find the finally block
    const finallyIndex = content.indexOf('finally {', tryIndex);
    if (finallyIndex !== -1) {
        const finallyBodyIndex = finallyIndex + 'finally {'.length;
        content = content.slice(0, finallyBodyIndex) + '\n            console.warn = originalWarn;' + content.slice(finallyBodyIndex);
    } else {
        console.log(`finally block not found in ${functionName} in ${filePath}`);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Successfully applied to ${filePath}`);
}

applyWarningSuppression('app/pdf-to-jpg/page.tsx', 'convertToJPG');
applyWarningSuppression('app/pdf-to-word/page.tsx', 'handleConvert');
applyWarningSuppression('app/rotate-pdf/page.tsx', 'handleFileSelected');
