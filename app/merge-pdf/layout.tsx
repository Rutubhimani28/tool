import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Merge PDF – Combine PDF Files Free Online",
    description: "Easily combine multiple PDF files into a single document. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/merge-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
