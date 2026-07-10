import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDFCraft – Free Online PDF & Image Tools",
  description:
    "Free, fast, and easy PDF and image tools. Merge, split, compress, convert, rotate, protect PDF files, and compress, resize, crop, or remove backgrounds from images.",
  keywords: ["PDF tools", "image tools", "merge PDF", "compress PDF", "PDF to Word", "image compressor", "background remover"],
};

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeProvider } from "next-themes";

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: '!bg-white !text-zinc-900 dark:!bg-zinc-800 dark:!text-white border border-zinc-200 dark:border-zinc-700',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
