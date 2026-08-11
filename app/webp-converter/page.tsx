"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,
 Photo, Transform } from "@mui/icons-material";

export default function WebPConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<"image/webp" | "image/png" | "image/jpeg">("image/webp");
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);

        // Auto-detect target format to prevent converting to the same format
        if (selectedFile.type === "image/webp") {
            setTargetFormat("image/png");
        } else {
            setTargetFormat("image/webp");
        }
    };

    const handleConvert = () => {
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

                if (ctx) {
                    // Fill white background if converting transparent image to JPG
                    if (targetFormat === "image/jpeg") {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                setResultUrl(url);
                                const ext = targetFormat === "image/webp" ? ".webp" : targetFormat === "image/png" ? ".png" : ".jpg";
                                setResultFileName(file.name.replace(/\.[^/.]+$/, "") + ext);
                                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                            }
                            setIsProcessing(false);
                        },
                        targetFormat,
                        0.80
                    );
                } else {
                    setIsProcessing(false);
                    toast.error("Could not initialize canvas context.");
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleReset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setFile(null);
        setPreviewUrl(null);
        setResultUrl(null);
        setResultFileName("");
    };

    const getFormatLabel = (mime: string) => {
        if (mime === "image/webp") return "WebP";
        if (mime === "image/png") return "PNG";
        return "JPG";
    };

    return (
        <>
            <ToolWrapper title="WebP Converter" description="Convert images to WebP format for web optimization, or convert WebP files back to PNG/JPG." accentColor="purple">
            {resultUrl ? (
                // Success screen
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <Transform className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Converted to {getFormatLabel(targetFormat)}!</h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Your image has been successfully converted.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <img src={resultUrl} alt="Converted Image" className="max-h-full max-w-full object-contain" />
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
                            className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 transition-colors"
                        >
                            Download Image
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                        >
                            Convert Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
                    title="Select image to convert"
                    description="Drag & drop a JPG, PNG, or WebP file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
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

                    {/* Settings - Only show if uploaded file is WebP */}
                    {file.type === "image/webp" && (
                        <div className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                            {/* Target Format */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Target Format</label>
                                <div className="flex gap-2">
                                    {["image/png", "image/jpeg"].map((format) => {
                                        const label = getFormatLabel(format);
                                        return (
                                            <button
                                                key={format}
                                                onClick={() => setTargetFormat(format as any)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${targetFormat === format
                                                    ? "bg-purple-500 border-purple-500 text-white"
                                                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200 disabled:opacity-50"
                        >
                            <Transform className="h-5 w-5" />
                            {isProcessing ? "Converting..." : `Convert to ${getFormatLabel(targetFormat)}`}
                        </button>
                    </div>
                </div>
            )}
        </ToolWrapper>

                        {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">WebP Converter Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the fastest, most secure way to convert images to and from the WebP format online. Whether you are a professional, student, or casual user, our tool makes it effortless and completely private.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is WebP Converter?</h3>
                    <p className="mb-6">
                        Converting images between the modern WebP format and traditional formats like JPG and PNG. WebP offers superior compression, but sometimes you need to convert files back to JPG/PNG for compatibility with older software.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to WebP Converter</h3>
                    <p className="mb-4">Using our tool is incredibly simple:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload your images (WebP, JPG, or PNG).</li>
                        <li><strong>Adjust settings:</strong> Select your desired output format. The tool will automatically handle the conversion.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Convert&quot; to process the files locally and download your newly formatted images.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why should you use this tool?</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Improve Compatibility:</strong> Convert WebP images downloaded from the internet into JPG or PNG so they can be opened in older photo editors.</li>
                        <li><strong>Optimize for Web:</strong> Convert your bulky JPG and PNG photos into WebP to significantly speed up your website&apos;s loading time.</li>
                        <li><strong>Maintain Quality:</strong> Enjoy high-quality conversions whether you are compressing to WebP or extracting to a lossless PNG.</li>
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
                            <Link href="/sign-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Sign PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Add your signature image to the first page of your PDF.</p>
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
                            <Link href="/image-compressor" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Image Compressor</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Compress JPG, PNG, or WebP images to reduce file size.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/compress-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Compress PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Reduce the file size of your PDF while maintaining quality.</p>
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
