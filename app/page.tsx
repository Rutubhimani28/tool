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
  AspectRatio,
  Transform,
  Crop,
} from "@mui/icons-material";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: "organize" | "convert" | "optimize" | "security" | "image";
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  gradient: string;
  shadow: string;
}

const tools: Tool[] = [
  // PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document in seconds.",
    category: "organize",
    icon: Merge,
    href: "/merge-pdf",
    gradient: "from-red-500 to-rose-600",
    shadow: "shadow-red-500/20",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Extract specific pages or split a PDF into separate files.",
    category: "organize",
    icon: CallSplit,
    href: "/split-pdf",
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce the file size of your PDF while maintaining quality.",
    category: "optimize",
    icon: Compress,
    href: "/compress-pdf",
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word documents (.docx) to PDF format.",
    category: "convert",
    icon: Description,
    href: "/word-to-pdf",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract text from PDF and convert it back to Word format.",
    category: "convert",
    icon: TextSnippet,
    href: "/pdf-to-word",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert images (JPG, PNG) into a single PDF document.",
    category: "convert",
    icon: ImageIcon,
    href: "/jpg-to-pdf",
    gradient: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/20",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Extract pages of a PDF as high-quality JPG images.",
    category: "convert",
    icon: Collections,
    href: "/pdf-to-jpg",
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate pages in your PDF document and save the changes.",
    category: "organize",
    icon: RotateRight,
    href: "/rotate-pdf",
    gradient: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/20",
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password protection and restrictions from your PDF.",
    category: "security",
    icon: LockOpen,
    href: "/unlock-pdf",
    gradient: "from-zinc-600 to-zinc-800",
    shadow: "shadow-zinc-500/20",
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Encrypt your PDF with a secure password to prevent unauthorized access.",
    category: "security",
    icon: Lock,
    href: "/protect-pdf",
    gradient: "from-yellow-500 to-amber-600",
    shadow: "shadow-yellow-500/20",
  },

  // Image Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, or WebP images to reduce file size.",
    category: "image",
    icon: Compress,
    href: "/image-compressor",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize your images to custom dimensions or scale them by percentage.",
    category: "image",
    icon: AspectRatio,
    href: "/image-resizer",
    gradient: "from-blue-400 to-indigo-500",
    shadow: "shadow-blue-400/20",
  },

  {
    id: "png-to-jpg",
    name: "Convert PNG to JPG",
    description: "Convert PNG images to JPG format with custom background fill.",
    category: "image",
    icon: Transform,
    href: "/png-to-jpg",
    gradient: "from-cyan-400 to-sky-500",
    shadow: "shadow-cyan-400/20",
  },
  {
    id: "webp-converter",
    name: "WebP Converter",
    description: "Convert images to WebP format, or convert WebP files back to PNG/JPG.",
    category: "image",
    icon: Transform,
    href: "/webp-converter",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    description: "Crop and rotate your images interactively in your browser.",
    category: "image",
    icon: Crop,
    href: "/image-cropper",
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
];

const categories = [
  { id: "all", name: "All Tools" },
  { id: "organize", name: "Organize" },
  { id: "convert", name: "Convert" },
  { id: "optimize", name: "Optimize" },
  { id: "security", name: "Security" },
  { id: "image", name: "Image Tools" },
];

const categoryColorMap: Record<string, string> = {
  organize: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
  convert: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  optimize: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
  security: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  image: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
};

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

  const pdfTools = filteredTools.filter((t) => t.category !== "image");
  const imageTools = filteredTools.filter((t) => t.category === "image");

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 pt-12 pb-2 sm:px-6 sm:pt-16 sm:pb-4 lg:px-8 dark:bg-zinc-950 text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-red-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-4xl leading-tight">
            Craft Your PDFs & Images
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Free, fast, and easy PDF & image tools. Convert, compress, merge, and edit your files in seconds.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-white px-4 shadow-md shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400 transition-all duration-200">
              <Search className="h-5 w-5 flex-shrink-0 text-zinc-400" />
              <input
                name="input"
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 bg-transparent py-3.5 pl-3 pr-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Category Filters — horizontally scrollable on mobile */}
          <div className="mt-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === category.id
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

      {/* Tools Sections */}
      <section className="mx-auto max-w-[1600px] px-4 pt-8 pb-24 sm:px-6 lg:px-8 flex flex-col gap-16">
        {/* PDF Tools Section */}
        {pdfTools.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                PDF Utilities
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Merge, split, compress, convert, and secure your PDF documents.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
              {pdfTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl sm:rounded-3xl`} />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white shadow-md ${tool.shadow} transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${categoryColorMap[tool.category]}`}>
                          {tool.category}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
                        {tool.description}
                      </p>

                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Tools Section */}
        {imageTools.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Image Utilities
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Compress, resize, crop, convert, and remove backgrounds from images.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
              {imageTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl sm:rounded-3xl`} />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white shadow-md ${tool.shadow} transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${categoryColorMap[tool.category]}`}>
                          Image
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
                        {tool.description}
                      </p>

                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
              <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No tools found</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Try a different search term or select another category.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Show all tools
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
