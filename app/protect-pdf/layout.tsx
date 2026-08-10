import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Protect PDF Free Online | PDFImageConvert",
    description: "Encrypt your PDF with a secure password to prevent unauthorized access.",
    alternates: {
        canonical: "/protect-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
