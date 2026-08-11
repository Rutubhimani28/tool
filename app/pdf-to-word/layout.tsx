import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF to Word Converter – Convert PDF to DOCX Free Online",
    description: "Easily convert your PDF documents to editable Microsoft Word (.docx) files. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-word",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
