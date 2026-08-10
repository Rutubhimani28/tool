import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rearrange PDF Free Online | PDFImageConvert",
    description: "Drag and drop page thumbnails to reorder them in your PDF.",
    alternates: {
        canonical: "/rearrange-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
