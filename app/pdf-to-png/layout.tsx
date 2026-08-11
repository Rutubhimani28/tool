import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to PNG Converter – Convert PDF Pages to PNG Free Online",
    description: "Easily convert your PDF documents to high-quality, lossless PNG images. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-png",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
