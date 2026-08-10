import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rotate PDF Free Online | PDFImageConvert",
    description: "Rotate pages in your PDF document and save the changes.",
    alternates: {
        canonical: "/rotate-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
