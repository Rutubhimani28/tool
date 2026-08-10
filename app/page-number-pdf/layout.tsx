import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Number PDF Free Online | PDFImageConvert",
    description: "Easily insert page numbers into your PDF document.",
    alternates: {
        canonical: "/page-number-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
