import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert PNG to JPG - Free Online Tool | PDFImageConvert",
    description: "Convert PNG images to JPG format with custom background fill. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/png-to-jpg",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
