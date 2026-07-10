"use client";

import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import mammoth from "mammoth";
import confetti from "canvas-confetti";
import { Description } from "@mui/icons-material";

export default function WordToPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        setFile(selectedFiles[0]);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            // Convert docx to HTML using mammoth
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const htmlContent = result.value;
            setProgress(60);

            // Dynamically import html2pdf.js to avoid SSR issues
            const html2pdf = (await import("html2pdf.js")).default;
            setProgress(75);

            // Create a temporary container to hold the HTML content
            const container = document.createElement("div");
            container.innerHTML = htmlContent;
            container.style.padding = "40px";
            container.style.fontFamily = "Arial, sans-serif";
            container.style.lineHeight = "1.6";
            container.style.color = "#333";
            container.style.backgroundColor = "#fff";
            container.style.width = "800px"; // standard width for rendering

            // Apply basic styling to headings and paragraphs
            const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
            headings.forEach((h) => {
                (h as HTMLElement).style.marginTop = "20px";
                (h as HTMLElement).style.marginBottom = "10px";
                (h as HTMLElement).style.fontWeight = "bold";
            });

            const paragraphs = container.querySelectorAll("p");
            paragraphs.forEach((p) => {
                (p as HTMLElement).style.marginBottom = "12px";
            });

            const options = {
                margin: 10,
                filename: `${file.name.replace(".docx", "").replace(".doc", "")}.pdf`,
                image: { type: "jpeg" as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm" as const, format: "a4", orientation: "portrait" as const },
            };

            setProgress(85);
            await html2pdf().from(container).set(options).save();
            setProgress(100);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting Word to PDF:", error);
            alert("An error occurred while converting the Word document.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Word to PDF"
            description="Convert Microsoft Word documents (.docx) to high-quality PDF files."
        >
            {!file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".docx,.doc"
                    multiple={false}
                    title="Select Word document to convert"
                    description="Drag & drop a .docx or .doc file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs">
                                DOCX
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

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Converting to PDF...</span>
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
                                onClick={handleConvert}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200"
                            >
                                <Description className="h-5 w-5" />
                                Convert to PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
