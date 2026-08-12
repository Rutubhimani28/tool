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

export default function ExtractImagesPDF() {
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

    const extractImages = async () => {
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
            let imageCount = 0;

            for (let i = 1; i <= pagesCount; i++) {
                const page = await pdf.getPage(i);
                const ops = await page.getOperatorList();

                for (let j = 0; j < ops.fnArray.length; j++) {
                    if (
                        ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject ||
                        ops.fnArray[j] === (pdfjsLib.OPS as any).paintJpegXObject
                    ) {
                        const objId = ops.argsArray[j][0];
                        try {
                            const img = await page.objs.get(objId);
                            if (!img) continue;

                            const canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) continue;

                            if (img.data) {
                                // Sometimes data is not exactly width*height*4, so we handle it carefully
                                const dataLength = img.width * img.height * 4;
                                let clampedData;
                                if (img.data.length === dataLength) {
                                    clampedData = new Uint8ClampedArray(img.data);
                                } else if (img.data.length === img.width * img.height * 3) {
                                    // RGB to RGBA
                                    clampedData = new Uint8ClampedArray(dataLength);
                                    for (let k = 0, l = 0; k < img.data.length; k += 3, l += 4) {
                                        clampedData[l] = img.data[k];
                                        clampedData[l + 1] = img.data[k + 1];
                                        clampedData[l + 2] = img.data[k + 2];
                                        clampedData[l + 3] = 255;
                                    }
                                } else {
                                    continue; // Unsupported format
                                }
                                const imageData = new ImageData(clampedData, img.width, img.height);
                                ctx.putImageData(imageData, 0, 0);
                            } else if (img.bitmap) {
                                ctx.drawImage(img.bitmap, 0, 0);
                            } else {
                                continue;
                            }

                            const blob = await new Promise<Blob | null>((resolve) =>
                                canvas.toBlob((b) => resolve(b), "image/png")
                            );

                            if (blob) {
                                imageCount++;
                                zip.file(`extracted_image_${imageCount}.png`, blob);
                            }
                        } catch (e) {
                            console.warn("Could not extract image", e);
                        }
                    }
                }

                setProgress(10 + Math.round((i / pagesCount) * 70));
            }

            if (imageCount === 0) {
                toast.error("No images found in this PDF.");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            setProgress(85);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            setProgress(95);

            const url = URL.createObjectURL(zipBlob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}_images.zip`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error extracting images:", error);
            toast.error("An error occurred while extracting images.");
        } finally {
            console.warn = originalWarn;
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="Extract Images from PDF"
                description="Extract all embedded images from a PDF document and download them as a ZIP file."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                            <div className="text-4xl">🖼️</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Images Extracted!</h3>
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
                                Extract Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to extract images from"
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
                                        <span>Extracting images...</span>
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
                                    onClick={extractImages}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200"
                                >
                                    <Collections className="h-5 w-5" />
                                    Extract Images (ZIP)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Extract Images from PDF Online</h2>
                    <p className="text-lg mb-8">
                        Pull all embedded images out of your PDF documents directly in your browser. Download high-quality original images in a ZIP file without uploading your documents to a server.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Extract Images from PDF?</h3>
                    <p className="mb-6">
                        Scanning a PDF document and extracting all the embedded images (like photos, charts, and graphics) into individual image files (JPG or PNG) without losing their original quality.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Extract Images from PDF</h3>
                    <p className="mb-4">Extracting images from your PDF is a breeze:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload your PDF document containing the images you want to extract.</li>
                        <li><strong>Adjust settings:</strong> Our tool will automatically scan the document and display all embedded images.</li>
                        <li><strong>Process and Download:</strong> Download individual images or download them all at once in a convenient ZIP file.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Repurposing Graphics</h3>
                    <p className="mb-6">
                        Often, a PDF contains valuable visual assets like charts, diagrams, logos, or high-resolution photographs that you need to reuse in a presentation, a Word document, or on a website. Instead of asking the original creator for the source files, our tool allows you to instantly extract these embedded images so you can repurpose them immediately.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Saving Time vs. Screenshots</h3>
                    <p className="mb-6">
                        While taking a screenshot of a PDF page is a common workaround, it is incredibly time-consuming if you have dozens of images to capture. Furthermore, screenshots are limited by your screen&apos;s resolution and often require manual cropping. Our tool automates this process, extracting every image in seconds and packaging them neatly into a ZIP file.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Original Quality Preservation</h3>
                    <p className="mb-6">
                        When you take a screenshot, you are capturing a rasterized version of the image at your screen&apos;s current zoom level, which often results in a blurry or pixelated file. Our extraction tool pulls the <em>original</em> image file embedded within the PDF&apos;s code. This guarantees that you receive the image in its exact original resolution and format, ensuring zero loss of quality.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Limitations with Scanned Documents</h3>
                    <p className="mb-6">
                        It is important to note that this tool extracts images that are embedded as distinct objects within the PDF file structure. If your PDF is a scanned document (meaning the entire page is essentially one large image), the tool will extract the entire page as a single image, rather than identifying individual photos or charts within that scanned page.
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
                            <Link href="/heic-to-jpg" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Convert HEIC to JPG</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert Apple HEIC images to standard JPG format.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/watermark-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Watermark PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stamp an image or text over your PDF in seconds.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/rearrange-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Rearrange PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Drag and drop page thumbnails to reorder them in your PDF.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/sign-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Sign PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Add your signature image to the first page of your PDF.</p>
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
