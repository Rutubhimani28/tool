import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unlock PDF - Free Online Tool | PDFImageConvert",
    description: "Remove password protection and restrictions from your PDF. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/unlock-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
