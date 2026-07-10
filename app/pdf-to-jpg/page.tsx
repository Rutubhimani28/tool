"use client";

import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { Collections } from "@mui/icons-material";

// Set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;

export default function PDFToJPG() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesCount, setPagesCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPagesCount(pdf.numPages);
            setFile(selectedFile);
        } catch (error) {
            console.error("Error reading PDF file:", error);
            alert("Error reading PDF file. It might be password-protected or corrupted.");
        }
    };

    const convertToJPG = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const zip = new JSZip();

            for (let i = 1; i <= pagesCount; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                // Create canvas element
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page to canvas
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                // Convert canvas to blob
                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
                );

                if (blob) {
                    zip.file(`${file.name.replace(".pdf", "")}_page_${i}.jpg`, blob);
                }

                setProgress(10 + Math.round((i / pagesCount) * 70));
            }

            setProgress(85);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            setProgress(95);

            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(".pdf", "")}_images.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting PDF to JPG:", error);
            alert("An error occurred while converting the PDF to JPG.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="PDF to JPG"
            description="Convert PDF pages into high-quality JPG images and download them as a ZIP file."
        >
            {!file ? (
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400 font-bold text-xs">
                                PDF
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {pagesCount} pages
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
                                    <span>Converting pages to JPG...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-pink-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={convertToJPG}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200"
                            >
                                <Collections className="h-5 w-5" />
                                Convert to JPG (ZIP)
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
