"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

interface ToolWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
    accentColor?: string; // e.g. "red", "blue", "green"
    className?: string; // optional additional classes for spacing/layout
}

export default function ToolWrapper({
    title,
    description,
    children,
    accentColor = "red",
    className,
}: ToolWrapperProps) {
    const accentMap: Record<string, string> = {
        red: "from-red-500 to-rose-600",
        blue: "from-blue-500 to-indigo-600",
        green: "from-green-500 to-emerald-600",
        cyan: "from-cyan-500 to-blue-600",
        purple: "from-purple-500 to-violet-600",
        pink: "from-pink-500 to-rose-600",
        orange: "from-orange-500 to-amber-600",
        teal: "from-teal-500 to-emerald-600",
        yellow: "from-yellow-500 to-amber-600",
        gray: "from-gray-600 to-zinc-700",
    };

    const gradient = accentMap[accentColor] ?? accentMap["red"];

    return (
        <div className={`mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 flex flex-col ${className ? className : ''}`}>
            {/* Back link */}
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors group"
                >
                    <ArrowBack className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Tools
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                {/* Gradient accent line */}
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${gradient} mb-4`} />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    {description}
                </p>
            </div>

            {/* Card */}
            <div className="flex-1 rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 flex flex-col justify-center min-h-[380px]">
                {children}
            </div>
        </div>
    );
}
