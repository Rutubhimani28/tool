import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Word to PDF - Free Online Tool | PDFImageConvert",
    description: "Convert Microsoft Word documents (.docx) to PDF format. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/word-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
