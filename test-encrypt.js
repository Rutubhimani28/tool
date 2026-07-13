const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');

async function test() {
    try {
        const { PDFDocument } = require('pdf-lib');
        const pdfDoc = await PDFDocument.create();
        pdfDoc.addPage();
        const pdfBytes = await pdfDoc.save();
        
        const encryptedBytes = await encryptPDF(
            new Uint8Array(pdfBytes),
            'password',
            {
                allowPrinting: true,
                allowCopying: true,
                allowModifying: true,
            }
        );
        console.log('Success!', encryptedBytes.length);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
