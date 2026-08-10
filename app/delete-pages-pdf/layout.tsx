import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Delete PDF Pages Free Online | PDFImageConvert",
    description: "Select pages you want to remove from your PDF document.",
    alternates: {
        canonical: "/delete-pages-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
