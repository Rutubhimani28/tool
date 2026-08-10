import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to WebP Free Online | PDFImageConvert",
    description: "Extract pages of a PDF as highly compressed WebP images.",
    alternates: {
        canonical: "/pdf-to-webp",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
