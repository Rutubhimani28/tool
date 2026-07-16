"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack, ExpandMore } from "@mui/icons-material";

const faqs = [
    {
        question: "Is PDFImageConvert really free to use?",
        answer: "Yes, our core PDF and image conversion tools are completely free to use. There are no hidden charges, no subscription fees, and we do not add any watermarks to your processed documents. We believe in providing accessible tools for everyone."
    },
    {
        question: "Are my files secure and private?",
        answer: "Absolutely. We prioritize your privacy above all else. All our tools process files locally in your browser, meaning your data never leaves your device. We do not use servers to process your files, ensuring absolute privacy. We do not keep backups or logs of your files."
    },
    {
        question: "What file formats are supported by your platform?",
        answer: "We support a wide range of popular document and image formats. This includes PDF, Word (DOC/DOCX), JPG, PNG, WEBP, and GIF. Our platform allows you to seamlessly convert between these formats, such as PDF to JPG, Word to PDF, and PNG to JPG."
    },
    {
        question: "Is there a file size limit for uploads?",
        answer: "Since there are no servers involved, we don't impose artificial file size limits. You can process files as large as your device's memory can handle."
    },
    {
        question: "Do I need to install any software or extensions?",
        answer: "No, PDFImageConvert is a 100% web-based platform. You do not need to download or install any software, plugins, or browser extensions. You can access and use all our tools directly from your web browser on any device, including Windows, Mac, Linux, iOS, and Android."
    },
    {
        question: "Can I use PDFImageConvert on my mobile device?",
        answer: "Yes! Our website is fully responsive and optimized for mobile devices. You can easily merge PDFs, compress images, and convert formats using your smartphone or tablet's web browser, just as you would on a desktop computer."
    },
    {
        question: "How do I merge multiple PDF files into one?",
        answer: "Merging PDFs is simple. Navigate to our 'Merge PDF' tool, select or drag-and-drop the PDF files you want to combine, arrange them in your preferred order, and click the merge button. Your combined PDF will be ready to download in seconds."
    },
    {
        question: "Why should I convert my images to WebP format?",
        answer: "WebP is a modern image format that provides superior lossless and lossy compression for images on the web. Converting your JPG or PNG images to WebP can significantly reduce file sizes without sacrificing quality, leading to faster website loading times and reduced bandwidth usage."
    }
];

export default function FAQPage() {
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
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    Frequently Asked Questions
                </h1>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    Find answers to common questions about our tools, security, and usage.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <details
                        key={index}
                        className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-zinc-900 dark:text-white font-semibold">
                            <h2 className="text-lg">{faq.question}</h2>
                            <span className="shrink-0 rounded-full bg-zinc-100 p-1.5 text-zinc-900 dark:bg-zinc-800 dark:text-white sm:p-3">
                                <ExpandMore className="h-5 w-5 transition duration-300 group-open:-rotate-180" />
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
}
