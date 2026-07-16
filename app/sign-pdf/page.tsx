"use client";

import toast from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { Draw, UploadFile, TouchApp, Clear, Save, Add, Close } from "@mui/icons-material";

type PlacedSignature = {
    id: string;
    pageNumber: number;
    x: number; // percentage
    y: number; // percentage
    scale: number;
    dataUrl: string;
};

export default function SignPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // Page selection state
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pdfDocument, setPdfDocument] = useState<any>(null);

    // Multiple signatures state
    const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
    const [activeSignatureId, setActiveSignatureId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const resizeStartRef = useRef({ x: 0, y: 0, scale: 1 });

    // Drawing state
    const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const loadPreview = async (pdfDoc: any, pageNum: number) => {
        setIsLoadingPreview(true);
        try {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.0 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                setPreviewDataUrl(canvas.toDataURL());
            }
        } catch (error) {
            console.error("Error loading PDF preview:", error);
            toast.error("Error loading PDF preview.");
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPreviewDataUrl(null);
        setSelectedPage(1);
        setPlacedSignatures([]);

        const originalWarn = console.warn;
        console.warn = () => { };

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;

            setPdfDocument(pdf);
            setTotalPages(pdf.numPages);
            await loadPreview(pdf, 1);

        } catch (error) {
            console.error("Error loading PDF for preview:", error);
            toast.error("Error loading PDF preview.");
        } finally {
            console.warn = originalWarn;
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && pdfDocument) {
            setSelectedPage(newPage);
            await loadPreview(pdfDocument, newPage);
        }
    };

    const handleSignatureSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setSignaturePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addSignatureToPage = () => {
        if (!signaturePreview) return;
        const newSig: PlacedSignature = {
            id: Math.random().toString(36).substr(2, 9),
            pageNumber: selectedPage,
            x: 50,
            y: 50,
            scale: 1,
            dataUrl: signaturePreview
        };
        setPlacedSignatures(prev => [...prev, newSig]);
        toast.success(`Signature added to page ${selectedPage}`);
    };

    const deleteSignature = (id: string) => {
        setPlacedSignatures(prev => prev.filter(s => s.id !== id));
        if (activeSignatureId === id) {
            setActiveSignatureId(null);
            setIsDragging(false);
            setIsResizing(false);
        }
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        if (isResizing) return;
        e.preventDefault();
        setActiveSignatureId(id);
        setIsDragging(true);
    };

    const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveSignatureId(id);
        setIsResizing(true);
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        const sig = placedSignatures.find(s => s.id === id);
        resizeStartRef.current = { x: clientX, y: clientY, scale: sig?.scale || 1 };
    };

    const handleGlobalMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!activeSignatureId) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        if (isDragging && previewContainerRef.current) {
            const container = previewContainerRef.current.getBoundingClientRect();
            let x = ((clientX - container.left) / container.width) * 100;
            let y = ((clientY - container.top) / container.height) * 100;

            x = Math.max(0, Math.min(100, x));
            y = Math.max(0, Math.min(100, y));

            setPlacedSignatures(prev => prev.map(s =>
                s.id === activeSignatureId ? { ...s, x, y } : s
            ));
        }

        if (isResizing) {
            const dx = clientX - resizeStartRef.current.x;
            const newScale = Math.max(0.2, Math.min(5, resizeStartRef.current.scale + (dx / 100)));
            setPlacedSignatures(prev => prev.map(s =>
                s.id === activeSignatureId ? { ...s, scale: newScale } : s
            ));
        }
    };

    const handleGlobalEnd = () => {
        setIsDragging(false);
        setIsResizing(false);
        setActiveSignatureId(null);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignaturePreview(null);
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        setSignaturePreview(dataUrl);
        toast.success("Signature saved! You can now add it to the page.");
    };

    useEffect(() => {
        if (activeTab === "draw" && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "#000000";
            }
        }
    }, [activeTab]);

    const handleSave = async () => {
        if (!file || placedSignatures.length === 0) return;
        setIsProcessing(true);
        setProgress(20);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(40);

            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            if (pdfDoc.isEncrypted) {
                toast.error("This PDF is password-protected. Please unlock it first.");
                setIsProcessing(false);
                setProgress(0);
                return;
            }

            const pages = pdfDoc.getPages();
            const embeddedImages: Record<string, any> = {};

            setProgress(60);

            for (const sig of placedSignatures) {
                if (!embeddedImages[sig.dataUrl]) {
                    const res = await fetch(sig.dataUrl);
                    const blob = await res.blob();
                    const sigBuffer = await blob.arrayBuffer();

                    if (blob.type === "image/png" || sig.dataUrl.startsWith("data:image/png")) {
                        embeddedImages[sig.dataUrl] = await pdfDoc.embedPng(sigBuffer);
                    } else {
                        embeddedImages[sig.dataUrl] = await pdfDoc.embedJpg(sigBuffer);
                    }
                }

                const signatureImage = embeddedImages[sig.dataUrl];
                const targetPage = pages[sig.pageNumber - 1];
                const { width, height } = targetPage.getSize();

                const maxWidth = 150 * sig.scale;
                const scale = maxWidth / signatureImage.width;
                const sigWidth = signatureImage.width * scale;
                const sigHeight = signatureImage.height * scale;

                const x = (sig.x / 100) * width - (sigWidth / 2);
                const y = height - ((sig.y / 100) * height) - (sigHeight / 2);

                targetPage.drawImage(signatureImage, {
                    x, y, width: sigWidth, height: sigHeight
                });
            }

            setProgress(80);

            const pdfBytes = await pdfDoc.save();
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`signed_${file.name}`);
            setFile(null);
            setPlacedSignatures([]);
            setSignaturePreview(null);
            setPdfDocument(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error saving signed PDF:", error);
            toast.error("An error occurred while saving the signed PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolWrapper
            title="Sign PDF"
            description="Draw or upload your signature, resize it, and place it anywhere on your PDF."
        >
            {resultUrl ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                        <Draw className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Signed Successfully!</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Your file has been signed and is ready for download.
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
                            className="flex-1 rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 transition-colors"
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
                            Sign Another
                        </button>
                    </div>
                </div>
            ) : !file ? (
                <DropZone
                    onFilesSelected={handleFileSelected}
                    accept=".pdf"
                    multiple={false}
                    title="Select PDF file to sign"
                    description="Drag & drop a PDF file here, or click to browse"
                />
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 font-bold text-xs">
                                PDF
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
                            onClick={() => {
                                setFile(null);
                                setPreviewDataUrl(null);
                                setPdfDocument(null);
                                setPlacedSignatures([]);
                            }}
                            disabled={isProcessing}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Live Preview */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span>Live Preview</span>
                                <span className="text-xs font-normal text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                    Page {selectedPage} of {totalPages}
                                </span>
                            </h4>
                            {placedSignatures.some(s => s.pageNumber === selectedPage) && (
                                <span className="text-xs font-normal text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                    <TouchApp className="h-4 w-4" /> Drag to move, use corner to resize
                                </span>
                            )}
                        </div>

                        {/* Page Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <button
                                    onClick={() => handlePageChange(selectedPage - 1)}
                                    disabled={selectedPage <= 1 || isLoadingPreview}
                                    className="px-3 py-1 text-sm font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Page {selectedPage}
                                </span>
                                <button
                                    onClick={() => handlePageChange(selectedPage + 1)}
                                    disabled={selectedPage >= totalPages || isLoadingPreview}
                                    className="px-3 py-1 text-sm font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {isLoadingPreview ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating preview...</p>
                            </div>
                        ) : previewDataUrl ? (
                            <div
                                className="relative flex items-center justify-center bg-zinc-200 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden p-4 min-h-[300px]"
                                onMouseMove={handleGlobalMove}
                                onMouseUp={handleGlobalEnd}
                                onMouseLeave={handleGlobalEnd}
                                onTouchMove={handleGlobalMove}
                                onTouchEnd={handleGlobalEnd}
                            >
                                <div
                                    ref={previewContainerRef}
                                    className="relative inline-block max-w-full max-h-[500px]"
                                >
                                    <img
                                        src={previewDataUrl}
                                        alt="PDF Preview"
                                        className="max-h-[500px] w-auto object-contain shadow-md pointer-events-none"
                                    />
                                    {/* Render all signatures for the current page */}
                                    {placedSignatures.filter(s => s.pageNumber === selectedPage).map(sig => (
                                        <div
                                            key={sig.id}
                                            className="absolute cursor-move touch-none"
                                            style={{
                                                left: `${sig.x}%`,
                                                top: `${sig.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                width: `${150 * sig.scale}px`,
                                                zIndex: activeSignatureId === sig.id ? 20 : 10,
                                            }}
                                            onMouseDown={(e) => handleDragStart(e, sig.id)}
                                            onTouchStart={(e) => handleDragStart(e, sig.id)}
                                        >
                                            <div className={`relative p-1 rounded border-2 ${activeSignatureId === sig.id ? 'border-purple-500 bg-purple-500/10' : 'border-transparent hover:border-purple-500/50'} transition-colors group`}>
                                                <img
                                                    src={sig.dataUrl}
                                                    alt="Signature Overlay"
                                                    className="w-full h-auto object-contain opacity-90 mix-blend-multiply dark:mix-blend-normal pointer-events-none"
                                                />
                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteSignature(sig.id);
                                                    }}
                                                    className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <Close className="h-4 w-4" />
                                                </button>
                                                {/* Resize Handle */}
                                                <div
                                                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-purple-500 rounded-full cursor-se-resize border-2 border-white dark:border-zinc-900 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onMouseDown={(e) => handleResizeStart(e, sig.id)}
                                                    onTouchStart={(e) => handleResizeStart(e, sig.id)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Signature Input */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Signature Source</h4>
                            <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab("draw")}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "draw" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                                >
                                    Draw
                                </button>
                                <button
                                    onClick={() => setActiveTab("upload")}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "upload" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {activeTab === "draw" ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden">
                                    <canvas
                                        ref={canvasRef}
                                        width={400}
                                        height={200}
                                        className="w-full h-[200px] touch-none cursor-crosshair bg-white"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />
                                </div>
                                <div className="flex gap-4 w-full max-w-md">
                                    <button
                                        onClick={clearCanvas}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
                                    >
                                        <Clear className="h-4 w-4" /> Clear
                                    </button>
                                    <button
                                        onClick={saveCanvas}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                                    >
                                        <Save className="h-4 w-4" /> Save Signature
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors bg-white dark:bg-zinc-950"
                            >
                                <UploadFile className="h-8 w-8 text-zinc-400 mb-2" />
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Click to upload signature (PNG, JPG)</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleSignatureSelected}
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                />
                            </div>
                        )}

                        {/* Add to Page Button */}
                        {signaturePreview && (
                            <div className="mt-4 flex flex-col items-center border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Signature ready. Click below to add it to the current page.</p>
                                <button
                                    onClick={addSignatureToPage}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors shadow-sm"
                                >
                                    <Add className="h-5 w-5" /> Add Signature to Page {selectedPage}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Button & Progress */}
                    <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        {isProcessing ? (
                            <div className="w-full">
                                <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    <span>Signing PDF...</span>
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
                                onClick={handleSave}
                                disabled={placedSignatures.length === 0}
                                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 ${placedSignatures.length > 0 ? "bg-purple-500 shadow-purple-500/20 hover:bg-purple-600" : "bg-zinc-400 cursor-not-allowed dark:bg-zinc-700"}`}
                            >
                                <Draw className="h-5 w-5" />
                                Sign & Download PDF
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolWrapper>
    );
}
