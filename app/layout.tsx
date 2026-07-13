import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "PDFImageConvert – Free Online PDF & Image Tools",
  description:
    "Free, fast, and easy PDF and image tools. Convert, compress, merge, and edit your files in seconds.",
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
      className="h-full antialiased"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className={`${ibmPlexSans.className} antialiased min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300`}>
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
