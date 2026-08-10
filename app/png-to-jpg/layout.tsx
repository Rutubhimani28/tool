import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert PNG to JPG Free Online | PDFImageConvert",
    description: "Convert PNG images to JPG format with custom background fill.",
    alternates: {
        canonical: "/png-to-jpg",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
