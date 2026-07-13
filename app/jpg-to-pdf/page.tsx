"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import {
    Delete,
    ArrowUpward,
    ArrowDownward,
    Image as ImageIcon,
} from "@mui/icons-material";

interface UploadedImage {
    id: string;
    file: File;
    previewUrl: string;
}

export default function JPGToPDF() {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFilesSelected = (selectedFiles: File[]) => {
        const newImages = selectedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (id: string) => {
        setImages((prev) => {
            const target = prev.find((img) => img.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((img) => img.id !== id);
        });
    };

    const moveImage = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === images.length - 1) return;

        const newImages = [...images];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newImages[index];
        newImages[index] = newImages[targetIndex];
        newImages[targetIndex] = temp;
        setImages(newImages);
    };

    const convertToPDF = async () => {
        if (images.length === 0) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const pdfDoc = await PDFDocument.create();
            let currentImageIndex = 0;

            for (const imgObj of images) {
                const arrayBuffer = await imgObj.file.arrayBuffer();
                const imageBytes = new Uint8Array(arrayBuffer);
                let embeddedImage;

                const fileType = imgObj.file.type;
                if (fileType === "image/png") {
                    embeddedImage = await pdfDoc.embedPng(imageBytes);
                } else if (fileType === "image/jpeg" || fileType === "image/jpg") {
                    embeddedImage = await pdfDoc.embedJpg(imageBytes);
                } else {
                    try {
                        embeddedImage = await pdfDoc.embedJpg(imageBytes);
                    } catch {
                        console.warn(`Skipping unsupported image format: ${imgObj.file.name}`);
                        continue;
                    }
                }

                const { width, height } = embeddedImage.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });

                currentImageIndex++;
                setProgress(10 + Math.round((currentImageIndex / images.length) * 80));
            }

            const pdfBytes = await pdfDoc.save();
            setProgress(95);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName("images_converted.pdf");
            setImages([]);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting images to PDF:", error);
            toast.error("An error occurred while converting the images to PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="JPG to PDF"
            description="Convert JPG and PNG images into a single PDF document in your preferred order."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <div className="text-4xl">📄</div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Images to PDF Converted!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your images have been combined into a PDF.
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
                            Convert More
                        </button>
                    </div>
                </div>
            ) : images.length === 0 ? (
                <DropZone
                    onFilesSelected={handleFilesSelected}
                    accept="image/jpeg,image/png"
                    multiple={true}
                    title="Select images to convert"
                    description="Drag & drop JPG or PNG files here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {images.map((imgObj, index) => (
                            <div
                                key={imgObj.id}
                                className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden"
                            >
                                <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    { }
                                    <img
                                        src={imgObj.previewUrl}
                                        alt={imgObj.file.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => moveImage(index, "up")}
                                            disabled={index === 0 || isProcessing}
                                            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                                        >
                                            <ArrowUpward className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => moveImage(index, "down")}
                                            disabled={index === images.length - 1 || isProcessing}
                                            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                                        >
                                            <ArrowDownward className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(imgObj.id)}
                                            disabled={isProcessing}
                                            className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-all"
                                        >
                                            <Delete className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3 min-w-0">
                                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                                        {imgObj.file.name}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                        {(imgObj.file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add More Images */}
                    <div className="flex justify-center">
                        <label className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
                            Add More Images
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/jpeg,image/png"
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
                                    <span>Converting images...</span>
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
                                onClick={convertToPDF}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200"
                            >
                                <ImageIcon className="h-5 w-5" />
                                Convert to PDF ({images.length} images)
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
