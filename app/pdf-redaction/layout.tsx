import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF Redaction Free Online | PDFImageConvert",
    description: "Permanently blackout sensitive information in your PDF.",
    alternates: {
        canonical: "/pdf-redaction",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
