import { Metadata } from "next";
import { generateToolMetadata, generateToolSchema } from "@/app/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("rotate-image");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = generateToolSchema("rotate-image");
  
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}
