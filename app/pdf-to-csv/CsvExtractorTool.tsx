"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { extractCsvFromPdf } from "./utils";
import { TableView, ArrowRightAlt } from "@mui/icons-material";
import Link from "next/link";

export default function CsvExtractorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [csvData, setCsvData] = useState<string | null>(null);
    const [resultFileName, setResultFileName] = useState("");

    const handleFileSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const selectedFile = selectedFiles[0];
        setFile(selectedFile);
        setCsvData(null);
        setIsProcessing(true);
        setProgress(0);

        try {
            const buffer = await selectedFile.arrayBuffer();
            const csv = await extractCsvFromPdf(buffer, setProgress);
            setCsvData(csv);
            setResultFileName(`${selectedFile.name.replace(".pdf", "")}_extracted.csv`);
            toast.success("Table data extracted successfully!");
        } catch (error) {
            console.error("Error extracting CSV:", error);
            toast.error("An error occurred while extracting data.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    return (
        <>
            <ToolWrapper
                title="PDF to CSV Extractor"
                description="Extract tables and tabular data from your PDF into a CSV file. 100% secure, processed locally in your browser."
            >
                {!file && !isProcessing ? (
                    <DropZone
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        multiple={false}
                        title="Select PDF file to extract tables"
                        description="Drag & drop a PDF file here, or click to browse"
                    />
                ) : isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin mb-6 dark:border-zinc-800 dark:border-t-blue-400"></div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Extracting Data...</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-md">
                            Analyzing PDF structure and extracting tabular data.
                        </p>
                        <div className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : csvData ? (
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                        {file?.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Data Extracted
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-auto border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-900 p-4 max-h-[400px]">
                            <pre className="text-xs text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                                {csvData || "No tabular data found."}
                            </pre>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                            <button
                                onClick={() => {
                                    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = resultFileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200"
                            >
                                <TableView className="h-5 w-5" />
                                Download CSV
                            </button>
                            <button
                                onClick={() => {
                                    setCsvData(null);
                                    setFile(null);
                                }}
                                className="flex-1 rounded-xl bg-zinc-800 px-4 py-4 text-base font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                            >
                                Extract Another
                            </button>
                        </div>
                    </div>
                ) : null}
            </ToolWrapper>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Extract Tables from PDF to CSV</h2>
                    <p className="text-lg mb-8">
                        Easily extract tabular data and tables from your PDF documents into a structured CSV format. Our PDF to CSV extractor intelligently parses your document to find data tables and exports them into a format ready for Excel, Google Sheets, or any database.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Why Convert PDF to CSV?</h3>
                    <p className="mb-6">
                        PDFs are great for presenting data, but terrible for analyzing it. If you receive financial reports, invoices, or research data in a PDF, manually copying and pasting tables is tedious and prone to errors. Converting the PDF to a CSV (Comma Separated Values) file allows you to instantly import the data into spreadsheet software for sorting, filtering, and calculation.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to Extract Data to CSV</h3>
                    <p className="mb-4">Follow these simple steps to extract your tables:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Upload your PDF:</strong> Drag and drop your document containing tables into the upload area.</li>
                        <li><strong>Automatic Extraction:</strong> Our tool will analyze the document structure and extract the tabular data automatically.</li>
                        <li><strong>Download CSV:</strong> Preview the extracted data and download it as a CSV file with a single click.</li>
                    </ol>

                                        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Privacy and Local Processing</h3>
                    <p className="mb-6">
                        Your privacy is our top priority. Unlike many other online tools that upload your sensitive documents to remote cloud servers, <strong>our tool processes your files 100% locally in your browser</strong>. Your files never leave your device, ensuring absolute confidentiality and security. This makes our tool safe for processing financial records, legal contracts, and personal identification documents.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-6 mb-12">
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Does it work with scanned PDFs?</h4>
                            <p>Currently, our tool works best with native, text-based PDFs where the tabular data is selectable. Scanned documents (images of text) require OCR technology, which is not yet supported in this browser-based tool.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Can I open the CSV in Excel?</h4>
                            <p>Yes! CSV files are universally supported by all spreadsheet applications, including Microsoft Excel, Google Sheets, and Apple Numbers.</p>
                        </div>
                    </div>

                    {/* Related Tools */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/pdf-to-text" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to Text</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all plain text from your PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/extract-images-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Extract Images</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Extract all embedded images from a PDF document.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/pdf-to-word" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">PDF to Word</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Convert PDF documents into editable Word files.</p>
                                </div>
                                <ArrowRightAlt className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="/protect-pdf" className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 transition-colors group">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Protect PDF</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Encrypt your PDF with a secure password.</p>
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
