"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import Link from "next/link";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { Collections, ArrowRightAlt } from "@mui/icons-material";
import { PDFDocument } from "pdf-lib";

export default function PDFToJPG() {
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
            const { PDFDocument } = await import("pdf-lib");
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

    const convertToJPG = async () => {
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
            const JSZip = (await import("jszip")).default;
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
                    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
                );

                if (blob) {
                    zip.file(`${file.name.replace(".pdf", "")}_page_${i}.jpg`, blob);
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
            console.error("Error converting PDF to JPG:", error);
            toast.error("An error occurred while converting the PDF to JPG.");
        } finally {
            console.warn = originalWarn;
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF to JPG Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Convert PDF pages into high-quality JPG images and download them as a ZIP file."
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                suppressHydrationWarning
            />
            <ToolWrapper
                title="PDF to JPG"
                description="Convert PDF pages into high-quality JPG images and download them as a ZIP file."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                            <div className="text-4xl">🖼️</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF to JPG Converted!</h3>
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
                                        <span>Converting pages to JPG...</span>
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
                                    onClick={convertToJPG}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200"
                                >
                                    <Collections className="h-5 w-5" />
                                    Convert to JPG (ZIP)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">PDF to JPG Converter</h2>
                    <p className="text-lg mb-8">
                        Welcome to the most reliable, privacy-first PDF to JPG converter. Whether you need to extract a single page from a document or convert an entire multi-page PDF into high-quality images, our tool handles it instantly directly in your browser.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is PDF to JPG Conversion?</h3>
                    <p className="mb-6">
                        PDF (Portable Document Format) is excellent for sharing documents that look the same on any device. However, PDFs are not always ideal for web use, social media sharing, or embedding in presentations. Converting a PDF to JPG transforms each page of your document into a standard image file. This process rasterizes the text and vector graphics into a fixed grid of pixels, making the content universally viewable without specialized PDF reader software.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Convert PDF to JPG</h3>
                    <p className="mb-4">Converting your files is incredibly simple and requires no technical knowledge:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Select your PDF:</strong> Drag and drop your file into the upload box above, or click to browse your device.</li>
                        <li><strong>Start Conversion:</strong> Click the &quot;Convert to JPG (ZIP)&quot; button. Our local processing engine will immediately begin rendering each page.</li>
                        <li><strong>Download JPG files:</strong> Once complete, your high-resolution JPG images will be automatically packaged into a convenient ZIP archive for a single-click download.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Practical Use Cases</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Social Media:</strong> Platforms like Instagram, Facebook, and Pinterest do not support PDF uploads. Converting your flyers, infographics, or portfolios to JPG allows you to share them effortlessly.</li>
                        <li><strong>Web Optimization:</strong> Embedding images on a website is generally faster and more reliable than embedding a PDF viewer.</li>
                        <li><strong>Presentations:</strong> Inserting JPG images into PowerPoint or Google Slides is much smoother than trying to link or embed PDF files.</li>
                        <li><strong>Security:</strong> If you want to share a document but prevent others from easily copying the text or editing the content, flattening it into a JPG image adds a layer of difficulty for unauthorized modifications.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Image Quality & Multi-Page Behavior</h3>
                    <p className="mb-6">
                        Our tool renders PDF pages at a high scale (2.0x viewport) to ensure the resulting JPGs are crisp and high-resolution. When you upload a multi-page PDF, the tool processes every single page sequentially. To make downloading easy, all the generated JPG images are bundled into a single ZIP file, so you don&apos;t have to download each page individually.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Scanned PDF Considerations</h3>
                    <p className="mb-6">
                        If your PDF is already composed of scanned images (rather than selectable text), converting it to JPG will simply extract those visual pages into image files. The quality of the output JPG will depend heavily on the quality of the original scan.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">JPG vs PNG vs WebP</h3>
                    <p className="mb-4">Not sure which image format to choose? Here is a quick guide:</p>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>JPG:</strong> Best for photographs and complex images. It uses lossy compression, resulting in smaller file sizes, making it the standard for general web use.</li>
                        <li><strong>PNG:</strong> Best for documents with sharp text, line art, or when you need a transparent background. It uses lossless compression, ensuring no quality is lost, but file sizes are larger. Try our <Link href="/pdf-to-png" className="text-blue-600 dark:text-blue-400 hover:underline">PDF to PNG</Link> tool.</li>
                        <li><strong>WebP:</strong> A modern format that provides superior compression for the web, offering high quality at very small file sizes. Try our <Link href="/pdf-to-webp" className="text-blue-600 dark:text-blue-400 hover:underline">PDF to WebP</Link> tool.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online converters that upload your sensitive documents to remote cloud servers, <strong>our tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Supported Files and Limitations</h3>
                    <p className="mb-6">
                        Our tool supports standard PDF documents. Because processing happens locally, there are no strict file size limits imposed by a server. However, processing extremely large PDFs (e.g., hundreds of pages) may take longer depending on your device&apos;s memory and processing power. Note that password-protected PDFs must be unlocked before conversion.
                    </p>
                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/webp-converter" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">WebP Converter</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert images to WebP format, or convert WebP files back to PNG/JPG.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/image-resizer" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Image Resizer</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Resize your images to custom dimensions or scale them by percentage.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/unlock-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Unlock PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Remove password protection and restrictions from your PDF.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/delete-pages-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Delete PDF Pages</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select pages you want to remove from your PDF document.</p>
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
