"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt";
import confetti from "canvas-confetti";
import { Lock } from "@mui/icons-material";

export default function ProtectPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [allowPrinting, setAllowPrinting] = useState(true);
    const [allowCopying, setAllowCopying] = useState(true);
    const [allowModifying, setAllowModifying] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        setFile(selectedFiles[0]);
        setPassword("");
    };

    const handleProtect = async () => {
        if (!file || !password) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(30);

            // Normalize PDF with pdf-lib first to prevent encryption corruption
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const normalizedPdfBytes = await pdfDoc.save();
            setProgress(50);

            // Generate a random owner password so the user password has restricted permissions
            const ownerPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);

            // Encrypt PDF using @pdfsmaller/pdf-encrypt
            const encryptedBytes = await encryptPDF(
                new Uint8Array(normalizedPdfBytes),
                password,
                {
                    ownerPassword,
                    allowPrinting,
                    allowCopying,
                    allowModifying,
                }
            );
            setProgress(80);

            const blob = new Blob([encryptedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
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
            console.error("Error protecting PDF:", error);
            toast.error("An error occurred while password-protecting the PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Protect PDF"
            description="Encrypt your PDF document with a secure password to restrict access and permissions."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Lock className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Protected Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been encrypted with the password.
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
                            className="flex-1 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 transition-colors"
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
                            Protect Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to protect"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 font-bold text-xs">
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

                    {/* Password Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Set PDF Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password to open PDF"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        />
                    </div>

                    {/* Permissions */}
                    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Permissions</h4>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowPrinting}
                                onChange={(e) => setAllowPrinting(e.target.checked)}
                                className="rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 dark:border-zinc-700"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Allow Printing</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowCopying}
                                onChange={(e) => setAllowCopying(e.target.checked)}
                                className="rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 dark:border-zinc-700"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Allow Copying Text & Images</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowModifying}
                                onChange={(e) => setAllowModifying(e.target.checked)}
                                className="rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 dark:border-zinc-700"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Allow Modifying Document</span>
                        </label>
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Encrypting PDF...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleProtect}
                                disabled={!password}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 py-4 text-base font-semibold text-white shadow-lg shadow-yellow-500/20 hover:bg-yellow-600 disabled:opacity-50 disabled:hover:bg-yellow-500 disabled:shadow-none transition-all duration-200"
                            >
                                <Lock className="h-5 w-5" />
                                Encrypt PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
