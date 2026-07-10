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
            // Basic validation
            const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
            const matchesType = acceptedTypes.some((type) => {
                if (type.startsWith(".")) {
                    return fileExtension === type.toLowerCase();
                }
                if (type.endsWith("/*")) {
                    const category = type.split("/")[0];
                    return file.type.startsWith(category + "/");
                }
                return file.type === type;
            });

            if (matchesType) {
                files.push(file);
            }
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

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${isDragActive
                ? "border-red-500 bg-red-50/50 dark:bg-red-950/10"
                : "border-zinc-200 bg-zinc-50/50 hover:border-red-400 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-red-500/50 dark:hover:bg-zinc-900/50"
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

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-600 shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:text-red-400">
                <CloudUpload className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white">
                {title}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {description}
            </p>
        </div>
    );
}
