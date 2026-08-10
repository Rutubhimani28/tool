import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Cropper Free Online | PDFImageConvert",
    description: "Crop and rotate your images interactively in your browser.",
    alternates: {
        canonical: "/image-cropper",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
