import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Cropper - Free Online Tool | PDFImageConvert",
    description: "Crop and rotate your images interactively in your browser. 100% free, secure, and works entirely in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/image-cropper",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
