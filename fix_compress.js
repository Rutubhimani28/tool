const fs = require('fs');
let content = fs.readFileSync('app/compress-pdf/page.tsx', 'utf8');
content = content.replace(
`    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedSize(0);
    };`,
`    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first.");
                return;
            }
        } catch (error) {
            console.error("Error checking PDF encryption:", error);
        }
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedSize(0);
    };`
);
fs.writeFileSync('app/compress-pdf/page.tsx', content);
