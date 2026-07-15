"use client";

import toast from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import { Crop, Photo, RotateRight } from "@mui/icons-material";

export default function ImageCropper() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
    const [aspectRatio, setAspectRatio] = useState<"free" | number>("free");
    const [isProcessing, setIsProcessing] = useState(false);
    const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    // Crop box state (percentages of container size)
    const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragBoxStart, setDragBoxStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const [activeHandle, setActiveHandle] = useState<string | null>(null); // "move", "tl", "tr", "bl", "br"
    const [imageLoaded, setImageLoaded] = useState(false);
    const [manualInputs, setManualInputs] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setCroppedUrl(null);
        setRotation(0);
        setCropBox({ x: 10, y: 10, w: 80, h: 80 });
        setImageLoaded(false);
    };

    // Update manual inputs when cropBox or image changes
    useEffect(() => {
        if (!imgRef.current || !imageLoaded) return;
        const img = imgRef.current;
        setManualInputs({
            x: Math.round((cropBox.x / 100) * img.naturalWidth),
            y: Math.round((cropBox.y / 100) * img.naturalHeight),
            w: Math.round((cropBox.w / 100) * img.naturalWidth),
            h: Math.round((cropBox.h / 100) * img.naturalHeight),
        });
    }, [cropBox, imageLoaded]);

    const handleManualInputChange = (field: 'x' | 'y' | 'w' | 'h', value: string) => {
        if (!imgRef.current || !imageLoaded) return;
        const img = imgRef.current;

        if (value === '') {
            setManualInputs(prev => ({ ...prev, [field]: '' }));
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue)) return;

        let newInputs = {
            x: Number(manualInputs.x) || 0,
            y: Number(manualInputs.y) || 0,
            w: Number(manualInputs.w) || 10,
            h: Number(manualInputs.h) || 10,
            [field]: numValue
        };

        // Respect aspect ratio if not free
        if (aspectRatio !== "free") {
            const ratio = aspectRatio as number;
            if (field === 'w') {
                newInputs.h = Math.round(newInputs.w / ratio);
            } else if (field === 'h') {
                newInputs.w = Math.round(newInputs.h * ratio);
            }
        }

        if (newInputs.w < 10) {
            newInputs.w = 10;
            if (aspectRatio !== "free") newInputs.h = Math.round(10 / (aspectRatio as number));
        }
        if (newInputs.h < 10) {
            newInputs.h = 10;
            if (aspectRatio !== "free") newInputs.w = Math.round(10 * (aspectRatio as number));
        }
        if (newInputs.x < 0) newInputs.x = 0;
        if (newInputs.y < 0) newInputs.y = 0;

        if (newInputs.x + newInputs.w > img.naturalWidth) {
            if (field === 'x') {
                newInputs.w = img.naturalWidth - newInputs.x;
                if (aspectRatio !== "free") newInputs.h = Math.round(newInputs.w / (aspectRatio as number));
            } else {
                newInputs.x = img.naturalWidth - newInputs.w;
            }
        }
        if (newInputs.y + newInputs.h > img.naturalHeight) {
            if (field === 'y') {
                newInputs.h = img.naturalHeight - newInputs.y;
                if (aspectRatio !== "free") newInputs.w = Math.round(newInputs.h * (aspectRatio as number));
            } else {
                newInputs.y = img.naturalHeight - newInputs.h;
            }
        }

        setManualInputs(newInputs);
        setCropBox({
            x: (newInputs.x / img.naturalWidth) * 100,
            y: (newInputs.y / img.naturalHeight) * 100,
            w: (newInputs.w / img.naturalWidth) * 100,
            h: (newInputs.h / img.naturalHeight) * 100,
        });
    };

    // Adjust crop box when aspect ratio changes or image loads
    useEffect(() => {
        if (aspectRatio === "free" || !imgRef.current || !imageLoaded) return;

        const img = imgRef.current;
        const targetRatio = aspectRatio as number;
        const imageRatio = img.naturalWidth / img.naturalHeight;

        let newW_px, newH_px;

        if (targetRatio > imageRatio) {
            // Width is maxed out (90% of image width to leave a small margin)
            newW_px = img.naturalWidth * 0.9;
            newH_px = newW_px / targetRatio;
        } else {
            // Height is maxed out (90% of image height to leave a small margin)
            newH_px = img.naturalHeight * 0.9;
            newW_px = newH_px * targetRatio;
        }

        // Center the crop box
        const newX_px = (img.naturalWidth - newW_px) / 2;
        const newY_px = (img.naturalHeight - newH_px) / 2;

        setCropBox({
            x: (newX_px / img.naturalWidth) * 100,
            y: (newY_px / img.naturalHeight) * 100,
            w: (newW_px / img.naturalWidth) * 100,
            h: (newH_px / img.naturalHeight) * 100,
        });
    }, [aspectRatio, imageLoaded, previewUrl]);

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, handle: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setActiveHandle(handle);

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        setDragStart({ x: clientX, y: clientY });
        setDragBoxStart({ ...cropBox });
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !containerRef.current || !imgRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const dx = ((clientX - dragStart.x) / rect.width) * 100;
        const dy = ((clientY - dragStart.y) / rect.height) * 100;

        const img = imgRef.current;
        const containerRatio = img.naturalWidth / img.naturalHeight;
        const pctRatio = aspectRatio === "free" ? 1 : (aspectRatio as number) / containerRatio;

        setCropBox((prev) => {
            let { x, y, w, h } = dragBoxStart;

            if (activeHandle === "move") {
                x = Math.max(0, Math.min(100 - w, x + dx));
                y = Math.max(0, Math.min(100 - h, y + dy));
            } else if (activeHandle === "br") {
                w = Math.max(10, Math.min(100 - x, w + dx));
                h = aspectRatio === "free" ? Math.max(10, Math.min(100 - y, h + dy)) : w / pctRatio;
                if (y + h > 100) {
                    h = 100 - y;
                    w = aspectRatio === "free" ? w : h * pctRatio;
                }
            } else if (activeHandle === "bl") {
                const originalRight = x + w;
                x = Math.max(0, Math.min(originalRight - 10, x + dx));
                w = originalRight - x;
                h = aspectRatio === "free" ? Math.max(10, Math.min(100 - y, h + dy)) : w / pctRatio;
                if (y + h > 100) {
                    h = 100 - y;
                    w = aspectRatio === "free" ? w : h * pctRatio;
                    x = originalRight - w;
                }
            } else if (activeHandle === "tr") {
                const originalBottom = y + h;
                w = Math.max(10, Math.min(100 - x, w + dx));
                y = Math.max(0, Math.min(originalBottom - 10, y + dy));
                h = originalBottom - y;
                if (aspectRatio !== "free") {
                    h = w / pctRatio;
                    y = originalBottom - h;
                    if (y < 0) {
                        y = 0;
                        h = originalBottom;
                        w = h * pctRatio;
                    }
                }
            } else if (activeHandle === "tl") {
                const originalRight = x + w;
                const originalBottom = y + h;
                x = Math.max(0, Math.min(originalRight - 10, x + dx));
                w = originalRight - x;
                y = Math.max(0, Math.min(originalBottom - 10, y + dy));
                h = originalBottom - y;
                if (aspectRatio !== "free") {
                    h = w / pctRatio;
                    y = originalBottom - h;
                    if (y < 0) {
                        y = 0;
                        h = originalBottom;
                        w = h * pctRatio;
                        x = originalRight - w;
                    }
                }
            }

            return { x, y, w, h };
        });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        setActiveHandle(null);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handlePointerMove, { passive: false });
            window.addEventListener("mouseup", handlePointerUp);
            window.addEventListener("touchmove", handlePointerMove, { passive: false });
            window.addEventListener("touchend", handlePointerUp);
        }
        return () => {
            window.removeEventListener("mousemove", handlePointerMove);
            window.removeEventListener("mouseup", handlePointerUp);
            window.removeEventListener("touchmove", handlePointerMove);
            window.removeEventListener("touchend", handlePointerUp);
        };
    }, [isDragging, dragStart, dragBoxStart, activeHandle]);

    const handleCrop = () => {
        if (!file || !imgRef.current) return;
        setIsProcessing(true);

        const img = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
            // Calculate crop coordinates relative to the natural image size
            const scaleX = img.naturalWidth / 100;
            const scaleY = img.naturalHeight / 100;

            const cropX = cropBox.x * scaleX;
            const cropY = cropBox.y * scaleY;
            const cropW = cropBox.w * scaleX;
            const cropH = cropBox.h * scaleY;

            canvas.width = cropW;
            canvas.height = cropH;
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setCroppedUrl(url);
                    setResultFileName(file.name);
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
                setIsProcessing(false);
            }, file.type);
        } else {
            setIsProcessing(false);
            toast.error("Could not initialize canvas context.");
        }
    };

    const handleReset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (croppedUrl) URL.revokeObjectURL(croppedUrl);
        setFile(null);
        setPreviewUrl(null);
        setCroppedUrl(null);
        setRotation(0);
        setResultFileName("");
    };

    return (
        <ToolWrapper title="Image Cropper" description="Crop and rotate your images interactively entirely in your browser." accentColor="pink">
            {croppedUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                        <Crop className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Image Cropped!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Your cropped image is ready for download.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <img src={croppedUrl} alt="Cropped" className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = croppedUrl;
                                link.download = resultFileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 transition-colors"
                        >
                            Download Image
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Crop Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to crop"
                    description="Drag & drop a JPG, PNG, or WebP file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400">
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

                    {/* Toolbar */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Aspect Ratios Dropdown */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Aspect Ratio:</span>
                                <select
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(e.target.value === "free" ? "free" : parseFloat(e.target.value))}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                >
                                    <option value="free">Free</option>
                                    <option value={1}>1:1 (Square)</option>
                                    <option value={1.77777777778}>16:9 (Widescreen)</option>
                                    <option value={1.33333333333}>4:3 (Standard)</option>
                                    <option value={1.5}>3:2 (Classic Photo)</option>
                                    <option value={0.66666666667}>2:3 (Portrait Photo)</option>
                                    <option value={0.5625}>9:16 (Story/Reel)</option>
                                    <option value={1.25}>5:4</option>
                                    <option value={0.8}>4:5</option>
                                </select>
                            </div>

                            {/* Rotation */}
                            <button
                                onClick={() => {
                                    if (!imgRef.current) return;
                                    const img = imgRef.current;
                                    const canvas = document.createElement("canvas");
                                    const ctx = canvas.getContext("2d");
                                    if (!ctx) return;

                                    canvas.width = img.naturalHeight;
                                    canvas.height = img.naturalWidth;

                                    ctx.translate(canvas.width / 2, canvas.height / 2);
                                    ctx.rotate((90 * Math.PI) / 180);
                                    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

                                    const newUrl = canvas.toDataURL(file?.type || "image/png");
                                    setPreviewUrl(newUrl);
                                    setRotation(0); // Reset CSS rotation just in case
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all duration-200"
                            >
                                <RotateRight className="h-4 w-4" /> Rotate 90°
                            </button>
                        </div>

                        {/* Manual Inputs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Width (px)</label>
                                <input
                                    type="number"
                                    value={manualInputs.w}
                                    onChange={(e) => handleManualInputChange('w', e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Height (px)</label>
                                <input
                                    type="number"
                                    value={manualInputs.h}
                                    onChange={(e) => handleManualInputChange('h', e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">X Position</label>
                                <input
                                    type="number"
                                    value={manualInputs.x}
                                    onChange={(e) => handleManualInputChange('x', e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Y Position</label>
                                <input
                                    type="number"
                                    value={manualInputs.y}
                                    onChange={(e) => handleManualInputChange('y', e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interactive Crop Area */}
                    <div className="flex justify-center items-center p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-900 overflow-hidden min-h-[300px] relative">
                        <div
                            ref={containerRef}
                            className="relative inline-block max-w-full max-h-[400px] select-none"
                        >
                            {previewUrl && (
                                <img
                                    ref={imgRef}
                                    src={previewUrl}
                                    alt="Crop Preview"
                                    onLoad={() => setImageLoaded(true)}
                                    className="block max-w-full max-h-[400px] w-auto h-auto pointer-events-none"
                                />
                            )}

                            {/* Crop Overlay Box */}
                            <div
                                className="absolute border-2 border-pink-500 bg-pink-500/10 cursor-move"
                                style={{
                                    left: `${cropBox.x}%`,
                                    top: `${cropBox.y}%`,
                                    width: `${cropBox.w}%`,
                                    height: `${cropBox.h}%`,
                                }}
                                onMouseDown={(e) => handlePointerDown(e, "move")}
                                onTouchStart={(e) => handlePointerDown(e, "move")}
                            >
                                {/* Drag Handles */}
                                <div
                                    className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-white border border-pink-500 cursor-nwse-resize"
                                    onMouseDown={(e) => handlePointerDown(e, "tl")}
                                    onTouchStart={(e) => handlePointerDown(e, "tl")}
                                />
                                <div
                                    className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-white border border-pink-500 cursor-nesw-resize"
                                    onMouseDown={(e) => handlePointerDown(e, "tr")}
                                    onTouchStart={(e) => handlePointerDown(e, "tr")}
                                />
                                <div
                                    className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-white border border-pink-500 cursor-nesw-resize"
                                    onMouseDown={(e) => handlePointerDown(e, "bl")}
                                    onTouchStart={(e) => handlePointerDown(e, "bl")}
                                />
                                <div
                                    className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-white border border-pink-500 cursor-nwse-resize"
                                    onMouseDown={(e) => handlePointerDown(e, "br")}
                                    onTouchStart={(e) => handlePointerDown(e, "br")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleCrop}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <Crop className="h-5 w-5" />
                            {isProcessing ? "Cropping..." : "Crop Image"}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
