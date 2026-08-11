import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rearrange PDF - Free Online Tool | PDFImageConvert",
    description: "Drag and drop page thumbnails to reorder them in your PDF. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/rearrange-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
