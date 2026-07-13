const fs = require('fs');
let content = fs.readFileSync('app/word-to-pdf/page.tsx', 'utf8');

// Remove mammoth import
content = content.replace(/import mammoth from "mammoth";\r?\n/, '');

// Replace conversion logic
content = content.replace(
    /\/\/ Convert docx to HTML using mammoth[\s\S]*?chunks\.push\(currentChunk\.outerHTML\);\r?\n\s*\}\r?\n\s*\}\);\r?\n/,
    `            // Render docx using docx-preview
            const { renderAsync } = await import("docx-preview");
            const tempContainer = document.createElement("div");
            await renderAsync(arrayBuffer, tempContainer, null, {
                className: "docx",
                inWrapper: false,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: true,
                ignoreLastRenderedPageBreak: true,
                experimental: false,
                trimXmlDeclaration: true,
                useBase64URL: true,
                useMathMLPolyfill: false,
                showChanges: false,
                debug: false,
            });
            setProgress(60);

            // Extract pages rendered by docx-preview
            const chunks: string[] = [];
            const pages = tempContainer.querySelectorAll("section.docx");
            if (pages.length > 0) {
                pages.forEach((page) => {
                    chunks.push(page.outerHTML);
                });
            } else {
                chunks.push(tempContainer.innerHTML);
            }
`
);

// Remove hardcoded CSS from iframe
content = content.replace(
    /body \{ padding: 0; margin: 0; background-color: #fff; \}\r?\n\s*div \{ box-sizing: border-box; \}\r?\n\s*h1, h2, h3, h4, h5, h6 \{ margin-top: 20px; margin-bottom: 10px; font-weight: bold; \}\r?\n\s*p \{ margin-bottom: 12px; \}\r?\n\s*img \{ max-width: 100%; height: auto; display: block; margin: 10px 0; \}\r?\n\s*table \{ border-collapse: collapse; width: 100%; margin-bottom: 12px; \}\r?\n\s*td, th \{ border: 1px solid #ddd; padding: 6px 10px; \}/,
    `body { padding: 0; margin: 0; background-color: #fff; }\n                            div { box-sizing: border-box; }`
);

// Fix options
content = content.replace(
    /jsPDF: \{ unit: 'mm', format: 'a4', orientation: 'portrait' \}/,
    "jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },\n                                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }"
);

fs.writeFileSync('app/word-to-pdf/page.tsx', content);
