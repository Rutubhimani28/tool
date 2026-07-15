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
                        Our team of developers set out to create a suite of tools that operate entirely within your web browser whenever possible. This approach not only ensures lightning-fast processing speeds but also guarantees that your sensitive documents never leave your device unless absolutely necessary. We believe that powerful tools should be accessible to everyone, everywhere, without compromising on security or user experience.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">What We Offer</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        PDFImageConvert is a comprehensive platform designed to handle all your document and image processing needs. Whether you are a student preparing an assignment, a professional managing contracts, or simply someone looking to optimize photos for social media, we have the right tool for you.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>PDF Management:</strong> Merge multiple PDFs into a single document, split large files into manageable pieces, or compress them for easier sharing. We also offer tools to rotate pages, unlock secured PDFs, and add password protection to sensitive files.</li>
                        <li><strong>Format Conversion:</strong> Seamlessly convert documents between various formats. Transform Word documents into PDFs to preserve formatting, or convert PDFs back to editable Word files. We also support converting PDFs to high-quality JPGs and vice versa.</li>
                        <li><strong>Image Optimization:</strong> Resize images to specific dimensions, crop out unwanted areas, or compress large photos to save storage space. Our WebP converter helps you optimize images for web use, ensuring faster load times for your websites.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Our Core Values</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        Everything we do at PDFImageConvert is guided by a set of core values that prioritize the user experience above all else.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>Privacy First:</strong> We understand the importance of data security. That's why we prioritize local processing. When server processing is required, we use secure connections and automatically delete your files immediately after the task is completed. We never store, share, or analyze your documents.</li>
                        <li><strong>Uncompromising Speed:</strong> Time is valuable. Our tools are optimized to deliver results in seconds, not minutes. By leveraging modern web technologies, we ensure that your workflow remains uninterrupted.</li>
                        <li><strong>Absolute Simplicity:</strong> You shouldn't need a manual to use a document converter. Our intuitive interface is designed to be user-friendly, allowing anyone to perform complex tasks with just a few clicks.</li>
                        <li><strong>100% Free:</strong> We are committed to keeping our core tools free for everyone. There are no hidden fees, no restrictive paywalls, and absolutely no watermarks added to your documents.</li>
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
