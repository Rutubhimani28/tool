const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'pdf-to-word', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update handleConvert signature
content = content.replace(
    'const handleConvert = async () => {',
    'const handleConvert = async (mode: "editable" | "exact" = "editable") => {'
);

// 2. Add ImageIcon import
if (!content.includes('Image as ImageIcon')) {
    content = content.replace(
        'import { TextSnippet } from "@mui/icons-material";',
        'import { TextSnippet, Image as ImageIcon } from "@mui/icons-material";'
    );
}

// 3. Update the loop to handle exact mode
const loopStart = 'for (let i = 1; i <= numPages; i++) {';
const loopContent = `
                setProcessingStatus(\`Processing page \${i} of \${numPages}...\`);
                const page = await pdf.getPage(i);
                
                if (mode === 'exact') {
                    setProcessingStatus(\`Rendering page \${i} as image...\`);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        await page.render({
                            canvasContext: context,
                            viewport: viewport,
                            canvas: canvas,
                        }).promise;

                        const blob = await new Promise((resolve) =>
                            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
                        );

                        if (blob) {
                            const imgArrayBuffer = await blob.arrayBuffer();
                            const targetWidth = 600;
                            const targetHeight = (targetWidth * canvas.height) / canvas.width;

                            docChildren.push(
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: imgArrayBuffer,
                                            transformation: {
                                                width: targetWidth,
                                                height: targetHeight,
                                            },
                                            type: "jpg",
                                        }),
                                    ],
                                })
                            );
                        }
                    }
                } else {
`;

// Find the start of the loop and replace it
content = content.replace(
    /for \(let i = 1; i <= numPages; i\+\+\) \{[\s\S]*?const page = await pdf\.getPage\(i\);/,
    loopStart + loopContent
);

// Find the end of the loop and close the else block
content = content.replace(
    /setProgress\(30 \+ Math\.round\(\(i \/ numPages\) \* 50\)\);\s*\}/,
    '}\n                setProgress(30 + Math.round((i / numPages) * 50));\n            }'
);

// 4. Update Document creation for margins
content = content.replace(
    /const doc = new Document\(\{\s*sections: \[\s*\{\s*properties: \{[\s\S]*?\},/,
    `const doc = new Document({
                sections: [
                    {
                        properties: {
                            page: {
                                margin: {
                                    top: mode === 'exact' ? 720 : 1440,
                                    right: mode === 'exact' ? 720 : 1440,
                                    bottom: mode === 'exact' ? 720 : 1440,
                                    left: mode === 'exact' ? 720 : 1440,
                                },
                            },
                        },`
);

// 5. Update buttons in UI
const oldButtons = `<button
                                onClick={handleConvert}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-200"
                            >
                                <TextSnippet className="h-5 w-5" />
                                Convert to Word
                            </button>`;

const newButtons = `<div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => handleConvert('editable')}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-200"
                                >
                                    <TextSnippet className="h-5 w-5" />
                                    Convert to Editable Text
                                </button>
                                <button
                                    onClick={() => handleConvert('exact')}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all duration-200"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                    Convert to Exact Copy
                                </button>
                            </div>`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync(filePath, content);
console.log('Done');
