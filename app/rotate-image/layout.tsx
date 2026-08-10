import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rotate Image Free Online | PDFImageConvert",
    description: "Rotate your images left or right by 90 degrees.",
    alternates: {
        canonical: "/rotate-image",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
