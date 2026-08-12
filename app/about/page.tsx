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
                        <strong>PDFImageConvert</strong> was created with a simple goal: to provide fast, secure, and free document tools that anyone can use without installing software. Our platform focuses on privacy, speed, and simplicity so users can manage PDFs and images directly from their browser.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Our Story</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        The idea for PDFImageConvert was born out of frustration. We noticed that many online document tools were either cluttered with ads, required expensive subscriptions, or forced users to download bulky software. We wanted to build something different—a platform that respects your time and privacy while delivering professional-grade results.
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We set out to create a suite of tools that operate entirely within your web browser. This approach not only ensures fast processing speeds but also helps keep your sensitive documents on your device. We believe that powerful tools should be accessible to everyone, everywhere, without compromising on security or user experience.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">What We Offer</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        PDFImageConvert is a growing suite of privacy-first document and image tools. All processing happens entirely within your browser using modern WebAssembly technology, not on our servers. Whether you are a student, a professional, or a freelancer, our tools are designed to be fast, simple, and secure.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>PDF Management:</strong> Merge, split, compress, rotate, and reorder pages in your PDF documents. Add password protection to sensitive files or remove passwords from documents you own.</li>
                        <li><strong>PDF Conversion:</strong> Convert PDF pages to high-quality JPG, PNG, or WebP images. Extract all text content from PDFs into editable TXT files. Convert Word documents to PDF format, preserving your layout and formatting.</li>
                        <li><strong>Image Tools:</strong> Resize, crop, compress, and rotate images. Convert between JPG, PNG, WebP, and HEIC formats. All image processing is fast and happens entirely in your browser.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Our Core Values</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        Everything we do at PDFImageConvert is guided by a set of core values that prioritize the user experience above all else.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>Privacy First:</strong> We understand the importance of data security. That&apos;s why we prioritize local processing. All our tools process files locally in your browser. Your files never leave your device, ensuring high privacy. We never store, share, or analyze your documents.</li>
                        <li><strong>Optimized Speed:</strong> Time is valuable. Our tools are optimized to deliver results quickly. By leveraging modern web technologies, we ensure that your workflow remains uninterrupted.</li>
                        <li><strong>Designed for Simplicity:</strong> You shouldn&apos;t need a manual to use a document converter. Our intuitive interface is designed to be user-friendly, allowing anyone to perform complex tasks with just a few clicks.</li>
                        <li><strong>100% Free:</strong> We are committed to keeping our core tools free for everyone. There are no hidden fees, no restrictive paywalls, and no watermarks added to your documents.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Looking Ahead</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        The digital landscape is constantly evolving, and so are we. We are continuously working to improve our existing tools and develop new features based on user feedback. Our goal is to remain at the forefront of online document processing, providing innovative solutions that meet the changing needs of our users.
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We actively listen to our community. If there is a specific tool or feature you would like to see on PDFImageConvert, we encourage you to reach out to us. Your input helps shape the future of our platform.
                    </p>

                    <p className="text-zinc-600 dark:text-zinc-300 mt-8 leading-relaxed font-medium">
                        Thank you for choosing PDFImageConvert. We are proud to be your trusted partner in document and image management.
                    </p>
                </div>
            </div>
        </div>
    );
}
