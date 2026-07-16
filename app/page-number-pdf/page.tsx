"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument, rgb, PDFEmbeddedPage, PDFPage } from "pdf-lib";
import confetti from "canvas-confetti";
import { FormatListNumbered, VerticalAlignBottom, VerticalAlignTop } from "@mui/icons-material";

const calculatePageNumberPosition = (
    width: number,
    height: number,
    margin: number,
    textWidth: number,
    fontSize: number,
    verticalPosition: "top" | "bottom",
    horizontalPosition: "left" | "center" | "right"
) => {
    let textX = width / 2 - textWidth / 2;
    if (horizontalPosition === "left") textX = 20;
    if (horizontalPosition === "right") textX = width - textWidth - 20;

    let textY = 0;
    if (verticalPosition === "top") {
        textY = height + (margin / 2) - (fontSize / 2);
    } else {
        textY = (margin / 2) - (fontSize / 2);
    }

    return { x: textX, y: textY };
};

const addPageMargin = (
    pdfDoc: PDFDocument,
    embeddedPage: PDFEmbeddedPage,
    margin: number,
    verticalPosition: "top" | "bottom"
): PDFPage => {
    const { width, height } = embeddedPage;
    const newPage = pdfDoc.addPage([width, height + margin]);

    let pageY = 0;
    if (verticalPosition === "top") {
        pageY = 0; // Original page starts at bottom
    } else {
        pageY = margin; // Original page shifted up
    }

    newPage.drawPage(embeddedPage, {
        x: 0,
        y: pageY,
        width,
        height,
    });

    return newPage;
};

const createNumberedPdf = async (
    arrayBuffer: ArrayBuffer,
    verticalPosition: "top" | "bottom",
    horizontalPosition: "left" | "center" | "right",
    setProgress: (progress: number) => void
) => {
    setProgress(40);

    const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    if (originalPdf.isEncrypted) {
        throw new Error("This PDF is password-protected. Please unlock it first.");
    }

    const pageCount = originalPdf.getPageCount();
    const indices = Array.from({ length: pageCount }, (_, i) => i);

    const pdfDoc = await PDFDocument.create();
    const embeddedPages = await pdfDoc.embedPdf(arrayBuffer, indices);

    setProgress(60);

    const margin = 20;
    const fontSize = 12;

    embeddedPages.forEach((embeddedPage, index) => {
        const { width, height } = embeddedPage;

        const newPage = addPageMargin(pdfDoc, embeddedPage, margin, verticalPosition);

        const text = `${index + 1}`;
        const textWidth = text.length * (fontSize / 2); // Approximate width

        const { x, y } = calculatePageNumberPosition(
            width, height, margin, textWidth, fontSize, verticalPosition, horizontalPosition
        );

        newPage.drawText(text, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
    });

    setProgress(80);

    return await pdfDoc.save();
};

export default function PageNumberPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [verticalPosition, setVerticalPosition] = useState<"top" | "bottom">("bottom");
    const [horizontalPosition, setHorizontalPosition] = useState<"left" | "center" | "right">("center");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

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

            setTotalPages(pdf.numPages);

            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.0 });

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

            const pdfBytes = await createNumberedPdf(
                arrayBuffer,
                verticalPosition,
                horizontalPosition,
                setProgress
            );

            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`numbered_${file.name}`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error: any) {
            console.error("Error saving numbered PDF:", error);
            toast.error(error.message || "An error occurred while saving the numbered PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Add Page Numbers to PDF"
            description="Easily insert page numbers into your PDF document."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <FormatListNumbered className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Page Numbers Added!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been numbered and is ready for download.
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
                            className="flex-1 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors"
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
                            Number Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to add page numbers"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 font-bold text-xs">
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating preview...</p>
                            </div>
                        ) : previewDataUrl ? (
                            <div className="relative flex items-center justify-center bg-zinc-200 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden p-4 min-h-[300px]">
                                <div className="relative inline-block max-w-full max-h-[500px]">
                                    {/* Margin Simulation (Top) */}
                                    {verticalPosition === "top" && (
                                        <div className="w-full bg-white flex items-center" style={{ height: '20px', justifyContent: horizontalPosition === "left" ? "flex-start" : horizontalPosition === "right" ? "flex-end" : "center", paddingLeft: horizontalPosition === "left" ? "20px" : "0", paddingRight: horizontalPosition === "right" ? "20px" : "0" }}>
                                            <span className="font-medium text-black text-xs sm:text-sm">1</span>
                                        </div>
                                    )}
                                    <img
                                        src={previewDataUrl}
                                        alt="PDF Preview"
                                        className="max-h-[500px] w-auto object-contain shadow-md"
                                    />
                                    {/* Margin Simulation (Bottom) */}
                                    {verticalPosition === "bottom" && (
                                        <div className="w-full bg-white flex items-center" style={{ height: '20px', justifyContent: horizontalPosition === "left" ? "flex-start" : horizontalPosition === "right" ? "flex-end" : "center", paddingLeft: horizontalPosition === "left" ? "20px" : "0", paddingRight: horizontalPosition === "right" ? "20px" : "0" }}>
                                            <span className="font-medium text-black text-xs sm:text-sm">1</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Settings */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Position</h4>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setVerticalPosition("top")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${verticalPosition === "top" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"} transition-colors`}
                                >
                                    <VerticalAlignTop className="h-4 w-4" /> Top
                                </button>
                                <button
                                    onClick={() => setVerticalPosition("bottom")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${verticalPosition === "bottom" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"} transition-colors`}
                                >
                                    <VerticalAlignBottom className="h-4 w-4" /> Bottom
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setHorizontalPosition("left")}
                                    className={`flex-1 py-2 rounded-xl border text-sm font-medium ${horizontalPosition === "left" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"} transition-colors`}
                                >
                                    Left
                                </button>
                                <button
                                    onClick={() => setHorizontalPosition("center")}
                                    className={`flex-1 py-2 rounded-xl border text-sm font-medium ${horizontalPosition === "center" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"} transition-colors`}
                                >
                                    Center
                                </button>
                                <button
                                    onClick={() => setHorizontalPosition("right")}
                                    className={`flex-1 py-2 rounded-xl border text-sm font-medium ${horizontalPosition === "right" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"} transition-colors`}
                                >
                                    Right
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Adding page numbers...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-indigo-500 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all duration-200"
                            >
                                <FormatListNumbered className="h-5 w-5" />
                                Add Page Numbers & Download
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
