import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WebP Converter - Free Online Tool | PDFImageConvert",
    description: "Convert images to WebP format, or convert WebP files back to PNG/JPG. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/webp-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
