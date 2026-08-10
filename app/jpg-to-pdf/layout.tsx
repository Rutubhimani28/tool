import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JPG to PDF Free Online | PDFImageConvert",
    description: "Convert JPG images into a single PDF document.",
    alternates: {
        canonical: "/jpg-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
