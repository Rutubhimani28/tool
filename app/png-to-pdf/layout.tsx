import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PNG to PDF Free Online | PDFImageConvert",
    description: "Convert PNG images into a single PDF document.",
    alternates: {
        canonical: "/png-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
