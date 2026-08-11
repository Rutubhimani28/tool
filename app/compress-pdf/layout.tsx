import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compress PDF – Reduce PDF File Size Free Online",
    description: "Easily reduce the file size of your PDF documents while maintaining high quality. 100% free, secure, and processed locally in your browser without uploading files.",
    alternates: {
        canonical: "https://pdfimageconvert.com/compress-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
