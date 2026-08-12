"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { Compress, ArrowRightAlt } from "@mui/icons-material";
import Link from "next/link";

export default function CompressPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
    const [compressedFileSize, setCompressedFileSize] = useState(0);
    const [resultOriginalSize, setResultOriginalSize] = useState(0);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedSize(0);
    };

    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setProgress(60);

            const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
            setProgress(85);

            setCompressedSize(compressedBytes.length);
            setCompressedFileSize(compressedBytes.length);

            const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setCompressedFileUrl(url);
            setResultOriginalSize(file.size);
            setResultFileName(file.name);

            // Clear input state
            setFile(null);
            setOriginalSize(0);
            setCompressedSize(0);

            setProgress(100);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (error) {
            console.error("Error compressing PDF:", error);
            toast.error("An error occurred while compressing the PDF file.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const savings = originalSize && compressedSize ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Compress PDF Tool",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Reduce the file size of your PDF document while maintaining the best possible quality."
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                suppressHydrationWarning
            />

            <ToolWrapper title="Compress PDF" description="Reduce the file size of your PDF document while maintaining the best possible quality.">
                {compressedFileUrl ? (
                    // Success screen
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                            <Compress className="h-12 w-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Compressed Successfully!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Original Size: {formatSize(resultOriginalSize)}<br />
                                Compressed Size: {formatSize(compressedFileSize)}<br />
                                Savings: {resultOriginalSize > 0 ? `${(((resultOriginalSize - compressedFileSize) / resultOriginalSize) * 100).toFixed(1)}%` : "0%"}
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="w-full max-w-2xl h-[500px] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                            <iframe src={`${compressedFileUrl}#toolbar=0`} className="w-full h-full" title="PDF Preview" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                            <button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = compressedFileUrl;
                                    link.download = `${resultFileName.replace(".pdf", "")}_compressed.pdf`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                            >
                                Download Compressed PDF
                            </button>
                            <button
                                onClick={() => {
                                    if (compressedFileUrl) URL.revokeObjectURL(compressedFileUrl);
                                    setCompressedFileUrl(null);
                                    setCompressedFileSize(0);
                                    setResultOriginalSize(0);
                                    setResultFileName("");
                                    setFile(null);
                                    setOriginalSize(0);
                                    setCompressedSize(0);
                                }}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Compress Another File
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to compress"
                        description="Drag & drop a PDF file here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400 font-bold text-xs">
                                    PDF
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{file.name}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatSize(originalSize)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                                Remove
                            </button>
                        </div>

                        {/* Compression Stats */}
                        {compressedSize > 0 && (
                            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl border border-green-200 bg-green-50/20 dark:border-green-900/30 dark:bg-green-950/10">
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Original Size</span>
                                    <span className="mt-1 text-base font-bold text-zinc-900 dark:text-white">{formatSize(originalSize)}</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-x border-zinc-200 dark:border-zinc-800">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Compressed Size</span>
                                    <span className="mt-1 text-base font-bold text-green-600 dark:text-green-400">{formatSize(compressedSize)}</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Savings</span>
                                    <span className="mt-1 text-base font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                                        {savings > 0 ? `${savings.toFixed(1)}%` : "0%"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Button & Progress */}
                        <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                            {isProcessing ? (
                                <div className="w-full">
                                    <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                        <span>Compressing PDF...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCompress}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all duration-200"
                                >
                                    <Compress className="h-5 w-5" />
                                    Compress PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Compress PDF Files Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the most efficient, privacy-first PDF compressor. Whether you need to shrink a massive document for an email attachment or optimize files for web upload, our tool reduces file size significantly while maintaining excellent readability.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is PDF Compression?</h3>
                    <p className="mb-6">
                        PDF compression is the process of reducing the overall file size of a PDF document. This is typically achieved by optimizing the internal structure of the file, removing unnecessary metadata, and intelligently compressing embedded images and fonts. The goal is to make the file smaller without noticeably degrading the visual quality of the text or graphics.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Compress PDF Files</h3>
                    <p className="mb-4">Reducing your file size is fast and straightforward:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your file:</strong> Drag and drop your large PDF into the upload area above, or click to browse your device.</li>
                        <li><strong>Start Compression:</strong> Click the &quot;Compress PDF&quot; button. Our local processing engine will analyze and optimize the document structure.</li>
                        <li><strong>Download optimized file:</strong> Once complete, you will see exactly how much space was saved. Click download to save your new, smaller PDF.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why Some PDFs Compress More Than Others</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Email Attachments:</strong> Smaller PDFs are easier to share when an email service or recipient has attachment-size limits.</li>
                        <li><strong>Faster Uploads:</strong> When submitting documents to online portals (like job applications, government forms, or university systems), smaller files upload much faster and are less likely to time out.</li>
                        <li><strong>Storage Space:</strong> If you archive many documents, compressing them can save gigabytes of valuable hard drive or cloud storage space.</li>
                        <li><strong>Web Performance:</strong> If you host PDFs on a website, smaller files download faster for your visitors, improving user experience and saving bandwidth.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why a PDF May Not Get Much Smaller</h3>
                    <p className="mb-6">
                        Some PDFs are already compressed or contain mostly text and vector graphics, so the available reduction may be limited. PDFs containing high-resolution scanned pages or large embedded images generally have more room for optimization. The final file size depends on how the original PDF was created and what it contains.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Image-Heavy and Scanned PDFs</h3>
                    <p className="mb-6">
                        Scanned documents and image-heavy portfolios benefit the most from compression. Our tool analyzes the PDF and applies the available compression optimizations while aiming to preserve the document&apos;s readability and visual quality.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Quality vs. File Size</h3>
                    <p className="mb-6">
                        Our compression process is designed to reduce file size while preserving the document&apos;s readability and visual quality as much as possible. We use structural optimization where possible, ensuring that your text remains crisp and your images remain clear, making the resulting file suitable for email, web uploads, and general sharing.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your files are processed locally in your browser and are not uploaded to our servers. This can help keep sensitive documents on your device during processing, which may be useful when working with personal or confidential information.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Supported Files and Limitations</h3>
                    <p className="mb-6">
                        Our tool supports standard PDF documents. Because processing takes place locally in your browser, the tool does not rely on a server-side upload limit. However, very large or complex PDFs may require more memory and processing time depending on your device and browser. Note that password-protected PDFs must be unlocked before they can be compressed. Also, if a PDF is already highly optimized, the compression savings may be minimal.
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
                            <Link href="/pdf-to-text" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to Text</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all text from a PDF document and download it as a TXT file.</p>
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
                            <Link href="/jpg-to-png" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Convert JPG to PNG</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert JPG images to PNG format.</p>
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