import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WebP Converter Free Online | PDFImageConvert",
    description: "Convert images to WebP format, or convert WebP files back to PNG/JPG.",
    alternates: {
        canonical: "/webp-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
