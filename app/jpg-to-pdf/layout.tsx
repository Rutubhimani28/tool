import { Metadata } from "next";
import { generateToolMetadata, generateToolSchema } from "@/app/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("jpg-to-pdf");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = generateToolSchema("jpg-to-pdf");
  
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
