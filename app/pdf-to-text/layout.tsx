import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to Text Free Online | PDFImageConvert",
    description: "Extract all text from a PDF document and download it as a TXT file.",
    alternates: {
        canonical: "/pdf-to-text",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
