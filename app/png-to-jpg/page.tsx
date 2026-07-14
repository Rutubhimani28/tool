"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import { Photo, Transform } from "@mui/icons-material";

export default function PNGToJPG() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);
    };

    const handleConvert = () => {
        if (!file) return;
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    // Fill background color (important for transparent PNGs)
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw the PNG image
                    ctx.drawImage(img, 0, 0);

                    // Export as JPG
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                setResultUrl(url);
                                setResultFileName(file.name.replace(/\.[^/.]+$/, "") + ".jpg");
                                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            }
                            setIsProcessing(false);
                        },
                        "image/jpeg",
                        0.80
                    );
                } else {
                    setIsProcessing(false);
                    toast.error("Could not initialize canvas context.");
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
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
        <ToolWrapper title="Convert PNG to JPG" description="Convert PNG images to JPG format with custom background fill for transparent areas." accentColor="cyan">
            {resultUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-400">
                        <Transform className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Converted to JPG!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Your PNG has been successfully converted.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <img src={resultUrl} alt="Converted JPG" className="max-h-full max-w-full object-contain" />
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
                            className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600 transition-colors"
                        >
                            Download JPG
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Convert Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/png"
                    multiple={false}
                    title="Select PNG image to convert"
                    description="Drag & drop a PNG file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
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

                    {/* Settings */}
                    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        {/* Background Color Picker */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Background Fill Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-10 w-16 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 w-28"
                                />
                                <span className="text-xs text-zinc-400">Fills transparent pixels</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <Transform className="h-5 w-5" />
                            {isProcessing ? "Converting..." : "Convert to JPG"}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
