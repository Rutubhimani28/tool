"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import confetti from "canvas-confetti";
import { TextSnippet, Image as ImageIcon } from "@mui/icons-material";
import Tesseract from "tesseract.js";

export default function PDFToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState("");
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
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
    };

    const handleConvert = async (mode: "editable" | "exact" = "editable") => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);
        setProcessingStatus("Loading PDF...");

        const originalWarn = console.warn;
        console.warn = () => {};

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(20);

            // Load PDF document
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            setProgress(30);


            const docChildren: any[] = [];

            for (let i = 1; i <= numPages; i++) {
                setProcessingStatus(`Processing page ${i} of ${numPages}...`);
                const page = await pdf.getPage(i);

                if (mode === 'exact') {
                    setProcessingStatus(`Rendering page ${i} as image...`);
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

                        const blob = await new Promise<Blob | null>((resolve) =>
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

                    let hasContentOnPage = false;

                    // --- 1. Extract text ---
                    const textContent = await page.getTextContent();
                    interface TextItem { str: string; transform: number[] }
                    const items = textContent.items as TextItem[];
                    const lines: { [key: number]: string[] } = {};

                    items.forEach((item) => {
                        if (!item.str.trim()) return;
                        // Group text by Y coordinate (rounded to nearest 5 to handle slight misalignments)
                        const y = Math.round(item.transform[5] / 5) * 5;
                        if (!lines[y]) {
                            lines[y] = [];
                        }
                        lines[y].push(item.str);
                    });

                    const sortedY = Object.keys(lines)
                        .map(Number)
                        .sort((a, b) => b - a); // Sort top to bottom

                    // Add text content
                    sortedY.forEach((y) => {
                        const lineText = lines[y].join(" ").trim();
                        if (lineText) {
                            hasContentOnPage = true;
                            docChildren.push(
                                new Paragraph({
                                    children: [new TextRun({ text: lineText, size: 24 })], // size 24 = 12pt
                                    spacing: { after: 120 }, // Add some spacing between lines
                                })
                            );
                        }
                    });

                    // --- 2. Extract Images ---
                    try {
                        const operatorList = await page.getOperatorList();
                        for (let j = 0; j < operatorList.fnArray.length; j++) {
                            if (
                                operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject ||
                                operatorList.fnArray[j] === pdfjsLib.OPS.paintInlineImageXObject
                            ) {
                                const objId = operatorList.argsArray[j][0];
                                try {
                                    if (!page.objs.has(objId)) {
                                        continue;
                                    }
                                    const img = await page.objs.get(objId);
                                    if (img) {
                                        const canvas = document.createElement("canvas");
                                        canvas.width = img.width;
                                        canvas.height = img.height;
                                        const ctx = canvas.getContext("2d");
                                        if (ctx) {
                                            if (img.data && img.data.length > 0) {
                                                let data = img.data;
                                                if (data.length === img.width * img.height * 3) {
                                                    const rgba = new Uint8ClampedArray(img.width * img.height * 4);
                                                    for (let k = 0, l = 0; k < data.length; k += 3, l += 4) {
                                                        rgba[l] = data[k];
                                                        rgba[l + 1] = data[k + 1];
                                                        rgba[l + 2] = data[k + 2];
                                                        rgba[l + 3] = 255;
                                                    }
                                                    data = rgba;
                                                }
                                                const imgData = new ImageData(new Uint8ClampedArray(data), img.width, img.height);
                                                ctx.putImageData(imgData, 0, 0);
                                            } else if (img.bitmap) {
                                                ctx.drawImage(img.bitmap, 0, 0);
                                            }

                                            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
                                            if (blob) {
                                                const imgArrayBuffer = await blob.arrayBuffer();
                                                const maxWidth = 550; // Max width for Word document
                                                let finalWidth = img.width;
                                                let finalHeight = img.height;
                                                if (finalWidth > maxWidth) {
                                                    finalHeight = (maxWidth / finalWidth) * finalHeight;
                                                    finalWidth = maxWidth;
                                                }

                                                docChildren.push(
                                                    new Paragraph({
                                                        children: [
                                                            new ImageRun({
                                                                data: imgArrayBuffer,
                                                                transformation: {
                                                                    width: finalWidth,
                                                                    height: finalHeight,
                                                                },
                                                                type: "jpg",
                                                            }),
                                                        ],
                                                        spacing: { before: 200, after: 200 },
                                                    })
                                                );
                                                hasContentOnPage = true;
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error("Failed to extract specific image", e);
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Failed to parse operator list for images", e);
                    }

                    // --- 3. Fallback to OCR if page is completely empty (Scanned PDF) ---
                    if (!hasContentOnPage) {
                        setProcessingStatus(`Running OCR on page ${i} (this may take a while)...`);
                        const viewport = page.getViewport({ scale: 1.5 });
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

                            try {
                                const { data: { text } } = await Tesseract.recognize(
                                    canvas,
                                    'eng',
                                    {
                                        logger: m => {
                                            if (m.status === 'recognizing text') {
                                                setProgress(30 + Math.round((i / numPages) * 50) - 5 + Math.round(m.progress * 5));
                                            }
                                        }
                                    }
                                );

                                if (text && text.trim()) {
                                    const ocrLines = text.split('\n');
                                    ocrLines.forEach(line => {
                                        if (line.trim()) {
                                            docChildren.push(
                                                new Paragraph({
                                                    children: [new TextRun({ text: line.trim(), size: 24 })],
                                                    spacing: { after: 120 },
                                                })
                                            );
                                        }
                                    });
                                    hasContentOnPage = true;
                                }
                            } catch (ocrError) {
                                console.error("OCR failed:", ocrError);
                            }

                            if (!hasContentOnPage) {
                                // If OCR fails, insert the whole page as an image
                                setProcessingStatus(`Inserting scanned image for page ${i}...`);
                                const blob = await new Promise<Blob | null>((resolve) =>
                                    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.8)
                                );

                                if (blob) {
                                    const imgArrayBuffer = await blob.arrayBuffer();
                                    docChildren.push(
                                        new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    data: imgArrayBuffer,
                                                    transformation: {
                                                        width: 550,
                                                        height: (550 * canvas.height) / canvas.width,
                                                    },
                                                    type: "jpg",
                                                }),
                                            ],
                                        })
                                    );
                                    hasContentOnPage = true;
                                }
                            }
                        }
                    }

                    // Add page break between pages except the last one
                    if (hasContentOnPage && i < numPages) {
                        docChildren.push(
                            new Paragraph({
                                pageBreakBefore: true,
                                children: [],
                            })
                        );
                    }

                }
                setProgress(30 + Math.round((i / numPages) * 50));
            }

            // Create Word document with Margins
            setProcessingStatus("Generating Word document...");
            const doc = new Document({
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
                        },
                        children: docChildren.length > 0 ? docChildren : [new Paragraph({ children: [new TextRun("No content found in PDF.")] })],
                    },
                ],
            });
            setProgress(90);

            // Generate blob
            setProcessingStatus("Finalizing...");
            const docBlob = await Packer.toBlob(doc);
            setProgress(95);

            const url = URL.createObjectURL(docBlob);
            setResultUrl(url);
            setResultFileName(file.name);
            setFile(null);

            setProgress(100);
            await new Promise((resolve) => setTimeout(resolve, 500));
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting PDF to Word:", error);
            toast.error("An error occurred while converting the PDF file. It might be scanned or protected.");
        } finally {
            console.warn = originalWarn;
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="PDF to Word"
            description="Extract text and images from PDF and convert to Microsoft Word (.docx) format."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-400">
                        <TextSnippet className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Converted to Word!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your PDF has been converted with text and images preserved.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = resultUrl;
                                link.download = `${resultFileName.replace(".pdf", "")}.docx`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600 transition-colors"
                        >
                            Download Word File
                        </button>
                        <button
                            onClick={() => {
                                if (resultUrl) URL.revokeObjectURL(resultUrl);
                                setResultUrl(null);
                                setResultFileName("");
                                setFile(null);
                            }}
                            className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Convert Another File
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to convert"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 font-bold text-xs">
                                PDF
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>{processingStatus || "Converting to Word..."}</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-cyan-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
