"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import confetti from "canvas-confetti";
import { BrandingWatermark, TextFields, Opacity } from "@mui/icons-material";

export default function WatermarkPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(0.5);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setIsLoadingPreview(true);
        setPreviewDataUrl(null);

        const originalWarn = console.warn;
        console.warn = () => { };

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;

            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.0 }); // Use scale 1.0 for better quality preview

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                setPreviewDataUrl(canvas.toDataURL());
            }
        } catch (error) {
            console.error("Error loading PDF for preview:", error);
            toast.error("Error loading PDF preview.");
        } finally {
            console.warn = originalWarn;
            setIsLoadingPreview(false);
        }
    };

    const handleSave = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first.");
                setIsProcessing(false);
                setProgress(0);
                return;
            }
            const pages = pdfDoc.getPages();
            setProgress(60);

            pages.forEach((page) => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - (watermarkText.length * 15) / 2, // Approximate centering
                    y: height / 2,
                    size: 50,
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: opacity,
                    rotate: degrees(45),
                });
            });
            setProgress(80);

            const pdfBytes = await pdfDoc.save();
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`watermarked_${file.name}`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error saving watermarked PDF:", error);
            toast.error("An error occurred while saving the watermarked PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Add Watermark to PDF"
            description="Stamp an image or text over your PDF in seconds."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
                        <BrandingWatermark className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Watermark Added Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been watermarked and is ready for download.
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
                            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors"
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
                            Watermark Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to watermark"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs">
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
                            onClick={() => {
                                setFile(null);
                                setPreviewDataUrl(null);
                            }}
                            disabled={isProcessing}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Live Preview */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Live Preview (First Page)</h4>
                        {isLoadingPreview ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating preview...</p>
                            </div>
                        ) : previewDataUrl ? (
                            <div className="relative flex items-center justify-center bg-zinc-200 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden p-4 min-h-[300px]">
                                <div className="relative inline-block max-w-full max-h-[500px]">
                                    <img
                                        src={previewDataUrl}
                                        alt="PDF Preview"
                                        className="max-h-[500px] w-auto object-contain shadow-md"
                                    />
                                    {/* CSS Overlay for Watermark */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                                    >
                                        <span
                                            className="font-bold whitespace-nowrap"
                                            style={{
                                                color: "rgb(128, 128, 128)",
                                                opacity: opacity,
                                                transform: "rotate(-45deg)", // CSS rotate is opposite of pdf-lib degrees
                                                fontSize: "clamp(20px, 5vw, 50px)", // Responsive font size
                                            }}
                                        >
                                            {watermarkText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Watermark Settings */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Watermark Settings</h4>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <TextFields className="h-4 w-4" /> Text
                            </label>
                            <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                                placeholder="Enter watermark text"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <Opacity className="h-4 w-4" /> Opacity: {Math.round(opacity * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Applying watermark...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200"
                            >
                                <BrandingWatermark className="h-5 w-5" />
                                Add Watermark & Download
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
