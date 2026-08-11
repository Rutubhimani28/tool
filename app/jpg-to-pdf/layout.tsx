import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JPG to PDF - Free Online Tool | PDFImageConvert",
    description: "Convert JPG images into a single PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/jpg-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
