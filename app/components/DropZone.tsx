"use client";

import React, { useRef, useState } from "react";
import { CloudUpload } from "@mui/icons-material";

interface DropZoneProps {
    onFilesSelected: (files: File[]) => void;
    accept: string;
    multiple?: boolean;
    title?: string;
    description?: string;
}

export default function DropZone({
    onFilesSelected,
    accept,
    multiple = false,
    title = "Drag & drop files here",
    description = "or click to browse from your device",
}: DropZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const processFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const files: File[] = [];
        const acceptedTypes = accept.split(",").map((t) => t.trim());

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
            const matchesType = acceptedTypes.some((type) => {
                if (type.startsWith(".")) return fileExtension === type.toLowerCase();
                if (type.endsWith("/*")) return file.type.startsWith(type.split("/")[0] + "/");
                return file.type === type;
            });
            if (matchesType) files.push(file);
        }

        if (files.length > 0) {
            onFilesSelected(multiple ? files : [files[0]]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        processFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Format accepted types for display
    const acceptedTypesDisplay = accept
        .split(",")
        .map((t) => t.trim().replace(".", "").toUpperCase())
        .join(", ");

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer select-none ${isDragActive
                    ? "border-red-500 bg-red-50/60 dark:bg-red-950/20 scale-[1.01]"
                    : "border-zinc-300 bg-zinc-50/50 hover:border-red-400 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-900/30 dark:hover:border-red-500/60 dark:hover:bg-zinc-900/50"
                }`}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
            />

            {/* Upload icon with pulse animation when idle */}
            <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300
                    ${isDragActive
                        ? "border-red-200 bg-red-50 text-red-500 dark:bg-red-950/30 dark:border-red-900 scale-110"
                        : "border-zinc-100 bg-white text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-500 group-hover:scale-110 group-hover:text-red-500 group-hover:border-red-100 dark:group-hover:text-red-400 animate-pulse-soft"
                    }`}
            >
                <CloudUpload className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-zinc-800 dark:text-zinc-200">
                {title}
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {description}
            </p>

            {/* Accepted file types badge */}
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {acceptedTypesDisplay.split(", ").map((ext) => (
                    <span
                        key={ext}
                        className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                        .{ext.toLowerCase()}
                    </span>
                ))}
            </div>

            {/* Click prompt */}
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
                {multiple ? "Select multiple files" : "Maximum file size: 100MB"}
            </p>
        </div>
    );
}
