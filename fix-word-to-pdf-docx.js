const fs = require('fs');
let content = fs.readFileSync('app/word-to-pdf/page.tsx', 'utf8');

// Replace mammoth import
content = content.replace(
    'import mammoth from "mammoth";',
    'import { renderAsync } from "docx-preview";'
);

// Replace conversion logic
const oldLogic = `            // Convert docx to HTML using mammoth
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const htmlContent = result.value;
            setProgress(60);

            const tempContainer = document.createElement("div");
            tempContainer.innerHTML = htmlContent;

            // Apply basic styling to headings and paragraphs
            const headings = tempContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");
            headings.forEach((h) => {
                (h as HTMLElement).style.marginTop = "20px";
                (h as HTMLElement).style.marginBottom = "10px";
                (h as HTMLElement).style.fontWeight = "bold";
            });

            const paragraphs = tempContainer.querySelectorAll("p");
            paragraphs.forEach((p) => {
                (p as HTMLElement).style.marginBottom = "12px";
            });

            // Split content into chunks of 30 elements to avoid canvas size limits on large files
            const chunks: string[] = [];
            let currentChunk = document.createElement("div");
            currentChunk.style.padding = "40px";
            currentChunk.style.fontFamily = "Arial, sans-serif";
            currentChunk.style.lineHeight = "1.6";
            currentChunk.style.color = "#333";
            currentChunk.style.backgroundColor = "#fff";
            currentChunk.style.width = "800px";

            Array.from(tempContainer.children).forEach((child, index) => {
                currentChunk.appendChild(child.cloneNode(true));
                if ((index + 1) % 30 === 0 || index === tempContainer.children.length - 1) {
                    chunks.push(currentChunk.outerHTML);
                    currentChunk = document.createElement("div");
                    currentChunk.style.padding = "40px";
                    currentChunk.style.fontFamily = "Arial, sans-serif";
                    currentChunk.style.lineHeight = "1.6";
                    currentChunk.style.color = "#333";
                    currentChunk.style.backgroundColor = "#fff";
                    currentChunk.style.width = "800px";
                }
            });`;

const newLogic = `            // Render docx using docx-preview
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
            }`;

content = content.replace(oldLogic, newLogic);

// Remove hardcoded CSS from iframe
const oldCss = `                            body { padding: 0; margin: 0; background-color: #fff; }
                            div { box-sizing: border-box; }
                            h1, h2, h3, h4, h5, h6 { margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
                            p { margin-bottom: 12px; }
                            img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
                            table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
                            td, th { border: 1px solid #ddd; padding: 6px 10px; }`;

const newCss = `                            body { padding: 0; margin: 0; background-color: #fff; }
                            div { box-sizing: border-box; }`;

content = content.replace(oldCss, newCss);

fs.writeFileSync('app/word-to-pdf/page.tsx', content);
