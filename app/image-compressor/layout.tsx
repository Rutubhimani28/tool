import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Compressor - Free Online Tool | PDFImageConvert",
    description: "Compress JPG, PNG, or WebP images to reduce file size. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/image-compressor",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
