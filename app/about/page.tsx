import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

export default function AboutPage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 flex flex-col">
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
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-red-500 to-rose-600 mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    About Us
                </h1>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 mb-6">
                        Welcome to <strong>PDFImageConvert</strong>, your ultimate destination for seamless document and image management. We believe that handling files should be fast, secure, and completely free.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Our Mission</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        Our mission is to empower individuals and professionals by providing a comprehensive suite of tools that simplify everyday tasks. Whether you need to merge reports, compress heavy images, or convert formats on the fly, we've built a platform that works directly in your browser without the need for complex software installations.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc pl-5 space-y-3 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>Privacy First:</strong> We process your files locally in your browser whenever possible, and any files uploaded to our servers are automatically deleted after processing.</li>
                        <li><strong>Lightning Fast:</strong> Optimized algorithms ensure your files are ready in seconds.</li>
                        <li><strong>100% Free:</strong> No hidden fees, no subscriptions, and no watermarks on your documents.</li>
                        <li><strong>User-Friendly:</strong> A clean, intuitive interface designed for everyone, regardless of technical expertise.</li>
                    </ul>

                    <p className="text-zinc-600 dark:text-zinc-300 mt-8 leading-relaxed">
                        Thank you for choosing PDFImageConvert. We are constantly evolving and adding new features to make your digital life easier.
                    </p>
                </div>
            </div>
        </div>
    );
}
