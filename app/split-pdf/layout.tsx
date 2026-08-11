import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Split PDF – Extract Pages from PDF Free Online",
    description: "Easily extract specific pages or split a PDF into multiple files. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/split-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
