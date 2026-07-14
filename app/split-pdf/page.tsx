"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { CallSplit } from "@mui/icons-material";

export default function SplitPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesCount, setPagesCount] = useState(0);
    const [splitMode, setSplitMode] = useState<"range" | "all">("range");
    const [pageRange, setPageRange] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first.");
                return;
            }
            setPagesCount(pdfDoc.getPageCount());
            setFile(selectedFile);
            setPageRange(`1-${pdfDoc.getPageCount()}`);
        } catch (error) {
            console.error("Error reading PDF file:", error);
            toast.error("Error reading PDF file. It might be password-protected or corrupted.");
        }
    };

    const parseRange = (rangeStr: string, maxPages: number): number[] => {
        const pages = new Set<number>();
        const parts = rangeStr.split(",");

        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes("-")) {
                const [startStr, endStr] = trimmed.split("-");
                const start = parseInt(startStr.trim(), 10);
                const end = parseInt(endStr.trim(), 10);
                if (!isNaN(start) && !isNaN(end)) {
                    const min = Math.max(1, Math.min(start, end));
                    const max = Math.min(maxPages, Math.max(start, end));
                    for (let i = min; i <= max; i++) {
                        pages.add(i - 1); // 0-indexed
                    }
                }
            } else {
                const page = parseInt(trimmed, 10);
                if (!isNaN(page) && page >= 1 && page <= maxPages) {
                    pages.add(page - 1); // 0-indexed
                }
            }
        }

        return Array.from(pages).sort((a, b) => a - b);
    };

    const handleSplit = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

            if (splitMode === "range") {
                const pageIndices = parseRange(pageRange, pagesCount);
                if (pageIndices.length === 0) {
                    toast.error("Invalid page range. Please check your input.");
                    setIsProcessing(false);
                    return;
                }

                setProgress(30);
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
                copiedPages.forEach((page) => newPdf.addPage(page));
                setProgress(70);

                const pdfBytes = await newPdf.save();
                setProgress(90);

                const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setResultUrl(url);
                setResultFileName(file.name);
                setFile(null);
            } else {
                // Split all pages into a ZIP file
                const zip = new JSZip();
                for (let i = 0; i < pagesCount; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
                    newPdf.addPage(copiedPage);
                    const pdfBytes = await newPdf.save();
                    zip.file(`${file.name.replace(".pdf", "")}_page_${i + 1}.pdf`, pdfBytes);
                    setProgress(10 + Math.round((i / pagesCount) * 70));
                }

                setProgress(85);
                const zipBlob = await zip.generateAsync({ type: "blob" });
                setProgress(95);

                const url = URL.createObjectURL(zipBlob);
                setResultUrl(url);
                setResultFileName(`${file.name.replace(".pdf", "")}_extracted.pdf`);
                setFile(null);
            }

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error splitting PDF:", error);
            toast.error("An error occurred while splitting the PDF file.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Split PDF"
            description="Extract specific pages or split every page into individual PDF files."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                        <div className="text-4xl">✂️</div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Split Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been split and is ready for download.
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
                            className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                        >
                            Download File
                        </button>
                        <button
                            onClick={() => {
                                URL.revokeObjectURL(resultUrl);
                                setResultUrl(null);
                                setResultFileName("");
                            }}
                            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Split Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to split"
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

                    {/* Split Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setSplitMode("range")}
                            className={`flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-200 ${splitMode === "range"
                                ? "border-orange-500 bg-orange-50/30 dark:bg-orange-950/10"
                                : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                }`}
                        >
                            <span className="text-base font-bold text-zinc-900 dark:text-white">
                                Extract Page Range
                            </span>
                            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Select specific pages or ranges to extract into a single PDF.
                            </span>
                        </button>

                        <button
                            onClick={() => setSplitMode("all")}
                            className={`flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-200 ${splitMode === "all"
                                ? "border-orange-500 bg-orange-50/30 dark:bg-orange-950/10"
                                : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                }`}
                        >
                            <span className="text-base font-bold text-zinc-900 dark:text-white">
                                Split All Pages
                            </span>
                            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Convert every page of this PDF into its own separate PDF file.
                            </span>
                        </button>
                    </div>

                    {/* Range Input */}
                    {splitMode === "range" && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="page-range" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                Page Range
                            </label>
                            <input
                                id="page-range"
                                name="page-range"
                                type="text"
                                placeholder="e.g., 1-3, 5, 7-9"
                                value={pageRange}
                                onChange={(e) => setPageRange(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                            />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                Use commas to separate pages/ranges, e.g., &quot;1-3, 5, 7-9&quot; (Total pages: {pagesCount})
                            </span>
                        </div>
                    )}

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Processing PDF...</span>
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
                                onClick={handleSplit}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200"
                            >
                                <CallSplit className="h-5 w-5" />
                                {splitMode === "range" ? "Extract Pages" : "Split into ZIP"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
