"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,

    Delete,
    ArrowUpward,
    ArrowDownward,
    Image as ImageIcon,
} from "@mui/icons-material";

interface UploadedImage {
    id: string;
    file: File;
    previewUrl: string;
}

const convertImageToJpgBytes = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("No context");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(async (blob) => {
                if (!blob) return reject("No blob");
                const arrayBuffer = await blob.arrayBuffer();
                resolve(new Uint8Array(arrayBuffer));
            }, "image/jpeg", 0.95);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

export default function ImageToPDF() {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFilesSelected = (selectedFiles: File[]) => {
        const newImages = selectedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (id: string) => {
        setImages((prev) => {
            const target = prev.find((img) => img.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((img) => img.id !== id);
        });
    };

    const moveImage = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === images.length - 1) return;

        const newImages = [...images];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newImages[index];
        newImages[index] = newImages[targetIndex];
        newImages[targetIndex] = temp;
        setImages(newImages);
    };

    const convertToPDF = async () => {
        if (images.length === 0) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const pdfDoc = await PDFDocument.create();
            let currentImageIndex = 0;

            for (const imgObj of images) {
                const arrayBuffer = await imgObj.file.arrayBuffer();
                const imageBytes = new Uint8Array(arrayBuffer);
                let embeddedImage;

                const fileType = imgObj.file.type;
                if (fileType === "image/png") {
                    embeddedImage = await pdfDoc.embedPng(imageBytes);
                } else if (fileType === "image/jpeg" || fileType === "image/jpg") {
                    embeddedImage = await pdfDoc.embedJpg(imageBytes);
                } else if (fileType === "image/webp") {
                    const jpgBytes = await convertImageToJpgBytes(imgObj.file);
                    embeddedImage = await pdfDoc.embedJpg(jpgBytes);
                } else {
                    try {
                        embeddedImage = await pdfDoc.embedJpg(imageBytes);
                    } catch {
                        console.warn(`Skipping unsupported image format: ${imgObj.file.name}`);
                        continue;
                    }
                }

                const { width, height } = embeddedImage.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });

                currentImageIndex++;
                setProgress(10 + Math.round((currentImageIndex / images.length) * 80));
            }

            const pdfBytes = await pdfDoc.save();
            setProgress(95);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(images[0].file.name.replace(/\.[^/.]+$/, "") + ".pdf");
            setImages([]);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting images to PDF:", error);
            toast.error("An error occurred while converting the images to PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="Image to PDF"
                description="Convert JPG, PNG, and WebP images into a single PDF document in your preferred order."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                            <div className="text-4xl">📄</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Images to PDF Converted!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your images have been combined into a PDF.
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="w-full max-w-2xl h-[500px] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                            <iframe src={`${resultUrl}#toolbar=0`} className="w-full h-full" title="PDF Preview" />
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
                                Convert More
                            </button>
                        </div>
                    </div>
                ) : images.length === 0 ? (
                    <DropZone
                        onFilesSelected={handleFilesSelected}
                        accept="image/jpeg,image/png,image/webp"
                        multiple={true}
                        title="Select images to convert"
                        description="Drag & drop JPG, PNG, or WebP files here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* Image Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {images.map((imgObj, index) => (
                                <div
                                    key={imgObj.id}
                                    className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                        { }
                                        <img
                                            src={imgObj.previewUrl}
                                            alt={imgObj.file.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => moveImage(index, "up")}
                                                disabled={index === 0 || isProcessing}
                                                className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                                            >
                                                <ArrowUpward className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => moveImage(index, "down")}
                                                disabled={index === images.length - 1 || isProcessing}
                                                className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                                            >
                                                <ArrowDownward className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => removeImage(imgObj.id)}
                                                disabled={isProcessing}
                                                className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-all"
                                            >
                                                <Delete className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3 min-w-0">
                                        <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                                            {imgObj.file.name}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                            {(imgObj.file.size / 1024).toFixed(0)} KB
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add More Images */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
                                Add More Images
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
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
                                        <span>Converting images...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-purple-500 h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={convertToPDF}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                    Convert to PDF ({images.length} images)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Convert Image to PDF Instantly</h2>
                    <p className="text-lg mb-8">
                        Welcome to the fastest, most secure way to combine multiple images into a single PDF document online. Whether you are a professional, student, or casual user, our tool makes it effortless and completely private.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Convert Image to PDF?</h3>
                    <p className="mb-6">
                        Taking one or more image files (like JPG, PNG, or WebP) and embedding them into a single, standardized PDF document. This is perfect for creating portfolios, scanning documents, or sharing photo albums.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Convert Image to PDF</h3>
                    <p className="mb-4">Using our tool is incredibly simple:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload one or more images you want to convert.</li>
                        <li><strong>Adjust settings:</strong> Drag and drop the images to rearrange their order. You can also adjust the page orientation and margin settings.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Convert to PDF&quot; to instantly generate and download your new PDF document.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Easy Document Sharing</h3>
                    <p className="mb-6">
                        Sending multiple individual image files via email can be messy and confusing for the recipient. By combining your photos, scanned receipts, or design mockups into a single PDF, you create a neat, organized package that is much easier to share, download, and review.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Standardized Format</h3>
                    <p className="mb-6">
                        Unlike image files, which might display differently depending on the device or software used to open them, PDFs are universally standardized. When you convert your images to a PDF, you guarantee that they will look exactly the same—preserving layout, resolution, and color—on any computer, tablet, or smartphone.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Print-Ready Portfolios</h3>
                    <p className="mb-6">
                        If you need to print a collection of images, sending a dozen JPGs to a printer can result in unpredictable margins and sizing. Converting them into a single PDF document ensures that every image is perfectly formatted for printing, making it ideal for creating physical portfolios, presentations, or photo albums.
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
                            <Link href="/compress-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Compress PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Reduce the file size of your PDF while maintaining quality.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/image-cropper" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Image Cropper</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Crop and rotate your images interactively in your browser.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/merge-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Merge PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Combine multiple PDF files into a single document in seconds.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/rotate-image" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Rotate Image</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Rotate your images left or right by 90 degrees.</p>
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
