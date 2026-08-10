import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Compressor Free Online | PDFImageConvert",
    description: "Compress JPG, PNG, or WebP images to reduce file size.",
    alternates: {
        canonical: "/image-compressor",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
