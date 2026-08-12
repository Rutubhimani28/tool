"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,
    Photo, Transform
} from "@mui/icons-material";

export default function HEICToJPG() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];

        const fileName = selectedFile.name.toLowerCase();
        if (!fileName.endsWith('.heic') && !fileName.endsWith('.heif')) {
            toast.error("Please select a valid HEIC or HEIF image file.");
            return;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const heic2any = (await import("heic2any")).default;
            const resultBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });

            const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(file.name.replace(/\.[^/.]+$/, "") + ".jpg");
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (error: any) {
            if (error?.code === 1 || (error?.message && error.message.includes("already browser readable"))) {
                // The file is already a JPEG/PNG (e.g. iOS auto-converted it, or it has wrong extension)
                const url = URL.createObjectURL(file);
                setResultUrl(url);
                setResultFileName(file.name.replace(/\.[^/.]+$/, "") + ".jpg");
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } else {
                toast.error("Could not convert HEIC file. It might be corrupted.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setFile(null);
        setPreviewUrl(null);
        setResultUrl(null);
        setResultFileName("");
    };

    return (
        <>
            <ToolWrapper title="Convert HEIC to JPG" description="Convert Apple HEIC images to standard JPG format." accentColor="cyan">
                {resultUrl ? (
                    // Success screen
                    <div className="flex flex-col items-center justify-center gap-6 py-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-400">
                            <Transform className="h-10 w-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Converted to JPG!</h3>
                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                Your HEIC has been successfully converted.
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="w-full max-w-md aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                            <img src={resultUrl} alt="Converted JPG" className="max-h-full max-w-full object-contain" />
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
                                className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600 transition-colors"
                            >
                                Download JPG
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
                        accept=".heic,.heif"
                        multiple={false}
                        title="Select HEIC image to convert"
                        description="Drag & drop a HEIC file here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
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


                        {/* Action Button */}
                        <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                            <button
                                onClick={handleConvert}
                                disabled={isProcessing}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-200 disabled:opacity-50"
                            >
                                <Transform className="h-5 w-5" />
                                {isProcessing ? "Converting..." : "Convert to JPG"}
                            </button>
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Convert HEIC to JPG Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the fastest, most secure way to convert Apple HEIC photos to universally compatible JPG images online. Whether you are a professional, student, or casual user, our tool makes it effortless and completely private.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Convert HEIC to JPG?</h3>
                    <p className="mb-6">
                        Converting High-Efficiency Image Container (HEIC) files, commonly used by Apple devices, into the widely supported Joint Photographic Experts Group (JPG) format for maximum compatibility.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Convert HEIC to JPG</h3>
                    <p className="mb-4">Using our tool is incredibly simple:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Select or drag and drop your HEIC images into the upload zone.</li>
                        <li><strong>Adjust settings:</strong> Adjust the image quality slider if you want to compress the output JPG files.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Convert to JPG&quot; to process your images locally and download the results.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Universal Compatibility</h3>
                    <p className="mb-6">
                        While Apple&apos;s HEIC format is excellent for saving space on your iPhone, it is not universally supported. Many older operating systems, smart TVs, and third-party software applications cannot open HEIC files. Converting them to JPG ensures that your photos can be viewed on virtually any device, anywhere in the world, without requiring special software.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Easy Sharing Across Devices</h3>
                    <p className="mb-6">
                        Sharing photos from an iPhone to a Windows PC or an Android device can often result in compatibility errors if the files remain in HEIC format. By converting your images to JPG first, you guarantee a seamless sharing experience with friends, family, or colleagues, regardless of the ecosystem they use.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Web Optimization</h3>
                    <p className="mb-6">
                        If you are building a website, writing a blog, or posting to certain social media platforms, HEIC files are generally not accepted. JPG remains the gold standard for web images due to its balance of quality and compression. Our tool quickly prepares your mobile photography for web publishing.
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
                            <Link href="/delete-pages-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Delete PDF Pages</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select pages you want to remove from your PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/page-number-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Page Number PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Easily insert page numbers into your PDF document.</p>
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
                            <Link href="/pdf-to-webp" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to WebP</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract pages of a PDF as highly compressed WebP images.</p>
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
