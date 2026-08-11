import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to JPG Converter – Convert PDF Pages to JPG Free Online",
    description: "Easily convert your PDF documents to high-quality JPG images. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-jpg",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
