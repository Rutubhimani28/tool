import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watermark PDF - Free Online Tool | PDFImageConvert",
    description: "Stamp an image or text over your PDF in seconds. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/watermark-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
