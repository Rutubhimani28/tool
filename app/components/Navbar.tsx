"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DarkMode, LightMode, Menu, Close, MoreVert } from "@mui/icons-material";
import { useTheme } from "next-themes";

const navLinks = [
    { label: "Merge PDF", href: "/merge-pdf" },
    { label: "Split PDF", href: "/split-pdf" },
    { label: "Compress PDF", href: "/compress-pdf" },
];

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setDesktopMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                        <img src="/download.png" alt="Logo" className="h-full w-full object-contain scale-[1.6]" />
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link
                        href="/"
                        className="ml-1 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        All Tools
                    </Link>
                    <Link
                        href="/blog"
                        className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        Insights
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Desktop More Menu */}
                    <div className="hidden md:block relative" ref={menuRef}>
                        <button
                            onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200"
                            aria-label="More options"
                        >
                            <MoreVert className="h-4 w-4" />
                        </button>

                        {desktopMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 py-2 z-50">
                                <Link
                                    href="/about"
                                    onClick={() => setDesktopMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setDesktopMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Contact Us
                                </Link>
                                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-1" />
                                <button
                                    onClick={() => {
                                        toggleDarkMode();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 flex items-center justify-between"
                                >
                                    <span>Theme</span>
                                    {mounted ? (
                                        resolvedTheme === "dark" ? (
                                            <LightMode className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <DarkMode className="h-4 w-4 text-zinc-700" />
                                        )
                                    ) : null}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger (mobile only) */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <Close className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[500px] border-t border-zinc-200 dark:border-zinc-800" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col px-4 py-3 gap-1 bg-white dark:bg-zinc-950">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        All Tools →
                    </Link>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-1" />
                    <Link
                        href="/blog"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        Insights
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        Contact Us
                    </Link>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-1" />
                    <button
                        onClick={() => {
                            toggleDarkMode();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-150"
                    >
                        <span>Theme</span>
                        {mounted ? (
                            resolvedTheme === "dark" ? (
                                <LightMode className="h-4 w-4 text-amber-500" />
                            ) : (
                                <DarkMode className="h-4 w-4 text-zinc-700" />
                            )
                        ) : null}
                    </button>
                </nav>
            </div>
        </header>
    );
}
