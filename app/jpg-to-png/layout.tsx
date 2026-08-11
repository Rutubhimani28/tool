import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert JPG to PNG - Free Online Tool | PDFImageConvert",
    description: "Convert JPG images to PNG format. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/jpg-to-png",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
