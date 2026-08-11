import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to WebP - Free Online Tool | PDFImageConvert",
    description: "Extract pages of a PDF as highly compressed WebP images. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-webp",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
