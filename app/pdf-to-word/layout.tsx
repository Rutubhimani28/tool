import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to Word Free Online | PDFImageConvert",
    description: "Extract text from PDF and convert it back to Word format.",
    alternates: {
        canonical: "/pdf-to-word",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
