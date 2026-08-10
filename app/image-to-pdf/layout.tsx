import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image to PDF Free Online | PDFImageConvert",
    description: "Convert multiple images (JPG, PNG, WebP) into a single PDF document.",
    alternates: {
        canonical: "/image-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
