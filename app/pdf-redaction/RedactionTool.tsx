"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { applyDestructiveRedactions, RedactionBox } from "./utils";
import { Security, ArrowRightAlt } from "@mui/icons-material";
import Link from "next/link";

export default function RedactionTool() {
    const [file, setFile] = useState<File | null>(null);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [draggingBoxIndex, setDraggingBoxIndex] = useState<number | null>(null);
    const [resizingBoxIndex, setResizingBoxIndex] = useState<number | null>(null);
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        try {
            const buffer = await selectedFile.arrayBuffer();
            setFileBuffer(buffer);
            setFile(selectedFile);
            setResultUrl(null);
            setRedactions([]);
            setCurrentPage(1);

            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0), verbosity: 0 }).promise;
            setNumPages(pdf.numPages);
            renderPage(pdf, 1);
        } catch (error) {
            console.error("Error reading PDF file:", error);
            toast.error("Error reading PDF file. It might be corrupted or encrypted.");
        }
    };

    const renderTaskRef = useRef<any>(null);

    const renderPage = async (pdf: any, pageNum: number) => {
        if (!canvasRef.current) return;

        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch (e) {
                // Ignore cancel errors
            }
        }

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Clear canvas to prevent artifacts or upside down rendering from previous state
        context.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        try {
            await renderTask.promise;
        } catch (error: any) {
            if (error.name !== 'RenderingCancelledException') {
                console.error('Render error:', error);
            }
        }
    };

    useEffect(() => {
        if (fileBuffer) {
            import("pdfjs-dist").then(async (pdfjsLib) => {
                const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0), verbosity: 0 }).promise;
                renderPage(pdf, currentPage);
            });
        }
    }, [currentPage, fileBuffer]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        if (draggingBoxIndex !== null) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setCurrentBox({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (draggingBoxIndex !== null && dragStartPos) {
            const dx = x - dragStartPos.x;
            const dy = y - dragStartPos.y;

            const newRedactions = [...redactions];
            newRedactions[draggingBoxIndex] = {
                ...newRedactions[draggingBoxIndex],
                x: newRedactions[draggingBoxIndex].x + dx,
                y: newRedactions[draggingBoxIndex].y + dy,
            };
            setRedactions(newRedactions);
            setDragStartPos({ x, y });
            return;
        }

        if (resizingBoxIndex !== null && dragStartPos) {
            const dx = x - dragStartPos.x;
            const dy = y - dragStartPos.y;

            const newRedactions = [...redactions];
            newRedactions[resizingBoxIndex] = {
                ...newRedactions[resizingBoxIndex],
                width: Math.max(10, newRedactions[resizingBoxIndex].width + dx),
                height: Math.max(10, newRedactions[resizingBoxIndex].height + dy),
            };
            setRedactions(newRedactions);
            setDragStartPos({ x, y });
            return;
        }

        if (isDrawing && currentBox) {
            setCurrentBox({
                ...currentBox,
                width: x - currentBox.x,
                height: y - currentBox.y,
            });
        }
    };

    const handleMouseUp = () => {
        if (draggingBoxIndex !== null || resizingBoxIndex !== null) {
            setDraggingBoxIndex(null);
            setResizingBoxIndex(null);
            setDragStartPos(null);
            return;
        }

        if (isDrawing && currentBox) {
            // Normalize box (handle negative width/height if drawn backwards)
            const normalizedBox = {
                x: currentBox.width < 0 ? currentBox.x + currentBox.width : currentBox.x,
                y: currentBox.height < 0 ? currentBox.y + currentBox.height : currentBox.y,
                width: Math.abs(currentBox.width),
                height: Math.abs(currentBox.height),
                pageIndex: currentPage - 1,
            };

            if (normalizedBox.width > 5 && normalizedBox.height > 5) {
                setRedactions([...redactions, normalizedBox]);
            }
        }
        setIsDrawing(false);
        setCurrentBox(null);
    };

    const handleApply = async () => {
        if (!fileBuffer || !file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            const blob = await applyDestructiveRedactions(fileBuffer, redactions, setProgress);
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}_redacted.pdf`);
            toast.success("Redaction applied successfully!");
        } catch (error) {
            console.error("Error applying redactions:", error);
            toast.error("An error occurred while applying redactions.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const removeRedaction = (index: number) => {
        const newRedactions = [...redactions];
        newRedactions.splice(index, 1);
        setRedactions(newRedactions);
    };

    return (
        <>
            <ToolWrapper
                title="PDF Redaction Tool"
                description="Permanently blackout sensitive information in your PDF. 100% secure, processed locally in your browser."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400">
                            <Security className="h-12 w-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Redacted Successfully!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your sensitive information has been permanently removed.
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
                                Download PDF
                            </button>
                            <button
                                onClick={() => {
                                    URL.revokeObjectURL(resultUrl);
                                    setResultUrl(null);
                                    setFile(null);
                                    setFileBuffer(null);
                                    setRedactions([]);
                                }}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Redact Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to redact"
                        description="Drag & drop a PDF file here, or click to browse"
                    />
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Page {currentPage} of {numPages}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                                    disabled={currentPage === numPages}
                                    className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-zinc-500 text-center">
                            Click and drag on the document below to draw black redaction boxes over sensitive text.
                        </div>

                        <div className="relative overflow-auto border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex justify-center p-4">
                            <div
                                ref={containerRef}
                                className="relative cursor-crosshair shadow-lg"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <canvas ref={canvasRef} className="block max-w-full h-auto" />

                                {/* Render existing redactions for current page */}
                                {redactions.map((r, i) => r.pageIndex === currentPage - 1 && (
                                    <div
                                        key={i}
                                        className={`absolute bg-black opacity-90 group ${draggingBoxIndex === i ? 'cursor-grabbing' : 'cursor-grab'}`}
                                        style={{ left: r.x, top: r.y, width: r.width, height: r.height }}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            if (!containerRef.current) return;
                                            const rect = containerRef.current.getBoundingClientRect();
                                            setDraggingBoxIndex(i);
                                            setDragStartPos({
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top
                                            });
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => { e.stopPropagation(); removeRedaction(i); }}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                                        >
                                            ×
                                        </button>

                                        {/* Resize handle */}
                                        <div
                                            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-end justify-end"
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                if (!containerRef.current) return;
                                                const rect = containerRef.current.getBoundingClientRect();
                                                setResizingBoxIndex(i);
                                                setDragStartPos({
                                                    x: e.clientX - rect.left,
                                                    y: e.clientY - rect.top
                                                });
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 0L0 12H12V0Z" fill="white" />
                                                <path d="M10 4L4 10H5.5L10 5.5V4Z" fill="black" />
                                                <path d="M10 7.5L7.5 10H9L10 9V7.5Z" fill="black" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}

                                {/* Render currently drawing box */}
                                {isDrawing && currentBox && (
                                    <div
                                        className="absolute bg-black opacity-50 border border-black"
                                        style={{
                                            left: currentBox.width < 0 ? currentBox.x + currentBox.width : currentBox.x,
                                            top: currentBox.height < 0 ? currentBox.y + currentBox.height : currentBox.y,
                                            width: Math.abs(currentBox.width),
                                            height: Math.abs(currentBox.height),
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                            {isProcessing ? (
                                <div className="w-full">
                                    <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                        <span>Applying destructive redactions...</span>
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
                                    onClick={handleApply}
                                    disabled={redactions.length === 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Security className="h-5 w-5" />
                                    Apply Redactions & Download
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Redact PDF Documents Securely</h2>
                    <p className="text-lg mb-8">
                        Permanently blackout sensitive information, personal data, and confidential text in your PDF documents. Our PDF Redaction tool provides true, destructive redaction that completely removes the underlying data, ensuring it cannot be recovered or copied.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why is Proper PDF Redaction Important?</h3>
                    <p className="mb-6">
                        Simply drawing a black rectangle over text in a standard PDF editor does not actually remove the text—it only hides it visually. Anyone can still highlight, copy, or search for the hidden text underneath the black box. True redaction requires permanently deleting the underlying text and image data from the document&apos;s code. Our tool performs this destructive redaction, guaranteeing that your sensitive information is gone forever.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Blackout Text in PDF</h3>
                    <p className="mb-4">Follow these simple steps to securely redact your document:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your PDF:</strong> Select the document containing sensitive information.</li>
                        <li><strong>Draw Redaction Boxes:</strong> Click and drag over the text, images, or areas you want to blackout. You can resize or delete boxes as needed.</li>
                        <li><strong>Apply Redactions:</strong> Click the apply button. Our tool will permanently destroy the data underneath your boxes and generate a secure, redacted PDF.</li>
                    </ol>

                                        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online tools that upload your sensitive documents to remote cloud servers, <strong>our tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-6 mb-12">
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Is the redacted text permanently gone?</h4>
                            <p>Yes. Unlike simple drawing tools, our redaction engine destructively removes the text and image data from the PDF structure before applying the black overlay. It cannot be recovered.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Can I redact multiple pages?</h4>
                            <p>Yes, you can navigate through the pages of your document and draw redaction boxes on any page before applying the final redaction.</p>
                        </div>
                    </div>

                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/protect-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Protect PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Encrypt your PDF with a secure password.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/unlock-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Unlock PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Remove passwords and restrictions from PDFs.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/watermark-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Watermark PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stamp an image or text over your PDF.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/delete-pages-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Delete PDF Pages</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select pages you want to remove from your PDF.</p>
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
