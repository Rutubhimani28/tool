import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Resizer Free Online | PDFImageConvert",
    description: "Resize your images to custom dimensions or scale them by percentage.",
    alternates: {
        canonical: "/image-resizer",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
