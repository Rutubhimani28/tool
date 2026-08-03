import { Metadata } from "next";
import CsvExtractorTool from "./CsvExtractorTool";

export const metadata: Metadata = {
    title: "PDF to CSV Converter Free Online | PDFImageConvert",
    description: "Extract tables and tabular data from PDF to CSV format instantly. 100% secure, local processing in your browser.",
    alternates: {
        canonical: "https://pdfimageconvert.com/pdf-to-csv",
    },
};

export default function PdfToCsvPage() {
    return <CsvExtractorTool />;
}
