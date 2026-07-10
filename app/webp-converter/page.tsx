"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import { Photo, Transform } from "@mui/icons-material";

export default function WebPConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<"image/webp" | "image/png" | "image/jpeg">("image/webp");
    const [quality, setQuality] = useState(90);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);

        // Auto-detect target format to prevent converting to the same format
        if (selectedFile.type === "image/webp") {
            setTargetFormat("image/png");
        } else {
            setTargetFormat("image/webp");
        }
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
                    // Fill white background if converting transparent image to JPG
                    if (targetFormat === "image/jpeg") {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                setResultUrl(url);
                                const ext = targetFormat === "image/webp" ? ".webp" : targetFormat === "image/png" ? ".png" : ".jpg";
                                setResultFileName(file.name.replace(/\.[^/.]+$/, "") + ext);
                                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            }
                            setIsProcessing(false);
                        },
                        targetFormat,
                        quality / 100
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

    const getFormatLabel = (mime: string) => {
        if (mime === "image/webp") return "WebP";
        if (mime === "image/png") return "PNG";
        return "JPG";
    };

    return (
        <ToolWrapper title="WebP Converter" description="Convert images to WebP format for web optimization, or convert WebP files back to PNG/JPG." accentColor="purple">
            {resultUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <Transform className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Converted to {getFormatLabel(targetFormat)}!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Your image has been successfully converted.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <img src={resultUrl} alt="Converted Image" className="max-h-full max-w-full object-contain" />
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
                            Convert Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to convert"
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

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        {/* Target Format */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Target Format</label>
                            <div className="flex gap-2">
                                {["image/webp", "image/png", "image/jpeg"].map((format) => {
                                    const label = getFormatLabel(format);
                                    const isDisabled = file.type === format;
                                    return (
                                        <button
                                            key={format}
                                            disabled={isDisabled}
                                            onClick={() => setTargetFormat(format as any)}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${targetFormat === format
                                                    ? "bg-purple-500 border-purple-500 text-white"
                                                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quality Slider (only for WebP/JPG) */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Quality {targetFormat === "image/png" && <span className="text-xs text-zinc-400 font-normal">(Lossless)</span>}
                                </label>
                                {targetFormat !== "image/png" && (
                                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{quality}%</span>
                                )}
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                disabled={targetFormat === "image/png"}
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-30"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <Transform className="h-5 w-5" />
                            {isProcessing ? "Converting..." : `Convert to ${getFormatLabel(targetFormat)}`}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
