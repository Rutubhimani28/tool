import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Merge PDF Free Online | PDFImageConvert",
    description: "Combine multiple PDF files into a single document in seconds.",
    alternates: {
        canonical: "/merge-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
