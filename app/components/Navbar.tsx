"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PictureAsPdf, DarkMode, LightMode } from "@mui/icons-material";
import { useTheme } from "next-themes";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    const toggleDarkMode = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20 transition-transform group-hover:scale-105">
                            <PictureAsPdf className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
                            PDF<span className="text-red-500">Craft</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200"
                        aria-label="Toggle dark mode"
                    >
                        {mounted ? (
                            resolvedTheme === "dark" ? (
                                <LightMode className="h-5 w-5 text-amber-500" />
                            ) : (
                                <DarkMode className="h-5 w-5 text-zinc-700" />
                            )
                        ) : (
                            <div className="h-5 w-5 opacity-0" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
