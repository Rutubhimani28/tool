import { Metadata } from "next";
import RedactionTool from "./RedactionTool";

export const metadata: Metadata = {
    title: "PDF Redaction Tool | Free Online PDF Blackout",
    description: "Permanently redact and blackout sensitive information in your PDF files. 100% free, secure, and processes entirely in your browser without uploading files.",
    keywords: "pdf redaction, blackout pdf, redact pdf online, hide text in pdf, secure pdf redaction",
};

export default function PDFRedactionPage() {
    return <RedactionTool />;
}
