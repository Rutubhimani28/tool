import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Resizer - Free Online Tool | PDFImageConvert",
    description: "Resize your images to custom dimensions or scale them by percentage. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/image-resizer",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
