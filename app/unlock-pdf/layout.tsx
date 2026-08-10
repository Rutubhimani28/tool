import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unlock PDF Free Online | PDFImageConvert",
    description: "Remove password protection and restrictions from your PDF.",
    alternates: {
        canonical: "/unlock-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
