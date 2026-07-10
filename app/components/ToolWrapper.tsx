"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

interface ToolWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function ToolWrapper({
    title,
    description,
    children,
}: ToolWrapperProps) {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                    <ArrowBack className="h-4 w-4" />
                    Back to Tools
                </Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
                    {description}
                </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 flex-1 flex flex-col justify-center min-h-[400px]">
                {children}
            </div>
        </div>
    );
}
