"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Merge,
  CallSplit,
  Compress,
  Description,
  TextSnippet,
  Image as ImageIcon,
  Collections,
  RotateRight,
  LockOpen,
  Lock,
  Search,
} from "@mui/icons-material";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: "organize" | "convert" | "optimize" | "security";
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const tools: Tool[] = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document in seconds.",
    category: "organize",
    icon: Merge,
    href: "/merge-pdf",
    color: "from-red-500 to-rose-600 shadow-red-500/20",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Extract specific pages or split a PDF into separate files.",
    category: "organize",
    icon: CallSplit,
    href: "/split-pdf",
    color: "from-orange-500 to-amber-600 shadow-orange-500/20",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce the file size of your PDF while maintaining quality.",
    category: "optimize",
    icon: Compress,
    href: "/compress-pdf",
    color: "from-green-500 to-emerald-600 shadow-green-500/20",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word documents (.docx) to PDF format.",
    category: "convert",
    icon: Description,
    href: "/word-to-pdf",
    color: "from-blue-500 to-indigo-600 shadow-blue-500/20",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract text from PDF and convert it back to Word format.",
    category: "convert",
    icon: TextSnippet,
    href: "/pdf-to-word",
    color: "from-cyan-500 to-blue-600 shadow-cyan-500/20",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert images (JPG, PNG) into a single PDF document.",
    category: "convert",
    icon: ImageIcon,
    href: "/jpg-to-pdf",
    color: "from-purple-500 to-violet-600 shadow-purple-500/20",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Extract pages of a PDF as high-quality JPG images.",
    category: "convert",
    icon: Collections,
    href: "/pdf-to-jpg",
    color: "from-pink-500 to-rose-600 shadow-pink-500/20",
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate pages in your PDF document and save the changes.",
    category: "organize",
    icon: RotateRight,
    href: "/rotate-pdf",
    color: "from-teal-500 to-emerald-600 shadow-teal-500/20",
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password protection and restrictions from your PDF.",
    category: "security",
    icon: LockOpen,
    href: "/unlock-pdf",
    color: "from-gray-700 to-zinc-800 shadow-gray-700/20 dark:from-zinc-600 dark:to-zinc-700",
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Encrypt your PDF with a secure password to prevent unauthorized access.",
    category: "security",
    icon: Lock,
    href: "/protect-pdf",
    color: "from-yellow-500 to-amber-600 shadow-yellow-500/20",
  },
];

const categories = [
  { id: "all", name: "All Tools" },
  { id: "organize", name: "Organize" },
  { id: "convert", name: "Convert" },
  { id: "optimize", name: "Optimize" },
  { id: "security", name: "Security" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
            Craft Your PDFs,{" "}
            <span className="relative whitespace-nowrap text-red-500">
              <span className="relative">Entirely Offline</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-zinc-600 dark:text-zinc-400">
            Free, fast, and secure PDF tools. Your files never leave your computer.
            No sign-ups, no limits.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-md">
            <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-white px-4 shadow-md shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all duration-200">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 bg-transparent py-4 pl-3 pr-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr text-white shadow-md ${tool.color} transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 flex-1">
                  {tool.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-red-500 dark:text-red-400">
                  Open Tool
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              No tools found matching your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
