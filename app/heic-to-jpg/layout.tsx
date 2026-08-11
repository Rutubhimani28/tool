import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert HEIC to JPG - Free Online Tool | PDFImageConvert",
    description: "Convert Apple HEIC images to standard JPG format. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/heic-to-jpg",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
