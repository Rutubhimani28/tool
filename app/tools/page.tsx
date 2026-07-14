"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack, PictureAsPdf, Image, Compress, MergeType, Crop } from "@mui/icons-material";

const tools = [
    {
        title: "PDF to JPG",
        description: "Convert your PDF documents to high-quality JPG images instantly.",
        icon: <Image className="h-6 w-6" />,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
        title: "JPG to PDF",
        description: "Combine multiple JPG images into a single PDF document.",
        icon: <PictureAsPdf className="h-6 w-6" />,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30"
    },
    {
        title: "Compress PDF",
        description: "Reduce the file size of your PDF without losing quality.",
        icon: <Compress className="h-6 w-6" />,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
        title: "Merge PDF",
        description: "Combine multiple PDFs into one unified document easily.",
        icon: <MergeType className="h-6 w-6" />,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/30"
    },
    {
        title: "Crop Image",
        description: "Crop and resize your images to the perfect dimensions.",
        icon: <Crop className="h-6 w-6" />,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30"
    },
    {
        title: "PNG to PDF",
        description: "Convert PNG images into a high-quality PDF file.",
        icon: <PictureAsPdf className="h-6 w-6" />,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/30"
    }
];

export default function ToolsPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 flex flex-col">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors group"
                >
                    <ArrowBack className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Home
                </Link>
            </div>

            <div className="mb-8">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    All Tools
                </h1>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    Explore our collection of free, fast, and secure tools for all your PDF and image conversion needs.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <Link href="/" key={index} className="group block">
                        <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/30">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.color} transition-transform group-hover:scale-110`}>
                                    {tool.icon}
                                </div>
                                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {tool.title}
                                </h3>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                {tool.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
