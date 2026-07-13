"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { LockOpen } from "@mui/icons-material";

export default function UnlockPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPassword("");
        setIsEncrypted(false);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            // Try to load without password to check if encrypted
            await PDFDocument.load(arrayBuffer);
            // If it succeeds, it's not encrypted
            setIsEncrypted(false);

        } catch (error: any) {
            // If it throws an error, it's likely encrypted

            setIsEncrypted(true);
        }
    };

    const handleUnlock = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(20);

            let pdfBytes: Uint8Array;

            if (isEncrypted) {
                try {
                    // Load PDF document using pdfjs-dist with password
                    const pdfjsLib = await import("pdfjs-dist");
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password });
                    const pdf = await loadingTask.promise;
                    const numPages = pdf.numPages;
                    setProgress(40);

                    const pdfDoc = await PDFDocument.create();

                    for (let i = 1; i <= numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        if (!context) continue;

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({
                            canvasContext: context,
                            viewport: viewport,
                            canvas: canvas,
                        }).promise;

                        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
                        const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
                        const embeddedImg = await pdfDoc.embedJpg(imgBytes);

                        const { width, height } = embeddedImg.scale(1);
                        const newPage = pdfDoc.addPage([width, height]);
                        newPage.drawImage(embeddedImg, {
                            x: 0,
                            y: 0,
                            width,
                            height,
                        });

                        setProgress(40 + Math.round((i / numPages) * 40));
                    }

                    pdfBytes = await pdfDoc.save();
                } catch (err) {
                    console.error("Decryption error:", err);
                    toast.error("Incorrect password or decryption failed. Please try again.");
                    setIsProcessing(false);
                    return;
                }
            } else {
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                pdfBytes = await pdfDoc.save();
            }
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}_unlocked.pdf`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error unlocking PDF:", error);
            toast.error("An error occurred while unlocking the PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Unlock PDF"
            description="Remove password protection, security, and restrictions from your PDF document."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <LockOpen className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Unlocked Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been unlocked and is ready for download.
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
                            className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 transition-colors"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={() => {
                                URL.revokeObjectURL(resultUrl);
                                setResultUrl(null);
                                setResultFileName("");
                            }}
                            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-colors"
                        >
                            Unlock Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to unlock"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 font-bold text-xs">
                                PDF
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {isEncrypted ? "Locked 🔒" : "Not Locked 🔓"}
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

                    {/* Password Input */}
                    {isEncrypted ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                Enter PDF Password
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                            />
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-green-50 border border-green-100 dark:bg-green-950/10 dark:border-green-900/30 text-sm text-green-700 dark:text-green-400">
                            This PDF is not password-protected. You can save it to remove any other restrictions.
                        </div>
                    )}

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Unlocking PDF...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-purple-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleUnlock}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200"
                            >
                                <LockOpen className="h-5 w-5" />
                                Unlock PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
