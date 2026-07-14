"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowBack, Email, LocationOn } from "@mui/icons-material";

export default function ContactPage() {
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
                    Contact Us
                </h1>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    Have a question, feedback, or need support? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                                <Email className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 w-full">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Email Us</h3>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                    support@pdfimageconvert.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                                <LocationOn className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 w-full">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Location</h3>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                    Global Remote Team
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <form className="flex flex-col gap-5" onSubmit={(e) => {
                        e.preventDefault();
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const email = (document.getElementById('email') as HTMLInputElement).value;
                        const subject = (document.getElementById('subject') as HTMLInputElement).value;
                        const message = (document.getElementById('message') as HTMLTextAreaElement).value;

                        const mailtoLink = `mailto:support@pdfimageconvert.com?subject=${encodeURIComponent(subject || 'Contact from PDFImageConvert')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                        window.location.href = mailtoLink;
                    }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Your Name</label>
                                <input required type="text" id="name" autoComplete="name" className="rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" placeholder="John Doe" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                                <input required type="email" id="email" autoComplete="email" className="rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="subject" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                            <input required type="text" id="subject" autoComplete="off" className="rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" placeholder="How can we help?" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                            <textarea required id="message" autoComplete="off" rows={5} className="rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white resize-none" placeholder="Write your message here..."></textarea>
                        </div>
                        <button type="submit" className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
