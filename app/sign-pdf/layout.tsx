import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign PDF - Free Online Tool | PDFImageConvert",
    description: "Add your signature image to the first page of your PDF. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/sign-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
