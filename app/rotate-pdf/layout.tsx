import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rotate PDF - Free Online Tool | PDFImageConvert",
    description: "Rotate pages in your PDF document and save the changes. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/rotate-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
