"use client";

import React, { useState, useRef } from "react";
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
  ArrowRightAlt,
  ArrowBack,
  ArrowForward,
  FolderZip,
} from "@mui/icons-material";

import { tools } from "./data/tools";

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
  const [faqIndex, setFaqIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchEnd(null);
    setTouchStart(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchEnd(clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setFaqIndex((prev) => (prev + 1) % 6);
    }
    if (isRightSwipe) {
      setFaqIndex((prev) => (prev - 1 + 6) % 6);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

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
      <section className="relative overflow-hidden bg-white px-4 pt-8 pb-4 sm:px-6 sm:pt-12 sm:pb-8 lg:px-8 dark:bg-zinc-950">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-red-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text & CTA */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                PDF to Image Converter Free Online
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The best free online PDF to image converter. Convert, edit, merge, and manage your documents and images. Fast, reliable, and 100% local processing.
              </p>

              {/* CTA */}
              {/* <div className="mt-10 flex justify-center lg:justify-start">
                <a href="#tools" className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-200">
                  Explore All Tools
                </a>
              </div> */}

              {/* Trust Indicators */}
            </div>

            {/* Right Column: Visual Composition */}
            <div className="relative h-[300px] sm:h-[350px] w-full mt-4 lg:mt-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-[500px] h-[350px] scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
                {/* Main PDF Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 flex flex-col items-center justify-center p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Description className="h-24 w-24 text-red-500 mb-6" />
                  <div className="w-3/4 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4"></div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4"></div>
                  <div className="w-5/6 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                </div>

                {/* JPG Card */}
                <div className="absolute top-[15%] right-[5%] w-36 h-36 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-20 flex flex-col items-center justify-center p-4 transform rotate-12 hover:rotate-0 transition-transform duration-500 hover:scale-110">
                  <ImageIcon className="h-12 w-12 text-blue-500 mb-3" />
                  <span className="font-bold text-zinc-900 dark:text-white">JPG</span>
                </div>

                {/* PNG Card */}
                <div className="absolute bottom-[15%] left-[5%] w-36 h-36 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-20 flex flex-col items-center justify-center p-4 transform -rotate-12 hover:rotate-0 transition-transform duration-500 hover:scale-110">
                  <ImageIcon className="h-12 w-12 text-green-500 mb-3" />
                  <span className="font-bold text-zinc-900 dark:text-white">PNG</span>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-[15%] w-24 h-24 border-t-2 border-r-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-tr-3xl -z-10 opacity-50"></div>
                <div className="absolute bottom-1/2 left-[15%] w-24 h-24 border-b-2 border-l-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-bl-3xl -z-10 opacity-50"></div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* Search & Categories Section */}
      <section id="tools" className="scroll-mt-20 bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          {/* Search Bar */}
          <div className="mx-auto max-w-lg">
            <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400 transition-all duration-200">
              <Search className="h-5 w-5 flex-shrink-0 text-zinc-400" />
              <input
                id="search-input"
                name="search-input"
                aria-label="Search tools"
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 bg-transparent py-3.5 pl-3 pr-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Category Filters */}
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
      {/* Privacy First: 100% Local Processing Feature Section */}
      <section className="bg-white dark:bg-zinc-950 py-16 sm:py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-6">
            100% Local Processing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 mb-12">
            Unlike other tools that upload your sensitive documents to the cloud, PDFImageConvert processes everything directly inside your browser. Your files never leave your device.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-6">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Absolute Privacy</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Your files are never uploaded to any server. No one can access your documents except you.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-6">
                <Transform className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Skip the upload and download wait times. Processing happens instantly using your device's power.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-6">
                <FolderZip className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">No Server Limits</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Since there are no servers involved, we don't impose artificial limits. Process files as large as your device's memory can handle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Supported Formats */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-12 sm:py-16 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* How It Works */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Convert your PDF files to high-quality images in three simple steps. No technical skills required.
              </p>
              <div className="mt-8 space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Select a Tool</h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Choose the specific tool you need from our collection (e.g., PDF to JPG, Merge PDF).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Upload Files</h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Drag and drop your files into the upload area or click to select them from your device.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Download Result</h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Click convert and download your processed files instantly. Files are securely deleted afterwards.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 sm:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8 text-center">
                Supported Conversions
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <Description className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">PDF</span>
                  </div>
                  <ArrowRightAlt className="h-6 w-6 text-zinc-400" />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-white">JPG</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <Description className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">PDF</span>
                  </div>
                  <ArrowRightAlt className="h-6 w-6 text-zinc-400" />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-white">PNG</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <Description className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">PDF</span>
                  </div>
                  <ArrowRightAlt className="h-6 w-6 text-zinc-400" />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-white">WEBP</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <Collections className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">Multiple PDFs</span>
                  </div>
                  <ArrowRightAlt className="h-6 w-6 text-zinc-400" />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-white">ZIP</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <FolderZip className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SEO Content & FAQ Section */}
      <section className="bg-white dark:bg-zinc-950 py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              The Best PDF to Image Converter Free Online
            </h2>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              In today's digital landscape, the Portable Document Format (PDF) is the standard for sharing documents. However, there are many situations where an image format like JPG, PNG, or WebP is more suitable. Whether you're a student, professional, or casual user, using a PDF to image converter free online can significantly improve your workflow.
            </p>

            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">
              What is PDF to Image Conversion?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              PDF to image conversion is the process of extracting the visual content of a PDF document and saving it as a standard image file. Unlike PDFs, which can contain text, fonts, vector graphics, and interactive elements, image files are rasterized—meaning they are composed of a grid of pixels. This makes them universally viewable on any device without the need for specialized PDF reader software.
            </p>

            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">
              Why Convert PDFs to Images?
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-zinc-600 dark:text-zinc-400 mb-8">
              <li><strong>Social Media Sharing:</strong> Platforms like Instagram, Facebook, and X (Twitter) do not support direct PDF uploads. Converting your document to a high-quality JPG or PNG allows you to share your content effortlessly.</li>
              <li><strong>Web Design and Development:</strong> Embedding a PDF on a website often requires third-party plugins or forces the user to download the file. Images can be displayed natively in any web browser, improving user experience and page load times.</li>
              <li><strong>Presentations:</strong> When building a PowerPoint or Keynote presentation, inserting images is much easier and more reliable than embedding PDF files.</li>
              <li><strong>Security and Immutability:</strong> While PDFs can be edited with the right software, a rasterized image is much harder to alter. If you want to share a document and ensure the text cannot be easily copied or modified, converting it to an image is a simple solution.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">
              JPG vs. PNG vs. WebP: Which Format Should You Choose?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              Choosing the right output format is crucial for balancing image quality and file size. Here is a quick breakdown:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">JPG (JPEG)</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Best for photographs and complex images. It uses lossy compression, meaning it reduces file size by discarding some data, which may result in a slight loss of quality.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">PNG</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Ideal for documents with text, line art, and transparent backgrounds. It uses lossless compression, ensuring crisp text and no quality degradation, but file sizes are larger.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">WebP</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">The modern web standard. It provides superior compression compared to JPG and PNG, offering high quality at significantly smaller file sizes. Perfect for websites.</p>
              </div>
            </div>

            <div className="mt-16 mb-10 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white m-0">
                Most people ask about
              </h3>
              <div className="flex items-center gap-2">
                <button
                  suppressHydrationWarning
                  onClick={() => setFaqIndex((prev) => (prev - 1 + 6) % 6)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  aria-label="Previous FAQ"
                >
                  <ArrowBack className="h-5 w-5" />
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setFaqIndex((prev) => (prev + 1) % 6)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  aria-label="Next FAQ"
                >
                  <ArrowForward className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className="relative h-[380px] w-full flex items-center justify-center py-4 cursor-grab active:cursor-grabbing select-none overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              {[
                {
                  q: "Is my PDF secure?",
                  a: "Absolutely. We prioritize your privacy. All file processing happens locally directly on your device (in your browser). Your files are never uploaded to our servers, meaning no one else can ever access them."
                },
                {
                  q: "Is it really free?",
                  a: "Yes, our tool is 100% free to use. There are no hidden fees, no watermarks added to your images, and no registration required to access the core features."
                },
                {
                  q: "Maximum file size?",
                  a: "Because all processing happens locally in your browser, there is no strict file size limit. However, very large files (e.g., over 100MB) might take longer to process depending on your device's memory."
                },
                {
                  q: "Does it work on mobile?",
                  a: "Yes! Our website is fully responsive and works seamlessly on smartphones and tablets (iOS and Android). You can convert PDFs directly from your mobile browser without installing any apps."
                },
                {
                  q: "Can I convert multiple PDFs?",
                  a: "Yes, our tool supports batch conversion. If you upload a multi-page PDF, we will convert every page into a separate image file, which you can download individually or as a convenient ZIP archive."
                },
                {
                  q: "Can I convert scanned PDFs?",
                  a: "Yes, our tool can convert scanned PDFs into images perfectly. Since we render the PDF exactly as it appears, scanned pages will be converted into high-quality JPG or PNG files."
                }
              ].map((faq, index) => {
                let offset = index - faqIndex;
                if (offset < -2) offset += 6;
                if (offset > 3) offset -= 6;

                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isHidden = offset < -1 || offset > 1;

                let positionClass = '';
                if (isLeft) {
                  positionClass = '-translate-x-[50%] sm:-translate-x-[75%] scale-[0.85] z-0 opacity-60';
                } else if (isRight) {
                  positionClass = 'translate-x-[50%] sm:translate-x-[75%] scale-[0.85] z-0 opacity-60';
                } else if (isHidden) {
                  positionClass = `${offset < 0 ? '-translate-x-[150%]' : 'translate-x-[150%]'} scale-50 -z-10 opacity-0 pointer-events-none`;
                } else {
                  positionClass = 'translate-x-0 scale-100 z-10 opacity-100';
                }

                return (
                  <div
                    key={index}
                    className={`absolute transition-all duration-500 ease-in-out w-[280px] sm:w-[320px] rounded-2xl border p-6 flex flex-col h-[320px] ${isCenter
                      ? 'border-blue-500 bg-white dark:bg-zinc-950 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)]'
                      : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900'
                      } ${positionClass}`}
                  >
                    <h4 className={`text-lg font-bold mb-3 ${isCenter ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'}`}>
                      {faq.q}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-grow">
                      {faq.a}
                    </p>
                    <Link href="/faq" className={`mt-6 text-sm font-semibold inline-flex items-center ${isCenter ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'}`}>
                      Read More FAQ
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
