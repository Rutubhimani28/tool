import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Split PDF Free Online | PDFImageConvert",
    description: "Extract specific pages or split a PDF into separate files.",
    alternates: {
        canonical: "/split-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
