import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert JPG to PNG Free Online | PDFImageConvert",
    description: "Convert JPG images to PNG format.",
    alternates: {
        canonical: "/jpg-to-png",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
