import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Protect PDF - Free Online Tool | PDFImageConvert",
    description: "Encrypt your PDF with a secure password to prevent unauthorized access. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/protect-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
