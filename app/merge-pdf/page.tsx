"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import Link from "next/link";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import {
    Delete,
    ArrowUpward,
    ArrowDownward,
    Merge as MergeIcon,
    ArrowRightAlt,
} from "@mui/icons-material";

interface UploadedFile {
    id: string;
    file: File;
    pagesCount: number;
}

export default function MergePDF() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);
    const [mergedFileSize, setMergedFileSize] = useState(0);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        const newFiles: UploadedFile[] = [];
        const originalWarn = console.warn;
        console.warn = () => { };
        try {
            const { PDFDocument } = await import("pdf-lib");
            for (const file of selectedFiles) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    if (pdfDoc.isEncrypted) {
                        toast.error(`This PDF (${file.name}) is password-protected. Please unlock it first.`);
                        continue;
                    }
                    const pagesCount = pdfDoc.getPageCount();
                    newFiles.push({
                        id: Math.random().toString(36).substring(7),
                        file,
                        pagesCount,
                    });
                } catch (error) {
                    console.error("Error reading PDF file:", error);
                    toast.error(`Error reading ${file.name}. It might be corrupted.`);
                }
            }
        } finally {
            console.warn = originalWarn;
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const moveFile = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === files.length - 1) return;

        const newFiles = [...files];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newFiles[index];
        newFiles[index] = newFiles[targetIndex];
        newFiles[targetIndex] = temp;
        setFiles(newFiles);
    };

    const mergePDFs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const { PDFDocument } = await import("pdf-lib");
            const mergedPdf = await PDFDocument.create();
            let currentFileIndex = 0;

            const originalWarn = console.warn; console.warn = () => { }; try {
                for (const uploadedFile of files) {
                    const arrayBuffer = await uploadedFile.file.arrayBuffer();
                    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    const copiedPages = await mergedPdf.copyPages(
                        srcPdf,
                        srcPdf.getPageIndices()
                    );
                    copiedPages.forEach((page) => mergedPdf.addPage(page));

                    currentFileIndex++;
                    setProgress(10 + Math.round((currentFileIndex / files.length) * 80));
                }

            } finally { console.warn = originalWarn; } const mergedPdfBytes = await mergedPdf.save();
            setProgress(95);

            const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            if (mergedFileUrl) {
                URL.revokeObjectURL(mergedFileUrl);
            }
            setMergedFileUrl(url);
            setMergedFileSize(mergedPdfBytes.length);
            setFiles([]); // Clear input files

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error merging PDFs:", error);
            toast.error("An error occurred while merging the PDF files.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const handleDownload = () => {
        if (!mergedFileUrl) return;
        const link = document.createElement("a");
        link.href = mergedFileUrl;
        link.download = "merged_document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetTool = () => {
        if (mergedFileUrl) {
            URL.revokeObjectURL(mergedFileUrl);
        }
        setMergedFileUrl(null);
        setMergedFileSize(0);
        setFiles([]);
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Merge PDF Tool",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Combine multiple PDF files into a single document in your preferred order."
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ToolWrapper
                title="Merge PDF"
                description="Combine multiple PDF files into a single document in your preferred order."
            >
                {mergedFileUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                            <MergeIcon className="h-12 w-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDFs Merged Successfully!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your files have been combined into a single document ({(mergedFileSize / 1024 / 1024).toFixed(2)} MB).
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="w-full max-w-2xl h-[500px] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                            <iframe src={`${mergedFileUrl}#toolbar=0`} className="w-full h-full" title="PDF Preview" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                            <button
                                onClick={handleDownload}
                                className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                            >
                                Download Merged PDF
                            </button>
                            <button
                                onClick={resetTool}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Merge More Files
                            </button>
                        </div>
                    </div>
                ) : files.length === 0 ? (
                    <DropZone
                        onFilesSelected={handleFilesSelected}
                        accept=".pdf"
                        multiple={true}
                        title="Select PDF files to merge"
                        description="Drag & drop multiple PDF files here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* File List */}
                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                            {files.map((fileObj, index) => (
                                <div
                                    key={fileObj.id}
                                    className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold text-xs">
                                            PDF
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                                {fileObj.file.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB • {fileObj.pagesCount} pages
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => moveFile(index, "up")}
                                            disabled={index === 0 || isProcessing}
                                            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        >
                                            <ArrowUpward className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => moveFile(index, "down")}
                                            disabled={index === files.length - 1 || isProcessing}
                                            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        >
                                            <ArrowDownward className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => removeFile(fileObj.id)}
                                            disabled={isProcessing}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                        >
                                            <Delete className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add More Files */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
                                Add More Files
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept=".pdf"
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
                                        <span>Merging PDFs...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-red-500 h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={mergePDFs}
                                    disabled={files.length < 2}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 disabled:shadow-none transition-all duration-200"
                                >
                                    <MergeIcon className="h-5 w-5" />
                                    Merge PDFs ({files.length} files)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Merge PDF Files Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the fastest, most secure way to combine PDF files online. Whether you are compiling monthly reports, assembling a portfolio, or joining scanned documents, our Merge PDF tool makes it effortless and completely private.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is PDF Merging?</h3>
                    <p className="mb-6">
                        Merging PDFs is the process of taking two or more separate PDF documents and combining them sequentially into a single, unified file. This is an essential document management task that helps keep related information together, making it easier to store, share, and print.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Merge PDF Files</h3>
                    <p className="mb-4">Combining your documents is incredibly simple:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Drag and drop multiple PDF files into the upload area, or click to select them from your device.</li>
                        <li><strong>Arrange the order:</strong> Once uploaded, you will see a list of your files. Use the up and down arrows to rearrange them into the exact sequence you want them to appear in the final document.</li>
                        <li><strong>Merge and Download:</strong> Click the &quot;Merge PDFs&quot; button. Our local processing engine will instantly stitch the files together. You can then preview the merged document and download it to your device.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why should you merge PDFs?</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Better Organization:</strong> Instead of managing dozens of loose files (like individual invoices or receipts for a tax year), combine them into a single, organized master document.</li>
                        <li><strong>Easier Sharing:</strong> Emailing one comprehensive PDF is much more professional and less confusing for the recipient than attaching multiple separate files.</li>
                        <li><strong>Streamlined Printing:</strong> Sending one large file to the printer is faster and ensures pages are printed in the correct order without interruption.</li>
                        <li><strong>Portfolio Creation:</strong> Combine your resume, cover letter, and work samples into a single, polished application package.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online tools that upload your sensitive documents to remote cloud servers, <strong>our Merge PDF tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Supported Files and Limitations</h3>
                    <p className="mb-6">
                        Our tool supports standard PDF documents. Because processing happens locally, there are no strict file size limits imposed by a server. You can merge as many files as your device&apos;s memory can handle. Note that password-protected PDFs must be unlocked before they can be merged.
                    </p>
                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/page-number-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Page Number PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Easily insert page numbers into your PDF document.</p>
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
                            <Link href="/pdf-to-text" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to Text</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all text from a PDF document and download it as a TXT file.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/pdf-to-jpg" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to JPG</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract pages of a PDF as high-quality JPG images.</p>
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
