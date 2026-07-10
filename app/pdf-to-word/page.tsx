"use client";

import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel } from "docx";
import confetti from "canvas-confetti";
import { TextSnippet } from "@mui/icons-material";

// Set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;

export default function PDFToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        setFile(selectedFiles[0]);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(20);

            // Load PDF document
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            setProgress(30);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const docChildren: any[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);

                // --- Extract text ---
                const textContent = await page.getTextContent();
                interface TextItem { str: string; transform: number[] }
                const items = textContent.items as TextItem[];
                const lines: { [key: number]: string[] } = {};

                items.forEach((item) => {
                    const y = Math.round(item.transform[5]);
                    if (!lines[y]) {
                        lines[y] = [];
                    }
                    lines[y].push(item.str);
                });

                const sortedY = Object.keys(lines)
                    .map(Number)
                    .sort((a, b) => b - a);

                // Add page header
                docChildren.push(
                    new Paragraph({
                        children: [new TextRun({ text: `— Page ${i} —`, bold: true, size: 20, color: "888888" })],
                        spacing: { before: i > 1 ? 400 : 0, after: 200 },
                        heading: HeadingLevel.HEADING_3,
                    })
                );

                // --- Render page as image ---
                try {
                    const scale = 2; // Higher scale = better quality
                    const viewport = page.getViewport({ scale });
                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext("2d");

                    if (ctx) {
                        await page.render({ canvasContext: ctx, viewport }).promise;

                        // Convert canvas to PNG blob
                        const blob = await new Promise<Blob | null>((resolve) => {
                            canvas.toBlob((b) => resolve(b), "image/png", 0.92);
                        });

                        if (blob) {
                            const imgArrayBuffer = await blob.arrayBuffer();
                            const imgUint8Array = new Uint8Array(imgArrayBuffer);

                            // Calculate dimensions to fit within A4 page width (~595 points at 72dpi)
                            // docx uses EMU (English Metric Units): 1 inch = 914400 EMU
                            // A4 width ~= 6.27 inches usable (after margins)
                            const maxWidthInches = 6.27;
                            const imgWidthInches = viewport.width / (scale * 72);
                            const imgHeightInches = viewport.height / (scale * 72);
                            const ratio = Math.min(1, maxWidthInches / imgWidthInches);
                            const finalWidth = Math.round(imgWidthInches * ratio * 914400);
                            const finalHeight = Math.round(imgHeightInches * ratio * 914400);

                            docChildren.push(
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: imgUint8Array,
                                            transformation: {
                                                width: Math.round(finalWidth / 9525), // Convert EMU to points for docx
                                                height: Math.round(finalHeight / 9525),
                                            },
                                            type: "png",
                                        }),
                                    ],
                                    spacing: { after: 200 },
                                })
                            );
                        }
                    }
                } catch (imgErr) {
                    console.warn(`Could not render page ${i} as image:`, imgErr);
                }

                // Add text content below the image
                sortedY.forEach((y) => {
                    const lineText = lines[y].join(" ").trim();
                    if (lineText) {
                        docChildren.push(
                            new Paragraph({
                                children: [new TextRun(lineText)],
                                spacing: { after: 120 },
                            })
                        );
                    }
                });

                // Add page break between pages except the last one
                if (i < numPages) {
                    docChildren.push(
                        new Paragraph({
                            pageBreakBefore: true,
                            children: [],
                        })
                    );
                }

                setProgress(30 + Math.round((i / numPages) * 50));
            }

            // Create Word document
            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: docChildren.length > 0 ? docChildren : [new Paragraph("No content found in PDF.")],
                    },
                ],
            });
            setProgress(90);

            // Generate blob
            const docBlob = await Packer.toBlob(doc);
            setProgress(95);

            const url = URL.createObjectURL(docBlob);
            setResultUrl(url);
            setResultFileName(file.name);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting PDF to Word:", error);
            alert("An error occurred while converting the PDF file. It might be scanned or protected.");
        } finally {
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
                                    <span>Converting to Word...</span>
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
                            <button
                                onClick={handleConvert}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-200"
                            >
                                <TextSnippet className="h-5 w-5" />
                                Convert to Word
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
