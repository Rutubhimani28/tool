"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { Collections, ArrowRightAlt } from "@mui/icons-material";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";

import { TextSnippet } from "@mui/icons-material";

export default function PDFToText() {
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

    const extractText = async () => {
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
            let fullText = "";

            for (let i = 1; i <= pagesCount; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
                setProgress(10 + Math.round((i / pagesCount) * 70));
            }

            if (!fullText.trim()) {
                toast.error("No text found in this PDF.");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            setProgress(85);
            const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
            setProgress(95);

            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}.txt`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error extracting text:", error);
            toast.error("An error occurred while extracting text.");
        } finally {
            console.warn = originalWarn;
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="PDF to Text"
                description="Extract all text from a PDF document and download it as a TXT file."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                            <div className="text-4xl">📝</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Text Extracted!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your text has been saved into a TXT file.
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
                                Download TXT
                            </button>
                            <button
                                onClick={() => {
                                    URL.revokeObjectURL(resultUrl);
                                    setResultUrl(null);
                                    setResultFileName("");
                                }}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Extract Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to extract text from"
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
                                        <span>Extracting text...</span>
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
                                    onClick={extractText}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200"
                                >
                                    <TextSnippet className="h-5 w-5" />
                                    Extract Text (TXT)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Extract Text from PDF Free Online</h2>
                    <p className="text-lg mb-8">
                        Instantly extract all readable text from your PDF documents and save it as a plain TXT file. Our PDF to Text converter is perfect for pulling out content from reports, articles, and books so you can edit, search, or reuse the text without formatting constraints.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why Convert PDF to Text?</h3>
                    <p className="mb-6">
                        PDFs are designed to preserve layout and formatting, which makes extracting text for editing or analysis difficult. Converting a PDF to a plain text (.txt) file strips away all the complex formatting, images, and styling, leaving you with pure, unformatted text. This is ideal for developers, researchers, and anyone who needs to quickly copy large amounts of text or process document content programmatically.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Extract Text from PDF</h3>
                    <p className="mb-4">Follow these simple steps to get your plain text file:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your PDF:</strong> Drag and drop your document into the upload area above.</li>
                        <li><strong>Extract Text:</strong> Click the extract button. Our tool will scan every page and pull out all readable text.</li>
                        <li><strong>Download TXT:</strong> Download the resulting plain text file to your device instantly.</li>
                    </ol>

                                        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online tools that upload your sensitive documents to remote cloud servers, <strong>our tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-6 mb-12">
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Will this tool extract text from scanned images?</h4>
                            <p>No, this tool extracts native text embedded in the PDF document. If your PDF is a scanned image of a document, it requires OCR (Optical Character Recognition) technology, which is not currently supported by this browser-based tool.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Will the formatting be preserved?</h4>
                            <p>No, the purpose of a TXT file is to contain plain text without any formatting (like bold, italics, or tables). If you need to preserve formatting, we recommend using our PDF to Word converter instead.</p>
                        </div>
                    </div>

                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/pdf-to-word" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to Word</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert PDF documents into editable Word files.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/pdf-to-csv" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to CSV</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract tabular data from PDF to CSV format.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/extract-images-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Extract Images</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all embedded images from a PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/split-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Split PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract specific pages or split a PDF into separate files.</p>
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
