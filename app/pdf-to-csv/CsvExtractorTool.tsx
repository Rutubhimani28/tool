"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import ToolWrapper from "@/app/components/ToolWrapper";
import DropZone from "@/app/components/DropZone";
import { extractCsvFromPdf } from "./utils";
import { TableView } from "@mui/icons-material";

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
    );
}
