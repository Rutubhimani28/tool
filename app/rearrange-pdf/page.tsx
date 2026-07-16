"use client";

import toast from "react-hot-toast";
import React, { useState, useRef } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { SwapHoriz, DragIndicator } from "@mui/icons-material";

interface PageThumbnail {
    id: string;
    pageIndex: number; // 0-based original index
    dataUrl: string;
}

export default function RearrangePDF() {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setIsLoadingThumbnails(true);
        setThumbnails([]);

        const originalWarn = console.warn;
        console.warn = () => { };

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();

            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first.");
                setFile(null);
                setIsLoadingThumbnails(false);
                return;
            }
            const count = pdfDoc.getPageCount();

            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;
            const thumbs: PageThumbnail[] = [];

            for (let i = 1; i <= count; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });

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
                        id: `page-${i}`,
                        pageIndex: i - 1,
                        dataUrl: canvas.toDataURL(),
                    });
                }
            }
            setThumbnails(thumbs);
        } catch (error) {
            console.error("Error loading PDF for rearranging:", error);
            toast.error("Error loading PDF file.");
            setFile(null);
        } finally {
            console.warn = originalWarn;
            setIsLoadingThumbnails(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
        e.dataTransfer.effectAllowed = "move";
        // Optional: set drag image
    };

    const handleDragEnter = (e: React.DragEvent, position: number) => {
        e.preventDefault();
        dragOverItem.current = position;
    };

    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            const newThumbnails = [...thumbnails];
            const draggedItemContent = newThumbnails[dragItem.current];
            newThumbnails.splice(dragItem.current, 1);
            newThumbnails.splice(dragOverItem.current, 0, draggedItemContent);
            setThumbnails(newThumbnails);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleSave = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const newPdf = await PDFDocument.create();
            setProgress(60);

            const pageIndicesToCopy = thumbnails.map(t => t.pageIndex);
            const copiedPages = await newPdf.copyPages(originalPdf, pageIndicesToCopy);

            copiedPages.forEach(page => {
                newPdf.addPage(page);
            });
            setProgress(80);

            const pdfBytes = await newPdf.save();
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`rearranged_${file.name}`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error saving rearranged PDF:", error);
            toast.error("An error occurred while saving the rearranged PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Rearrange PDF Pages"
            description="Drag and drop page thumbnails to reorder them in your PDF."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400">
                        <SwapHoriz className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Rearranged Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been reordered and is ready for download.
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
                            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
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
                            Rearrange Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to rearrange"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 font-bold text-xs">
                                PDF
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {thumbnails.length} pages
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            disabled={isProcessing}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Thumbnails Grid */}
                    {isLoadingThumbnails ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating page previews...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-2">
                            {thumbnails.map((thumb, index) => (
                                <div
                                    key={thumb.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="flex flex-col items-center p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 hover:border-orange-500/50 transition-all duration-200 cursor-move"
                                >
                                    <div className="relative flex items-center justify-center h-40 w-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900 overflow-hidden p-2 pointer-events-none">
                                        <img
                                            src={thumb.dataUrl}
                                            alt={`Page ${index + 1}`}
                                            className="max-h-full max-w-full object-contain shadow-sm"
                                        />
                                        <span className="absolute bottom-2 left-2 bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-zinc-500 dark:text-zinc-400 pointer-events-none">
                                        <DragIndicator className="h-3.5 w-3.5" />
                                        Drag to move
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Saving rearranged PDF...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-orange-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={isLoadingThumbnails}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200"
                            >
                                <SwapHoriz className="h-5 w-5" />
                                Save & Download PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
