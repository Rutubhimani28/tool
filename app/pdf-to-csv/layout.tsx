import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to CSV Free Online | PDFImageConvert",
    description: "Extract tables and tabular data from your PDF into a CSV file.",
    alternates: {
        canonical: "/pdf-to-csv",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
