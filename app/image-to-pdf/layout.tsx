import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image to PDF - Free Online Tool | PDFImageConvert",
    description: "Convert multiple images (JPG, PNG, WebP) into a single PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/image-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
