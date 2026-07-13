import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

export default function TermsPage() {
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
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                    Terms & Conditions
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        Welcome to PDFImageConvert. By accessing or using our website and tools, you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access the service.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">1. Use of Service</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                        PDFImageConvert provides a suite of online tools for processing PDF documents and images. You agree to use these tools only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-300 mb-6">
                        <li>You must not use our tools to process illegal, copyrighted (without permission), or malicious content.</li>
                        <li>You are solely responsible for the files you upload and process using our service.</li>
                        <li>We reserve the right to refuse service, terminate accounts, or restrict access at our discretion.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">2. Intellectual Property</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        The website, its original content, features, and functionality are owned by PDFImageConvert and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You retain all rights to the files you process using our tools.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">3. Disclaimer of Warranties</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        Our service is provided on an "AS IS" and "AS AVAILABLE" basis. PDFImageConvert makes no representations or warranties of any kind, express or implied, regarding the operation of the service, the accuracy of the tools, or the information, content, or materials included on the website. We do not warrant that the service will be uninterrupted, secure, or error-free.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">4. Limitation of Liability</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        In no event shall PDFImageConvert, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">5. Changes to Terms</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">Contact Us</h2>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        If you have any questions about these Terms, please contact us at support@pdfimageconvert.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
