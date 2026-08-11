import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Number PDF - Free Online Tool | PDFImageConvert",
    description: "Easily insert page numbers into your PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/page-number-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
