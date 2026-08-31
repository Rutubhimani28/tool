import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Insights & Guides | Pdfimage Convert",
    description: "Discover expert tips, comprehensive guides, and actionable insights on managing PDFs, optimizing images, and improving your digital workflow.",
    alternates: {
        canonical: "https://pdfimageconvert.com/blog",
    },
    openGraph: {
        title: "Insights & Guides | Pdfimage Convert",
        description: "Expert tips and guides on managing PDFs and optimizing images.",
        url: "https://pdfimageconvert.com/blog",
        siteName: "Pdfimage Convert",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Insights & Guides | Pdfimage Convert",
        description: "Expert tips and guides on managing PDFs and optimizing images.",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Generate CollectionPage JSON-LD Schema for the blog index
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Insights & Guides | Pdfimage Convert",
        "description": "Discover expert tips, comprehensive guides, and actionable insights on managing PDFs, optimizing images, and improving your digital workflow.",
        "url": "https://pdfimageconvert.com/blog"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
                suppressHydrationWarning
            />
            {children}
        </>
    );
}
