import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convert HEIC to JPG Free Online | PDFImageConvert",
    description: "Convert Apple HEIC images to standard JPG format.",
    alternates: {
        canonical: "/heic-to-jpg",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
