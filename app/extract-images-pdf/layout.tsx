import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Extract Images from PDF - Free Online Tool | PDFImageConvert",
    description: "Extract all embedded images from a PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/extract-images-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
