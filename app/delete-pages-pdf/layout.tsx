import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Delete PDF Pages - Free Online Tool | PDFImageConvert",
    description: "Select pages you want to remove from your PDF document. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/delete-pages-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
