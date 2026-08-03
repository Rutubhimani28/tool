import { PDFDocument } from "pdf-lib";

export interface RedactionBox {
    x: number;
    y: number;
    width: number;
    height: number;
    pageIndex: number;
}

export async function applyDestructiveRedactions(
    fileBuffer: ArrayBuffer,
    redactions: RedactionBox[],
    onProgress: (progress: number) => void
): Promise<Blob> {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;

    const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0), verbosity: 0 }).promise;
    const numPages = pdf.numPages;

    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
        }).promise;

        // Draw redactions for this page
        const pageRedactions = redactions.filter((r) => r.pageIndex === i - 1);
        context.fillStyle = "#000000";
        for (const redaction of pageRedactions) {
            // Scale the redaction coordinates to match the canvas scale
            context.fillRect(
                redaction.x * 2.0,
                redaction.y * 2.0,
                redaction.width * 2.0,
                redaction.height * 2.0
            );
        }

        // Convert canvas to image
        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const img = await newPdf.embedJpg(imgDataUrl);

        const newPage = newPdf.addPage([viewport.width, viewport.height]);
        newPage.drawImage(img, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        });

        onProgress(Math.round((i / numPages) * 100));
    }

    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes as any], { type: "application/pdf" });
}
