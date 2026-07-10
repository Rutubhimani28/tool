"use client";

import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { Compress } from "@mui/icons-material";

export default function CompressPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
    const [compressedFileSize, setCompressedFileSize] = useState(0);
    const [resultOriginalSize, setResultOriginalSize] = useState(0);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedSize(0);
    };

    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setProgress(60);

            const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
            setProgress(85);

            setCompressedSize(compressedBytes.length);
            setCompressedFileSize(compressedBytes.length);

            const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setCompressedFileUrl(url);
            setResultOriginalSize(file.size);
            setResultFileName(file.name);

            // Clear input state
            setFile(null);
            setOriginalSize(0);
            setCompressedSize(0);

            setProgress(100);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (error) {
            console.error("Error compressing PDF:", error);
            alert("An error occurred while compressing the PDF file.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const savings = originalSize && compressedSize ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

    return (
        <ToolWrapper title="Compress PDF" description="Reduce the file size of your PDF document while maintaining the best possible quality.">
            {compressedFileUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                        <Compress className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Compressed Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Original Size: {formatSize(resultOriginalSize)}<br />
                            Compressed Size: {formatSize(compressedFileSize)}<br />
                            Savings: {resultOriginalSize > 0 ? `${(((resultOriginalSize - compressedFileSize) / resultOriginalSize) * 100).toFixed(1)}%` : "0%"}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = compressedFileUrl;
                                link.download = `${resultFileName.replace(".pdf", "")}_compressed.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                        >
                            Download Compressed PDF
                        </button>
                        <button
                            onClick={() => {
                                if (compressedFileUrl) URL.revokeObjectURL(compressedFileUrl);
                                setCompressedFileUrl(null);
                                setCompressedFileSize(0);
                                setResultOriginalSize(0);
                                setResultFileName("");
                                setFile(null);
                                setOriginalSize(0);
                                setCompressedSize(0);
                            }}
                            className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Compress Another File
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to compress"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400 font-bold text-xs">
                                PDF
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{file.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatSize(originalSize)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Compression Stats */}
                    {compressedSize > 0 && (
                        <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl border border-green-200 bg-green-50/20 dark:border-green-900/30 dark:bg-green-950/10">
                            <div className="flex flex-col items-center text-center">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Original Size</span>
                                <span className="mt-1 text-base font-bold text-zinc-900 dark:text-white">{formatSize(originalSize)}</span>
                            </div>
                            <div className="flex flex-col items-center text-center border-x border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Compressed Size</span>
                                <span className="mt-1 text-base font-bold text-green-600 dark:text-green-400">{formatSize(compressedSize)}</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Savings</span>
                                <span className="mt-1 text-base font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                                    {savings > 0 ? `${savings.toFixed(1)}%` : "0%"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Compressing PDF...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleCompress}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all duration-200"
                            >
                                <Compress className="h-5 w-5" />
                                Compress PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}