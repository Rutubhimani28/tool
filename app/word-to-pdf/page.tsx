"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import Link from "next/link";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import confetti from "canvas-confetti";
import {
    ArrowRightAlt,
    Description
} from "@mui/icons-material";
import { renderAsync } from "docx-preview";

export default function WordToPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState("");
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        setFile(selectedFiles[0]);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            setProcessingStatus("Reading file...");
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);
            setProcessingStatus("Parsing Word document...");

            // Render docx using docx-preview
            const tempContainer = document.createElement("div");
            await renderAsync(arrayBuffer, tempContainer, undefined, {
                className: "docx",
                inWrapper: false,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: true,
                ignoreLastRenderedPageBreak: true,
                experimental: false,
                trimXmlDeclaration: true,
                useBase64URL: true,
                debug: false,
            });
            setProgress(60);
            setProcessingStatus("Extracting pages...");

            // Extract pages rendered by docx-preview
            const chunks: string[] = [];
            const pages = tempContainer.querySelectorAll("section.docx");
            if (pages.length > 0) {
                pages.forEach((page) => {
                    const hasText = page.textContent?.trim().length ? page.textContent.trim().length > 0 : false;
                    const hasMedia = page.querySelectorAll('img, svg, canvas, table').length > 0;
                    if (hasText || hasMedia) {
                        chunks.push(page.outerHTML);
                    }
                });
            } else {
                chunks.push(tempContainer.innerHTML);
            }

            setProgress(75);
            setProcessingStatus("Initializing PDF engine...");

            const filename = `${file.name.replace(".docx", "").replace(".doc", "")}.pdf`;

            // Create an isolated iframe to prevent html2canvas from seeing Tailwind CSS v4 lab/oklch colors
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "2000px";
            iframe.style.height = "2000px";
            iframe.style.left = "-10000px";
            iframe.style.top = "-10000px";
            iframe.style.border = "none";
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error("Could not create isolated frame for rendering");

            await new Promise<void>((resolve, reject) => {
                // We define a message listener to track progress from inside the iframe
                const handleMessage = (event: MessageEvent) => {
                    if (event.data && event.data.type === "progress") {
                        setProgress(75 + Math.floor((event.data.current / event.data.total) * 20));
                        if (event.data.status) setProcessingStatus(event.data.status);
                    }
                };
                window.addEventListener("message", handleMessage);

                iframe.onload = async () => {
                    try {
                        // @ts-expect-error - generatePDF is defined in the iframe script
                        const blob = await iframe.contentWindow.generatePDF(filename, chunks);
                        const url = URL.createObjectURL(blob);
                        setResultUrl(url);
                        setResultFileName(filename);
                        setFile(null);
                        window.removeEventListener("message", handleMessage);
                        resolve();
                    } catch (err) {
                        window.removeEventListener("message", handleMessage);
                        reject(err);
                    }
                };

                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                        <style>
                            body { padding: 0; margin: 0; background-color: #fff; }
                            div { box-sizing: border-box; }
                            section.docx { margin: 0 !important; box-shadow: none !important; }
                        </style>
                    </head>
                    <body>
                        <script>
                            window.generatePDF = async function(filename, chunks) {
                                try {
                                    const { jsPDF } = window.jspdf;
                                    const pdf = new jsPDF('p', 'mm', 'a4');
                                    const pdfWidth = pdf.internal.pageSize.getWidth();
                                    const pdfHeight = pdf.internal.pageSize.getHeight();

                                    let pagesAdded = 0;
                                    for (let i = 0; i < chunks.length; i++) {
                                        window.parent.postMessage({ type: 'progress', current: i + 1, total: chunks.length }, '*');
                                        
                                        const container = document.createElement('div');
                                        container.innerHTML = chunks[i];
                                        container.style.backgroundColor = '#ffffff';
                                        container.style.position = 'absolute';
                                        container.style.top = '0';
                                        container.style.left = '0';
                                        container.style.zIndex = '-1';
                                        container.style.width = 'max-content';
                                        document.body.appendChild(container);
                                        
                                        const contentWidth = container.scrollWidth || 816;
                                        const containerHeight = container.scrollHeight || 1056;
                                        const sliceHeight = Math.floor(contentWidth * 1.414); // Standard A4 height at 96 DPI
                                        
                                        const containerRect = container.getBoundingClientRect();
                                        let currentY = 0;
                                        
                                        while (currentY < containerHeight) {
                                            let currentSliceHeight = Math.min(sliceHeight, containerHeight - currentY);
                                            
                                            // Smart page breaking: avoid cutting elements in half
                                            if (currentSliceHeight === sliceHeight) {
                                                const endY = currentY + sliceHeight;
                                                const elements = container.querySelectorAll('p, img, table, tr, li, h1, h2, h3, h4, h5, h6');
                                                let safeCutY = endY;
                                                
                                                for (let e = 0; e < elements.length; e++) {
                                                    const el = elements[e];
                                                    const rect = el.getBoundingClientRect();
                                                    const elTop = rect.top - containerRect.top;
                                                    const elBottom = rect.bottom - containerRect.top;
                                                    
                                                    // If element crosses the boundary
                                                    if (elTop < endY && elBottom > endY) {
                                                        // Only adjust if the element itself fits in a page
                                                        if (elBottom - elTop < sliceHeight) {
                                                            if (elTop > currentY) {
                                                                safeCutY = Math.min(safeCutY, elTop);
                                                            }
                                                        }
                                                    }
                                                }
                                                
                                                currentSliceHeight = safeCutY - currentY;
                                            }
                                            
                                            if (currentSliceHeight <= 0) {
                                                currentSliceHeight = sliceHeight; // Fallback to prevent infinite loop
                                            }

                                            window.parent.postMessage({ 
                                                type: 'progress', 
                                                current: i + (currentY / containerHeight), 
                                                total: chunks.length,
                                                status: \`Rendering PDF page \${pagesAdded + 1}...\` 
                                            }, '*');

                                            const canvas = await html2canvas(container, { 
                                                scale: 1.5, 
                                                useCORS: true, 
                                                logging: false,
                                                backgroundColor: '#ffffff',
                                                y: currentY,
                                                height: currentSliceHeight,
                                                windowWidth: contentWidth,
                                                width: contentWidth
                                            });
                                            
                                            if (canvas.width > 0 && canvas.height > 0) {
                                                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                                                
                                                if (imgData && imgData.length > 100 && imgData !== 'data:,') {
                                                    if (pagesAdded > 0) {
                                                        pdf.addPage();
                                                    }
                                                    
                                                    const imgProps = pdf.getImageProperties(imgData);
                                                    const ratio = imgProps.width / imgProps.height;
                                                    
                                                    let finalWidth = pdfWidth;
                                                    let finalHeight = pdfWidth / ratio;
                                                    
                                                    if (finalHeight > pdfHeight) {
                                                        finalHeight = pdfHeight;
                                                        finalWidth = pdfHeight * ratio;
                                                    }
                                                    
                                                    const x = (pdfWidth - finalWidth) / 2;
                                                    const y = 0; // Align to top to leave space at the bottom
                                                    
                                                    pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
                                                    pagesAdded++;
                                                }
                                            }
                                            
                                            currentY += currentSliceHeight;
                                        }
                                        
                                        document.body.removeChild(container);
                                    }
                                    
                                    if (pagesAdded === 0) {
                                        throw new Error("No valid pages could be generated from the document.");
                                    }
                                    
                                    return pdf.output('blob');
                                } catch (e) {
                                    console.error("Error in iframe generatePDF:", e);
                                    throw e;
                                }
                            };
                        </script>
                    </body>
                    </html>
                `);
                iframeDoc.close();
            });

            document.body.removeChild(iframe);
            setProgress(100);
            setProcessingStatus("Done!");

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error converting Word to PDF:", error);
            toast.error("An error occurred while converting the Word document.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="Word to PDF"
                description="Convert Microsoft Word documents (.docx) to high-quality PDF files."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
                            <div className="text-4xl">📄</div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Word to PDF Converted!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your document has been successfully converted.
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
                                Convert Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".docx,.doc"
                        multiple={false}
                        title="Select Word document to convert"
                        description="Drag & drop a .docx or .doc file here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs">
                                    DOCX
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
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
                                        <span>{processingStatus || "Converting to PDF..."}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleConvert}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200"
                                >
                                    <Description className="h-5 w-5" />
                                    Convert to PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Convert Word to PDF Free Online</h2>
                    <p className="text-lg mb-8">
                        Transform your Microsoft Word documents (.docx or .doc) into universally accessible PDF files instantly. Our Word to PDF converter ensures your formatting, fonts, and layouts remain exactly as you intended, making it perfect for professional sharing and printing.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Preserving Formatting & Fonts</h3>
                    <p className="mb-6">
                        While Microsoft Word is the industry standard for drafting documents, sharing them in their native format can lead to compatibility issues. Different versions of Word or alternative word processors can alter your carefully crafted layout. Converting to PDF locks in your design, ensuring the document looks identical on any device, operating system, or printer. It also prevents accidental edits by the recipient.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Cross-Platform Compatibility</h3>
                    <p className="mb-6">
                        PDFs are universally supported. Whether your recipient is opening the file on a Windows PC, a Mac, an iPad, or an Android phone, they will see exactly what you see. They do not need to have Microsoft Office installed to view the document perfectly.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Document Security</h3>
                    <p className="mb-6">
                        Converting a Word document to a PDF creates a read-only version of your file. This is crucial for sharing contracts, invoices, or official reports where you want to prevent the recipient from accidentally (or intentionally) editing the text or changing the figures.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Convert DOCX to PDF</h3>
                    <p className="mb-4">Our tool makes the conversion process seamless and fast:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your document:</strong> Drag and drop your Word file into the designated area or click to select it from your device.</li>
                        <li><strong>Automatic Conversion:</strong> Once uploaded, click the convert button. Our advanced browser-based engine will instantly render your document into a high-quality PDF.</li>
                        <li><strong>Download & Share:</strong> Preview the generated PDF directly on the page, then download it to your device with a single click.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your files are processed locally in your browser and are not uploaded to our servers. This can help keep sensitive documents on your device during processing. This can be useful when working with documents that contain sensitive or personal information.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-6 mb-12">
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Will my formatting change after conversion?</h4>
                            <p>No. Our conversion engine is designed to accurately preserve your original fonts, margins, images, and overall layout, ensuring the resulting PDF is a faithful representation of your Word document.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Do I need to install Microsoft Word to use this tool?</h4>
                            <p>Not at all. Our tool works independently in your web browser, allowing you to convert Word documents to PDF even if you don&apos;t have Microsoft Office installed on your device.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Is there a file size limit?</h4>
                            <p>Because the processing happens locally on your device, the file size limit is primarily determined by your device&apos;s memory and browser capabilities, allowing for much larger files than typical server-based converters.</p>
                        </div>
                    </div>
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
                            <Link href="/webp-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">WebP to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert WebP images into a single PDF document.</p>
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
                            <Link href="/jpg-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">JPG to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert JPG images into a single PDF document.</p>
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
