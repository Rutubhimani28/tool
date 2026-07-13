const fs = require('fs');

function replaceAutoDownload(filePath, replacement) {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = [^;]+;\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No match found in ${filePath}`);
    }
}

// 1. protect-pdf
replaceAutoDownload('app/protect-pdf/page.tsx', 'setResultUrl(url);\n            setResultFileName(`${file.name.replace(".pdf", "")}_protected.pdf`);\n            setFile(null);');

// 2. unlock-pdf
replaceAutoDownload('app/unlock-pdf/page.tsx', 'setResultUrl(url);\n            setResultFileName(`${file.name.replace(".pdf", "")}_unlocked.pdf`);\n            setFile(null);');

// 3. rotate-pdf
replaceAutoDownload('app/rotate-pdf/page.tsx', 'setResultUrl(url);\n            setResultFileName(`${file.name.replace(".pdf", "")}_rotated.pdf`);\n            setFile(null);');

// 4. split-pdf (range mode)
replaceAutoDownload('app/split-pdf/page.tsx', 'setResultUrl(url);\n                setResultFileName(`${file.name.replace(".pdf", "")}_extracted.pdf`);\n                setFile(null);');

// Wait, split-pdf has two blocks. The regex will replace both with the same replacement.
// Let's handle split-pdf separately.
let splitContent = fs.readFileSync('app/split-pdf/page.tsx', 'utf8');
const splitRegex1 = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = \`\$\{file\.name\.replace\("\.pdf", ""\)\}_extracted\.pdf\`;\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;
const splitRegex2 = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = \`\$\{file\.name\.replace\("\.pdf", ""\)\}_split_pages\.zip\`;\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;

splitContent = splitContent.replace(splitRegex1, 'setResultUrl(url);\n                setResultFileName(`${file.name.replace(".pdf", "")}_extracted.pdf`);\n                setFile(null);');
splitContent = splitContent.replace(splitRegex2, 'setResultUrl(url);\n                setResultFileName(`${file.name.replace(".pdf", "")}_split_pages.zip`);\n                setFile(null);');
fs.writeFileSync('app/split-pdf/page.tsx', splitContent);
console.log('Updated app/split-pdf/page.tsx');

// 5. word-to-pdf
let wordContent = fs.readFileSync('app/word-to-pdf/page.tsx', 'utf8');
const wordRegex = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = filename;\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;
wordContent = wordContent.replace(wordRegex, 'setResultUrl(url);\n                        setResultFileName(filename);\n                        setFile(null);');
fs.writeFileSync('app/word-to-pdf/page.tsx', wordContent);
console.log('Updated app/word-to-pdf/page.tsx');

// 6. pdf-to-jpg
let pdfToJpgContent = fs.readFileSync('app/pdf-to-jpg/page.tsx', 'utf8');
const pdfToJpgRegex = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = \`\$\{file\.name\.replace\("\.pdf", ""\)\}_images\.zip\`;\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;
pdfToJpgContent = pdfToJpgContent.replace(pdfToJpgRegex, 'setResultUrl(url);\n            setResultFileName(`${file.name.replace(".pdf", "")}_images.zip`);\n            setFile(null);');
fs.writeFileSync('app/pdf-to-jpg/page.tsx', pdfToJpgContent);
console.log('Updated app/pdf-to-jpg/page.tsx');

// 7. jpg-to-pdf
let jpgToPdfContent = fs.readFileSync('app/jpg-to-pdf/page.tsx', 'utf8');
const jpgToPdfRegex = /const link = document\.createElement\("a"\);\s*link\.href = url;\s*link\.download = "images_converted\.pdf";\s*document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g;
jpgToPdfContent = jpgToPdfContent.replace(jpgToPdfRegex, 'setResultUrl(url);\n            setResultFileName("images_converted.pdf");\n            setImages([]);');
fs.writeFileSync('app/jpg-to-pdf/page.tsx', jpgToPdfContent);
console.log('Updated app/jpg-to-pdf/page.tsx');
