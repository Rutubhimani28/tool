"use client";

import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import {
    Delete,
    ArrowUpward,
    ArrowDownward,
    Merge as MergeIcon,
} from "@mui/icons-material";

interface UploadedFile {
    id: string;
    file: File;
    pagesCount: number;
}

export default function MergePDF() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        const newFiles: UploadedFile[] = [];
        for (const file of selectedFiles) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const pagesCount = pdfDoc.getPageCount();
                newFiles.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    pagesCount,
                });
            } catch (error) {
                console.error("Error reading PDF file:", error);
                alert(`Error reading ${file.name}. It might be password-protected or corrupted.`);
            }
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const moveFile = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === files.length - 1) return;

        const newFiles = [...files];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newFiles[index];
        newFiles[index] = newFiles[targetIndex];
        newFiles[targetIndex] = temp;
        setFiles(newFiles);
    };

    const mergePDFs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const mergedPdf = await PDFDocument.create();
            let currentFileIndex = 0;

            for (const uploadedFile of files) {
                const arrayBuffer = await uploadedFile.file.arrayBuffer();
                const srcPdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(
                    srcPdf,
                    srcPdf.getPageIndices()
                );
                copiedPages.forEach((page) => mergedPdf.addPage(page));

                currentFileIndex++;
                setProgress(10 + Math.round((currentFileIndex / files.length) * 80));
            }

            const mergedPdfBytes = await mergedPdf.save();
            setProgress(95);

            const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "merged_document.pdf";
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
            console.error("Error merging PDFs:", error);
            alert("An error occurred while merging the PDF files.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Merge PDF"
            description="Combine multiple PDF files into a single document in your preferred order."
        >
            {files.length === 0 ? (
                <DropZone
                    onFilesSelected={handleFilesSelected}
                    accept=".pdf"
                    multiple={true}
                    title="Select PDF files to merge"
                    description="Drag & drop multiple PDF files here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File List */}
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                        {files.map((fileObj, index) => (
                            <div
                                key={fileObj.id}
                                className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold text-xs">
                                        PDF
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                            {fileObj.file.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB • {fileObj.pagesCount} pages
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveFile(index, "up")}
                                        disabled={index === 0 || isProcessing}
                                        className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ArrowUpward className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => moveFile(index, "down")}
                                        disabled={index === files.length - 1 || isProcessing}
                                        className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    >
                                        <ArrowDownward className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => removeFile(fileObj.id)}
                                        disabled={isProcessing}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                    >
                                        <Delete className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add More Files */}
                    <div className="flex justify-center">
                        <label className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
                            Add More Files
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                accept=".pdf"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        handleFilesSelected(Array.from(e.target.files));
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Merging PDFs...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-red-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={mergePDFs}
                                disabled={files.length < 2}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 disabled:shadow-none transition-all duration-200"
                            >
                                <MergeIcon className="h-5 w-5" />
                                Merge PDFs ({files.length} files)
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
