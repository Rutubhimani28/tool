import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to PNG Free Online | PDFImageConvert",
    description: "Extract pages of a PDF as high-quality PNG images.",
    alternates: {
        canonical: "/pdf-to-png",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
