"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,
 Compress, Photo } from "@mui/icons-material";

export default function ImageCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setCompressedUrl(null);
    };

    const handleCompress = () => {
        if (!file) return;
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setIsProcessing(false);
                    toast.error("Could not initialize canvas context.");
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // If compression makes file larger, keep original
                            if (blob.size >= originalSize) {
                                setCompressedUrl(previewUrl);
                                setCompressedSize(originalSize);
                                setResultFileName(file.name);
                            } else {
                                const url = URL.createObjectURL(blob);
                                setCompressedUrl(url);
                                setCompressedSize(blob.size);
                                setResultFileName(
                                    file.name.replace(/\.[^/.]+$/, "") +
                                    (format === "image/jpeg" ? "_compressed.jpg" : "_compressed.webp")
                                );
                            }
                            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        }
                        setIsProcessing(false);
                    },
                    format,
                    0.75
                );
            };
            img.onerror = () => {
                setIsProcessing(false);
                toast.error("Failed to load image file.");
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const savings = originalSize && compressedSize ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100) : 0;

    const handleReset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        setFile(null);
        setPreviewUrl(null);
        setCompressedUrl(null);
        setOriginalSize(0);
        setCompressedSize(0);
        setResultFileName("");
    };

    return (
        <>
            <ToolWrapper title="Image Compressor" description="Compress JPG, PNG, or WebP images entirely in your browser." accentColor="green" className="space-y-8">
            {compressedUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                        <Compress className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Image Compressed!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Original Size: {formatSize(originalSize)}<br />
                            Compressed Size: {formatSize(compressedSize)}<br />
                            Savings: {savings > 0 ? `${savings.toFixed(1)}%` : "0%"}
                        </p>
                    </div>
                    <div className="flex gap-4 w-full max-w-lg mt-2">
                        <div className="flex-1 text-center">
                            <span className="text-xs text-zinc-400">Original</span>
                            <div className="mt-1 aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                                {previewUrl && <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />}
                            </div>
                        </div>
                        <div className="flex-1 text-center">
                            <span className="text-xs text-green-500 font-medium">Compressed</span>
                            <div className="mt-1 aspect-video rounded-xl border border-green-200 dark:border-green-900/30 overflow-hidden bg-green-50/5 dark:bg-green-950/5 flex items-center justify-center">
                                {compressedUrl && <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = compressedUrl!;
                                link.download = resultFileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                        >
                            Download Image
                        </button>
                        <button onClick={handleReset} className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors">
                            Compress Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to compress"
                    description="Drag & drop a JPG, PNG, or WebP file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400">
                                <Photo className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{file.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatSize(originalSize)}</p>
                            </div>
                        </div>
                        <button onClick={handleReset} className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                            Remove
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Output Format</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFormat("image/jpeg")}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${format === "image/jpeg" ? "bg-green-500 border-green-500 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
                                >
                                    JPG (Best for photos)
                                </button>
                                <button
                                    onClick={() => setFormat("image/webp")}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${format === "image/webp" ? "bg-green-500 border-green-500 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
                                >
                                    WebP (Best compression)
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleCompress}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <Compress className="h-5 w-5" />
                            {isProcessing ? "Compressing..." : "Compress Image"}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>

                        {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Compress Images Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the fastest, most secure way to reduce the file size of your JPG, PNG, and WebP images online. Whether you are a professional, student, or casual user, our tool makes it effortless and completely private.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Compress Images?</h3>
                    <p className="mb-6">
                        Reducing the file size of images while maintaining visual quality. This is an essential task that helps you manage your files more effectively, making them easier to store, share, and use on websites.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Compress Images</h3>
                    <p className="mb-4">Using our tool is incredibly simple:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload your bulky JPG, PNG, or WebP images.</li>
                        <li><strong>Adjust settings:</strong> Select your desired output format (JPG or WebP) for the best compression results.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Compress Image&quot; to let our smart algorithm reduce the file size, then download the optimized image.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why should you use this tool?</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Faster Web Loading:</strong> Smaller images load much faster on websites, improving user experience and SEO rankings.</li>
                        <li><strong>Save Storage Space:</strong> Free up valuable space on your device, hard drive, or cloud storage.</li>
                        <li><strong>Easier Sharing:</strong> Send images via email or messaging apps without hitting frustrating file size limits.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online tools that upload your sensitive documents to remote cloud servers, <strong>our tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Supported Files and Limitations</h3>
                    <p className="mb-6">
                        Our tool supports standard file formats. Because processing happens locally, there are no strict file size limits imposed by a server. You can process files as large as your device&apos;s memory can handle. Note that password-protected PDFs must be unlocked before they can be processed.
                    </p>

                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/png-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PNG to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert PNG images into a single PDF document.</p>
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
                            <Link href="/pdf-to-csv" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to CSV</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract tables and tabular data from your PDF into a CSV file.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/pdf-redaction" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF Redaction</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Permanently blackout sensitive information in your PDF.</p>
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
