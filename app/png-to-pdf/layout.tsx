import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PNG to PDF - Free Online Tool | PDFImageConvert",
    description: "Convert PNG images into a single PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/png-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
