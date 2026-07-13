"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument, degrees } from "pdf-lib";
import confetti from "canvas-confetti";
import { RotateRight, Refresh } from "@mui/icons-material";

interface PageThumbnail {
    pageNumber: number;
    dataUrl: string;
    originalRotation: number;
}

export default function RotatePDF() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesCount, setPagesCount] = useState(0);
    const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
    const [rotations, setRotations] = useState<{ [key: number]: number }>({}); // pageNumber -> added rotation (0, 90, 180, 270)
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setIsLoadingThumbnails(true);
        setThumbnails([]);
        setRotations({});

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();

            // Load for pdf-lib to get page count
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const count = pdfDoc.getPageCount();
            setPagesCount(count);

            // Load for pdfjs-dist to render thumbnails
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const thumbs: PageThumbnail[] = [];

            for (let i = 1; i <= count; i++) {
                const page = await pdf.getPage(i);
                const originalRotation = page.rotate;
                const viewport = page.getViewport({ scale: 0.3 }); // small thumbnail scale

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

                    thumbs.push({
                        pageNumber: i,
                        dataUrl: canvas.toDataURL(),
                        originalRotation,
                    });
                }
                // Initialize rotation to 0
                setRotations((prev) => ({ ...prev, [i]: 0 }));
            }
            setThumbnails(thumbs);
        } catch (error) {
            console.error("Error loading PDF for rotation:", error);
            toast.error("Error loading PDF file.");
            setFile(null);
        } finally {
            setIsLoadingThumbnails(false);
        }
    };

    const rotatePage = (pageNumber: number) => {
        setRotations((prev) => ({
            ...prev,
            [pageNumber]: (prev[pageNumber] + 90) % 360,
        }));
    };

    const rotateAll = () => {
        setRotations((prev) => {
            const next: { [key: number]: number } = {};
            for (let i = 1; i <= pagesCount; i++) {
                next[i] = ((prev[i] || 0) + 90) % 360;
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            setProgress(60);

            pages.forEach((page, index) => {
                const pageNum = index + 1;
                const addedRotation = rotations[pageNum] || 0;
                if (addedRotation !== 0) {
                    const currentRotation = page.getRotation().angle;
                    page.setRotation(degrees((currentRotation + addedRotation) % 360));
                }
            });
            setProgress(80);

            const pdfBytes = await pdfDoc.save();
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}_rotated.pdf`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error saving rotated PDF:", error);
            toast.error("An error occurred while saving the rotated PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Rotate PDF"
            description="Rotate individual pages or all pages of your PDF document clockwise."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-teal-500 dark:bg-teal-900/30 dark:text-teal-400">
                        <RotateRight className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Rotated Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been rotated and is ready for download.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = resultUrl;
                                link.download = resultFileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 transition-colors"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={() => {
                                URL.revokeObjectURL(resultUrl);
                                setResultUrl(null);
                                setResultFileName("");
                            }}
                            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Rotate Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to rotate"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 font-bold text-xs">
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
                        <div className="flex gap-2">
                            <button
                                onClick={rotateAll}
                                disabled={isLoadingThumbnails || isProcessing}
                                className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors flex items-center gap-1"
                            >
                                <Refresh className="h-4 w-4" />
                                Rotate All
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                disabled={isProcessing}
                                className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails Grid */}
                    {isLoadingThumbnails ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-4" />
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating page previews...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-2">
                            {thumbnails.map((thumb) => {
                                const addedRotation = rotations[thumb.pageNumber] || 0;
                                return (
                                    <div
                                        key={thumb.pageNumber}
                                        className="flex flex-col items-center p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 hover:border-teal-500/50 transition-all duration-200"
                                    >
                                        <div className="relative flex items-center justify-center h-40 w-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900 overflow-hidden p-2">
                                            { }
                                            <img
                                                src={thumb.dataUrl}
                                                alt={`Page ${thumb.pageNumber}`}
                                                className="max-h-full max-w-full object-contain transition-transform duration-300 shadow-sm"
                                                style={{ transform: `rotate(${addedRotation}deg)` }}
                                            />
                                            <span className="absolute bottom-2 left-2 bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Page {thumb.pageNumber}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => rotatePage(thumb.pageNumber)}
                                            className="mt-3 flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-950/30 px-3 py-1.5 rounded-xl transition-all"
                                        >
                                            <RotateRight className="h-3.5 w-3.5" />
                                            Rotate 90°
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Saving rotated PDF...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-teal-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={isLoadingThumbnails}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all duration-200"
                            >
                                <RotateRight className="h-5 w-5" />
                                Save & Download PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
