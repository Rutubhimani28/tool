const fs = require('fs');
let content = fs.readFileSync('app/merge-pdf/page.tsx', 'utf8');
content = content.replace(
`    const handleFilesSelected = async (selectedFiles: File[]) => {
        const newFiles: UploadedFile[] = [];
        const originalWarn = console.warn; console.warn = () => {}; try { for (const file of selectedFiles) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const pagesCount = pdfDoc.getPageCount();
                newFiles.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    pagesCount,
                });
            } catch (error) {
                console.error("Error reading PDF file:", error);
                toast.error(\`Error reading \${file.name}. It might be password-protected or corrupted.\`);
            }
        }
        } finally { console.warn = originalWarn; } setFiles((prev) => [...prev, ...newFiles]);
    };`,
`    const handleFilesSelected = async (selectedFiles: File[]) => {
        const newFiles: UploadedFile[] = [];
        const originalWarn = console.warn;
        console.warn = () => {};
        try {
            for (const file of selectedFiles) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    if (pdfDoc.isEncrypted) {
                        toast.error(\`This PDF (\${file.name}) is password-protected. Please unlock it first.\`);
                        continue;
                    }
                    const pagesCount = pdfDoc.getPageCount();
                    newFiles.push({
                        id: Math.random().toString(36).substring(7),
                        file,
                        pagesCount,
                    });
                } catch (error) {
                    console.error("Error reading PDF file:", error);
                    toast.error(\`Error reading \${file.name}. It might be corrupted.\`);
                }
            }
        } finally {
            console.warn = originalWarn;
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };`
);
fs.writeFileSync('app/merge-pdf/page.tsx', content);
