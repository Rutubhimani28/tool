import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF Redaction - Free Online Tool | PDFImageConvert",
    description: "Permanently blackout sensitive information in your PDF. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-redaction",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
