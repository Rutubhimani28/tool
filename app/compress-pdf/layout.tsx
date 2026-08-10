import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compress PDF Free Online | PDFImageConvert",
    description: "Reduce the file size of your PDF while maintaining quality.",
    alternates: {
        canonical: "/compress-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
