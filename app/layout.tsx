import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfimageconvert.com"),

  title:
    "PDF to Image Converter Free Online - Convert PDF to JPG/PNG | PDFImageConvert",

  description:
    "Best PDF to image converter free online. Convert PDF to JPG, PNG, or WebP in seconds. Fast, secure, and 100% local processing without uploading files.",

  keywords: [
    "pdf to image converter free online",
    "pdf to image",
    "pdf to png",
    "extract images from pdf",
    "pdf to jpg without upload",
    "local pdf converter",
    "PDF tools",
    "image tools",
  ],

  openGraph: {
    title: "PDF to Image Converter Free Online | PDFImageConvert",
    description: "Best PDF to image converter free online. Convert PDF to JPG, PNG, or WebP in seconds. Fast, secure, and 100% local processing.",
    url: "https://pdfimageconvert.com",
    siteName: "PDFImageConvert",
    type: "website",
    images: [
      {
        url: "https://pdfimageconvert.com/logo.png",
        width: 800,
        height: 600,
        alt: "PDFImageConvert Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PDF to Image Converter Free Online | PDFImageConvert",
    description: "Best PDF to image converter free online. Convert PDF to JPG, PNG, or WebP in seconds. Fast, secure, and 100% local processing.",
    images: ["https://pdfimageconvert.com/logo.png"],
  },

  icons: {
    icon: "/icon.png",
  },

  other: {
    "google-adsense-account": "ca-pub-7796384906806193",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://pdfimageconvert.com/#website",
      url: "https://pdfimageconvert.com",
      name: "PDFImageConvert",
      description: "Best PDF to image converter free online. Convert PDF to JPG, PNG, or WebP in seconds.",
      publisher: {
        "@id": "https://pdfimageconvert.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://pdfimageconvert.com/#organization",
      name: "PDFImageConvert",
      url: "https://pdfimageconvert.com",
      logo: {
        "@type": "ImageObject",
        url: "https://pdfimageconvert.com/logo.png",
      },
    },
  ],
};

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AdBanner from "@/app/components/AdBanner";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={`${ibmPlexSans.className} antialiased min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300 overflow-x-hidden`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7796384906806193"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="suppress-logs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                console.log = function() {};
                console.warn = function() {};
                console.error = function() {};
                console.info = function() {};
                console.debug = function() {};
              }
            `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              className: '!bg-zinc-900 !text-white dark:!bg-zinc-800 dark:!text-white border border-zinc-800 dark:border-zinc-700 shadow-2xl rounded-2xl font-medium px-5 py-4',
              error: {
                icon: '❌',
                className: '!bg-red-600 !text-white !border-red-700 dark:!bg-red-900 dark:!text-red-100 dark:!border-red-800 shadow-2xl shadow-red-900/50 rounded-2xl font-medium px-5 py-4',
                duration: 5000,
              },
              success: {
                icon: '✅',
                className: '!bg-green-600 !text-white !border-green-700 dark:!bg-green-900 dark:!text-green-100 dark:!border-green-800 shadow-2xl shadow-green-900/50 rounded-2xl font-medium px-5 py-4',
                duration: 4000,
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html >
  );
}
