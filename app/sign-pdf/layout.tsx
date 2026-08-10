import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign PDF Free Online | PDFImageConvert",
    description: "Add your signature image to the first page of your PDF.",
    alternates: {
        canonical: "/sign-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
