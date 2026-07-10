"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import { AspectRatio, Photo, Height, SwapHoriz, Straighten } from "@mui/icons-material";

export default function ImageResizer() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resizedUrl, setResizedUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResizedUrl(null);

        const img = new Image();
        img.onload = () => {
            setOriginalWidth(img.naturalWidth);
            setOriginalHeight(img.naturalHeight);
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = URL.createObjectURL(selectedFile);
    };

    const handleWidthChange = (val: number) => {
        setWidth(val);
        if (lockAspectRatio && aspectRatio) {
            setHeight(Math.round(val / aspectRatio));
        }
    };

    const handleHeightChange = (val: number) => {
        setHeight(val);
        if (lockAspectRatio && aspectRatio) {
            setWidth(Math.round(val * aspectRatio));
        }
    };

    const applyScale = (percent: number) => {
        if (!originalWidth || !originalHeight) return;
        const newW = Math.round((originalWidth * percent) / 100);
        const newH = Math.round((originalHeight * percent) / 100);
        setWidth(newW);
        setHeight(newH);
    };

    const handleResize = () => {
        if (!file || !width || !height) return;
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            setResizedUrl(url);
                            setResultFileName(file.name.replace(/\.[^/.]+$/, "") + `_${width}x${height}` + file.name.substring(file.name.lastIndexOf(".")));
                            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        }
                        setIsProcessing(false);
                    }, file.type);
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
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        setFile(null);
        setPreviewUrl(null);
        setResizedUrl(null);
        setOriginalWidth(0);
        setOriginalHeight(0);
        setWidth(0);
        setHeight(0);
        setResultFileName("");
    };

    return (
        <ToolWrapper title="Image Resizer" description="Resize your images to custom dimensions or scale them by percentage." accentColor="blue">
            {resizedUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
                        <AspectRatio className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Image Resized!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Original Dimensions: {originalWidth} x {originalHeight} px<br />
                            Resized Dimensions: {width} x {height} px
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <img src={resizedUrl} alt="Resized" className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = resizedUrl;
                                link.download = resultFileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors"
                        >
                            Download Image
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Resize Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to resize"
                    description="Drag & drop a JPG, PNG, or WebP file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                                <Photo className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{file.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{originalWidth} x {originalHeight} px</p>
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
                    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        {/* Direct Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                    <Straighten className="h-4 w-4 text-zinc-400" /> Width (px)
                                </label>
                                <input
                                    type="number"
                                    value={width || ""}
                                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                    <Height className="h-4 w-4 text-zinc-400" /> Height (px)
                                </label>
                                <input
                                    type="number"
                                    value={height || ""}
                                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Quick Scale Buttons */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Quick Scale</label>
                            <div className="flex gap-2">
                                {[25, 50, 75, 100].map((percent) => (
                                    <button
                                        key={percent}
                                        onClick={() => applyScale(percent)}
                                        className="flex-1 py-2 rounded-xl text-sm font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        {percent}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio Lock */}
                        <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <input
                                type="checkbox"
                                checked={lockAspectRatio}
                                onChange={(e) => setLockAspectRatio(e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-blue-500 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
                            />
                            Lock Aspect Ratio
                        </label>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleResize}
                            disabled={isProcessing || !width || !height}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <AspectRatio className="h-5 w-5" />
                            {isProcessing ? "Resizing..." : "Resize Image"}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
