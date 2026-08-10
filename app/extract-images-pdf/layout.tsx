import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Extract Images from PDF Free Online | PDFImageConvert",
    description: "Extract all embedded images from a PDF document.",
    alternates: {
        canonical: "/extract-images-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
