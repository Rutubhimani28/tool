import React from "react";
import Link from "next/link";
import { PictureAsPdf } from "@mui/icons-material";

const quickLinks = [
    { label: "Merge PDF", href: "/merge-pdf" },
    { label: "Split PDF", href: "/split-pdf" },
    { label: "Compress PDF", href: "/compress-pdf" },
    { label: "Word to PDF", href: "/word-to-pdf" },
    { label: "PDF to Word", href: "/pdf-to-word" },
];

const moreLinks = [
    { label: "JPG to PDF", href: "/jpg-to-pdf" },
    { label: "PDF to JPG", href: "/pdf-to-jpg" },
    { label: "Rotate PDF", href: "/rotate-pdf" },
    { label: "Unlock PDF", href: "/unlock-pdf" },
    { label: "Protect PDF", href: "/protect-pdf" },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-colors duration-300">
            <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 dark:border-zinc-700 shadow-md shadow-red-500/20 overflow-hidden">
                                <img src="/icon.svg" alt="Logo" className="h-full w-full object-contain scale-[1.6]" />
                            </div>
                            <span className="text-lg font-bold text-zinc-900 dark:text-white">
                                PDFImage<span className="text-red-500">Convert</span>
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Your all-in-one platform for managing documents and images. Secure, fast, and completely free to use directly in your browser.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Popular Tools</h3>
                        <ul className="flex flex-col gap-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* More Tools */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">More Tools</h3>
                        <ul className="flex flex-col gap-2">
                            {moreLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Company</h3>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        © {new Date().getFullYear()} PDFImageConvert. All rights reserved.
                    </p>
                    <div className="flex gap-5 text-xs text-zinc-400 dark:text-zinc-500">
                        <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
