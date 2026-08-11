import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rotate Image - Free Online Tool | PDFImageConvert",
    description: "Rotate your images left or right by 90 degrees. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/rotate-image",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
