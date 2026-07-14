"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack, ExpandMore } from "@mui/icons-material";

const faqs = [
    {
        question: "Is PDFImageConvert free to use?",
        answer: "Yes, our core PDF and image conversion tools are completely free to use without any hidden charges or watermarks."
    },
    {
        question: "Are my files secure?",
        answer: "Absolutely. We prioritize your privacy. All uploaded files are processed securely and are automatically deleted from our servers within 1 hour after conversion."
    },
    {
        question: "What file formats are supported?",
        answer: "We support a wide range of formats including PDF, JPG, PNG, WEBP, GIF, and more. You can easily convert between these formats using our tools."
    },
    {
        question: "Is there a file size limit?",
        answer: "Currently, the maximum file size limit for free users is 50MB per file. This ensures fast processing times for everyone."
    },
    {
        question: "Do I need to install any software?",
        answer: "No, PDFImageConvert is a 100% web-based tool. You can use it directly from your browser on any device (Windows, Mac, Linux, iOS, Android)."
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
