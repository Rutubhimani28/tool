"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,
    Collections
} from "@mui/icons-material";
import { PDFDocument } from "pdf-lib";

export default function PDFToWebP() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesCount, setPagesCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();

            // Check if encrypted using pdf-lib
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first using the Unlock PDF tool.");
                return;
            }

            setPagesCount(pdfDoc.getPageCount());
            setFile(selectedFile);
        } catch (error) {
            console.error("Error reading PDF file:", error);
            toast.error("Error reading PDF file. It might be corrupted.");
        }
    };

    const convertToWebP = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        const originalWarn = console.warn;
        console.warn = () => { };

        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;
            const zip = new JSZip();

            for (let i = 1; i <= pagesCount; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                // Create canvas element
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Fill with white background
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Render PDF page to canvas
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                // Convert canvas to blob
                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob((b) => resolve(b), "image/webp", 0.95)
                );

                if (blob) {
                    zip.file(`${file.name.replace(".pdf", "")}_page_${i}.webp`, blob);
                }

                setProgress(10 + Math.round((i / pagesCount) * 70));
            }

            setProgress(85);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            setProgress(95);

            const url = URL.createObjectURL(zipBlob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}.zip`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting PDF to WebP:", error);
            toast.error("An error occurred while converting the PDF to WebP.");
        } finally {
            console.warn = originalWarn;
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="PDF to WebP"
                description="Convert PDF pages into high-quality JPG images and download them as a ZIP file."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                            <div className="text-4xl">🖼️</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF to WebP Converted!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your images have been packaged into a ZIP file.
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
                                Download ZIP
                            </button>
                            <button
                                onClick={() => {
                                    URL.revokeObjectURL(resultUrl);
                                    setResultUrl(null);
                                    setResultFileName("");
                                }}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Convert Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to convert"
                        description="Drag & drop a PDF file here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400 font-bold text-xs">
                                    PDF
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {pagesCount} pages
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
                                        <span>Converting pages to WebP...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-pink-500 h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={convertToWebP}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200"
                                >
                                    <Collections className="h-5 w-5" />
                                    Convert to WebP (ZIP)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Convert PDF to WebP Images</h2>
                    <p className="text-lg mb-8">
                        Extract high‑quality WebP images from each page of your PDF directly in the browser. Ideal for creating lightweight graphics for web use while preserving visual fidelity.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Convert PDF to WebP?</h3>
                    <p className="mb-6">
                        Converting the pages of a PDF document into individual WebP image files. WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Convert PDF to WebP</h3>
                    <p className="mb-4">Converting your PDF to WebP format is easy:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload your PDF document.</li>
                        <li><strong>Adjust settings:</strong> Select the specific pages you want to convert, or choose to convert the entire document.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Convert to WebP&quot; to extract the pages and download them as high-quality, lightweight WebP images.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Web Optimization Benefits</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Faster Page Loads:</strong> WebP images are significantly smaller than equivalent JPG or PNG files (often 25-34% smaller), making them perfect for fast-loading websites and improving your Core Web Vitals.</li>
                        <li><strong>Bandwidth Savings:</strong> If you are hosting extracted PDF pages on a server, converting them to WebP drastically reduces your bandwidth consumption.</li>
                        <li><strong>Easy Integration:</strong> Quickly convert PDF reports, brochures, or presentations into web-ready images for your site or blog.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Quality vs. File Size</h3>
                    <p className="mb-6">
                        WebP provides a unique advantage by offering excellent image quality even at high compression rates. Our tool extracts your PDF pages and converts them to WebP using a balanced compression setting, ensuring that text remains readable and graphics stay crisp while keeping the file size incredibly small.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your files are processed locally in your browser and are not uploaded to our servers. This can help keep sensitive documents on your device during processing. This can be useful when working with documents that contain sensitive or personal information.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Supported Files and Limitations</h3>
                    <p className="mb-6">
                        Our tool supports standard file formats. Because processing takes place locally in your browser, the tool does not rely on a server-side upload limit. However, very large or complex files may require more memory and processing time depending on your device and browser. Note that password-protected PDFs must be unlocked before they can be processed.
                    </p>

                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/split-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Split PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract specific pages or split a PDF into separate files.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/extract-images-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Extract Images from PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all embedded images from a PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/webp-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">WebP to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert WebP images into a single PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/word-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Word to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert Microsoft Word documents (.docx) to PDF format.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
