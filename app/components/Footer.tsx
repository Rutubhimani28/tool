import React from "react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        &copy; {new Date().getFullYear()} PDFCraft. All processing is done client-side. Your files never leave your device.
                    </p>
                    <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
