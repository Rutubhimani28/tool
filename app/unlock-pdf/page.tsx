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
    LockOpen, Visibility, VisibilityOff
} from "@mui/icons-material";

export default function UnlockPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setPassword("");
        setIsEncrypted(false);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

            if (pdfDoc.isEncrypted) {
                setIsEncrypted(true);
            } else {
                setIsEncrypted(false);
            }
        } catch (error: any) {
            console.error("Error loading PDF:", error);
            toast.error("Failed to load the PDF file.");
        }
    };

    const handleUnlock = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(20);

            let pdfBytes: Uint8Array;

            if (isEncrypted) {
                const originalWarn = console.warn;
                console.warn = () => { };
                try {
                    // Load PDF document using pdfjs-dist with password
                    const pdfjsLib = await import("pdfjs-dist");
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password, verbosity: 0 });
                    const pdf = await loadingTask.promise;
                    const numPages = pdf.numPages;
                    setProgress(40);

                    const pdfDoc = await PDFDocument.create();

                    for (let i = 1; i <= numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        if (!context) continue;

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Fill with white background to prevent transparent/black pages
                        context.fillStyle = "#ffffff";
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        await page.render({
                            canvasContext: context,
                            viewport: viewport,
                            canvas: canvas,
                        }).promise;

                        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
                        const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
                        const embeddedImg = await pdfDoc.embedJpg(imgBytes);

                        const { width, height } = embeddedImg.scale(1);
                        const newPage = pdfDoc.addPage([width, height]);
                        newPage.drawImage(embeddedImg, {
                            x: 0,
                            y: 0,
                            width,
                            height,
                        });

                        setProgress(40 + Math.round((i / numPages) * 40));
                    }

                    pdfBytes = await pdfDoc.save();
                } catch (err) {
                    console.error("Decryption error:", err);
                    toast.error("Incorrect password or decryption failed. Please try again.");
                    setIsProcessing(false);
                    return;
                } finally {
                    console.warn = originalWarn;
                }
            } else {
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                pdfBytes = await pdfDoc.save();
            }
            setProgress(90);

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setResultFileName(`${file.name.replace(".pdf", "")}_unlocked.pdf`);
            setFile(null);

            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } catch (error) {
            console.error("Error unlocking PDF:", error);
            toast.error("An error occurred while unlocking the PDF.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <>
            <ToolWrapper
                title="Unlock PDF"
                description="Remove password protection, security, and restrictions from your PDF document."
            >
                {resultUrl ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                            <LockOpen className="h-12 w-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF Unlocked Successfully!</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Your file has been unlocked and is ready for download.
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
                                className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-colors"
                            >
                                Unlock Another
                            </button>
                        </div>
                    </div>
                ) : !file ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to unlock"
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
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {isEncrypted ? "Locked 🔒" : "Not Locked 🔓"}
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

                        {/* Password Input */}
                        {isEncrypted ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUnlock();
                                }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="unlock-password" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Enter PDF Password
                                </label>
                                <div className="relative">
                                    {/* Hidden username field to prevent autofill warnings */}
                                    <input type="text" name="username" id="username" aria-label="Username" autoComplete="username" className="hidden" />
                                    <input
                                        id="unlock-password"
                                        name="unlock-password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-4 rounded-2xl bg-green-50 border border-green-100 dark:bg-green-950/10 dark:border-green-900/30 text-sm text-green-700 dark:text-green-400">
                                This PDF is not password-protected. You can save it to remove any other restrictions.
                            </div>
                        )}

                        {/* Action Button & Progress */}
                        <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                            {isProcessing ? (
                                <div className="w-full">
                                    <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                        <span>Unlocking PDF...</span>
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
                                    onClick={handleUnlock}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all duration-200"
                                >
                                    <LockOpen className="h-5 w-5" />
                                    Unlock PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Unlock PDF Instantly</h2>
                    <p className="text-lg mb-8">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Unlock PDF Files (Authorized Use Only)</h2>
                        <p className="text-lg mb-8">
                            Remove password protection from PDF files you own or have permission to edit. This tool works entirely in your browser; no file is uploaded or stored on our servers.
                        </p>
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is Unlock PDF?</h3>
                    <p className="mb-6">
                        This tool removes password protection and encryption from a PDF document <strong>that you are authorized to access</strong>. If you know the password to a file but want to remove it permanently for easier access, this tool will create an unlocked copy of the document. <strong>Please note:</strong> This tool does not "hack" or bypass unknown passwords. You must provide the correct password to unlock the file.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Unlock PDF</h3>
                    <p className="mb-4">Removing password protection takes only a few steps:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your files:</strong> Upload the password-protected PDF document.</li>
                        <li><strong>Adjust settings:</strong> Enter the current password for the file to prove you have authorized access.</li>
                        <li><strong>Process and Download:</strong> Click &quot;Unlock PDF&quot; to permanently remove the encryption and download the unlocked version of your file.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Easier Access</h3>
                    <p className="mb-6">
                        Remove the hassle of typing a password every time you need to open a frequently used document. If a file is no longer sensitive or is only stored on a secure personal device, unlocking it saves time and frustration.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Enable Editing</h3>
                    <p className="mb-6">
                        Many PDFs are locked not just from viewing, but from editing, printing, or copying text. Removing these restrictions allows you to fully interact with the document, extract necessary information, or make required changes.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Archiving</h3>
                    <p className="mb-6">
                        Store documents in an unlocked state to ensure they can be accessed in the future. Passwords are often forgotten over time, and unlocking a document before archiving it guarantees that the information remains accessible when you need it years later.
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
                            <Link href="/watermark-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Watermark PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stamp an image or text over your PDF in seconds.</p>
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
                            <Link href="/sign-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Sign PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Add your signature image to the first page of your PDF.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/png-to-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PNG to PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert PNG images into a single PDF document.</p>
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
