import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watermark PDF Free Online | PDFImageConvert",
    description: "Stamp an image or text over your PDF in seconds.",
    alternates: {
        canonical: "/watermark-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
