import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Word to PDF Free Online | PDFImageConvert",
    description: "Convert Microsoft Word documents (.docx) to PDF format.",
    alternates: {
        canonical: "/word-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
