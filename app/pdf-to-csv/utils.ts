export async function extractCsvFromPdf(fileBuffer: ArrayBuffer, setProgress: (p: number) => void): Promise<string> {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs`;

    const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0), verbosity: 0 }).promise;
    const numPages = pdf.numPages;

    let csvContent = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(Math.round((pageNum / numPages) * 100));
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Group by Y coordinate (with tolerance)
        const rows: { y: number; items: { x: number; text: string }[] }[] = [];
        const Y_TOLERANCE = 5; // Adjust based on font size/line height

        for (const item of textContent.items) {
            if (!('str' in item)) continue;
            const text = item.str.trim();
            if (!text) continue;

            const transform = item.transform;
            const x = transform[4];
            const y = transform[5];

            let row = rows.find(r => Math.abs(r.y - y) < Y_TOLERANCE);
            if (!row) {
                row = { y, items: [] };
                rows.push(row);
            }
            row.items.push({ x, text });
        }

        // Sort rows top to bottom (PDF y-axis is bottom-up, so sort descending)
        rows.sort((a, b) => b.y - a.y);

        // Determine columns for this page by finding unique X coordinates
        const X_TOLERANCE = 15; // Tolerance for column alignment
        const columns: number[] = [];

        for (const row of rows) {
            for (const item of row.items) {
                const existingCol = columns.find(c => Math.abs(c - item.x) < X_TOLERANCE);
                if (!existingCol) {
                    columns.push(item.x);
                }
            }
        }

        // Sort columns left to right
        columns.sort((a, b) => a - b);

        for (const row of rows) {
            // Create an array of empty strings for each column
            const rowData = new Array(columns.length).fill("");

            for (const item of row.items) {
                // Find which column this item belongs to
                const colIndex = columns.findIndex(c => Math.abs(c - item.x) < X_TOLERANCE);
                if (colIndex !== -1) {
                    // If multiple items fall into the same column, concatenate them
                    if (rowData[colIndex]) {
                        rowData[colIndex] += " " + item.text;
                    } else {
                        rowData[colIndex] = item.text;
                    }
                }
            }

            // Escape CSV values
            const rowCsv = rowData.map(text => {
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    return `"${text.replace(/"/g, '""')}"`;
                }
                return text;
            }).join(',');

            csvContent += rowCsv + "\n";
        }

        // Add page break if needed, or just continue
        if (pageNum < numPages && rows.length > 0) {
            csvContent += "\n";
        }
    }

    return csvContent;
}
