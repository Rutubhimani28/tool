import React from "react";
import Link from "next/link";
import { ArrowBack, Article } from "@mui/icons-material";
import { articles } from "../data/articles";

export default function BlogPage() {
    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 flex flex-col">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors group"
                >
                    <ArrowBack className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Home
                </Link>
            </div>

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-4">
                    Our Blog
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                    Discover tips, guides, and insights on managing PDFs, optimizing images, and improving your digital workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {articles.map((article, index) => {
                    const gradients = [
                        "from-pink-500 via-red-500 to-yellow-500",
                        "from-green-400 via-cyan-500 to-blue-500",
                        "from-indigo-500 via-purple-500 to-pink-500",
                        "from-blue-400 via-indigo-500 to-purple-600",
                        "from-orange-400 via-red-500 to-rose-600",
                        "from-teal-400 via-emerald-500 to-green-600",
                    ];
                    const gradient = gradients[index % gradients.length];
                    const dateObj = new Date(article.date);

                    return (
                        <Link
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className="group flex flex-col rounded-[2rem] bg-white dark:bg-zinc-900 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-zinc-100 dark:border-zinc-800"
                        >
                            {/* Cover Image Area (Gradient) */}
                            <div className={`h-52 w-full bg-gradient-to-br ${gradient} relative overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out`}>
                                {/* Overlay pattern */}
                                <div className="absolute inset-0 opacity-20 dark:opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                                {/* Category Badge floating on image */}
                                <div className="absolute top-5 left-5">
                                    <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-zinc-900 dark:text-white shadow-sm uppercase tracking-wider">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col flex-1 p-6 sm:p-8 relative bg-white dark:bg-zinc-900 z-10">
                                {/* Floating Date Badge */}
                                <div className="absolute -top-8 right-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg px-4 py-3 border border-zinc-100 dark:border-zinc-800 text-center transform group-hover:-translate-y-1 transition-transform duration-300">
                                    <span className="block text-xl font-black text-zinc-900 dark:text-white leading-none">
                                        {dateObj.getDate()}
                                    </span>
                                    <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                        {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-4 line-clamp-2 mt-2 leading-tight">
                                    {article.title}
                                </h2>

                                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 mb-8 line-clamp-3">
                                    {article.description}
                                </p>

                                <div className="flex items-center mt-auto pt-5 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <span className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        Read Article
                                        <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">&rarr;</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
