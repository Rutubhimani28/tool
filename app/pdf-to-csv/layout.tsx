import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to CSV - Free Online Tool | PDFImageConvert",
    description: "Extract tables and tabular data from your PDF into a CSV file. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-csv",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
