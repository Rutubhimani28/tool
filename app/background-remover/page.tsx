"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import { AutoFixHigh, Photo } from "@mui/icons-material";

export default function BackgroundRemover() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState("");
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);
    };

    const handleRemoveBackground = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProcessingStatus("Loading AI model (first time may take a moment)...");

        try {
            const { removeBackground } = await import("@imgly/background-removal");

            setProcessingStatus("Removing background...");
            const blob = await removeBackground(file, {
                debug: false,
                progress: (key, current, total) => {
                    if (key.includes("fetch")) {
                        setProcessingStatus(`Downloading model assets: ${Math.round((current / total) * 100)}%`);
                    } else if (key.includes("compute")) {
                        setProcessingStatus(`Processing image: ${Math.round((current / total) * 100)}%`);
                    }
                }
            });

            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(file.name.replace(/\.[^/.]+$/, "") + "_nobg.png");
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (error) {
            console.error("Background removal error:", error);
            toast.error("Failed to remove background. Make sure you are using a modern browser with WebGL enabled.");
        } finally {
            setIsProcessing(false);
            setProcessingStatus("");
        }
    };

    const handleReset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setFile(null);
        setPreviewUrl(null);
        setResultUrl(null);
        setResultFileName("");
    };

    return (
        <ToolWrapper title="Background Remover" description="Remove the background from your images automatically using local AI." accentColor="purple">
            {resultUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <AutoFixHigh className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Background Removed!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Your image has been processed successfully.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center relative bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><rect width=%2210%22 height=%2210%22 fill=%22%23eee%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23eee%22/><rect x=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23fff%22/><rect y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23fff%22/></svg>')] bg-repeat">
                        <img src={resultUrl} alt="Background Removed" className="max-h-full max-w-full object-contain" />
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
                            Download Image
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Process Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to remove background"
                    description="Drag & drop a JPG, PNG, or WebP file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
                                <Photo className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{file.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Preview original */}
                    <div className="w-full max-w-md mx-auto aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        {previewUrl && <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />}
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                </div>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{processingStatus}</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleRemoveBackground}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200"
                            >
                                <AutoFixHigh className="h-5 w-5" />
                                Remove Background
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
