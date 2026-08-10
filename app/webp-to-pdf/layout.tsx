import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WebP to PDF Free Online | PDFImageConvert",
    description: "Convert WebP images into a single PDF document.",
    alternates: {
        canonical: "/webp-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
