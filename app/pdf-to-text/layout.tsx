import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to Text - Free Online Tool | PDFImageConvert",
    description: "Extract all text from a PDF document and download it as a TXT file. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-text",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
