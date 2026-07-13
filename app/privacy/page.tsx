import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

export default function PrivacyPage() {
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
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        At PDFImageConvert, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information and files when you use our website and services.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">1. File Processing and Storage</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        Our core principle is that your files belong to you. When you use our tools to convert, merge, compress, or edit PDFs and images:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>Local Processing:</strong> Whenever technically possible, files are processed locally within your web browser. In these cases, your files never leave your device.</li>
                        <li><strong>Server Processing:</strong> For tools that require server-side processing, your files are uploaded over a secure, encrypted connection (HTTPS).</li>
                        <li><strong>Automatic Deletion:</strong> Any files uploaded to our servers are automatically and permanently deleted immediately after processing is complete. We do not keep backups or copies of your documents.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        We collect minimal information to ensure our service functions correctly:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li><strong>Usage Data:</strong> We may collect anonymous analytics data (such as pages visited, tools used, and browser type) to help us improve our platform.</li>
                        <li><strong>Contact Information:</strong> If you reach out to us via our Contact Us page, we will collect your name and email address solely for the purpose of responding to your inquiry.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">3. Cookies</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We use essential cookies to remember your preferences (such as dark mode settings). We do not use tracking cookies for targeted advertising. You can disable cookies in your browser settings, though some features of the site may not function properly.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">4. Third-Party Services</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We do not sell, trade, or rent your personal information or files to third parties. We may use trusted third-party service providers for hosting and analytics, who are bound by strict confidentiality agreements.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">5. Changes to This Policy</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Contact Us</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at support@pdfimageconvert.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
