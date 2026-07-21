export interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export const faqs: FAQ[] = [
    // General Questions
    {
        category: "General Questions",
        question: "What is PDFImageConvert?",
        answer: "PDFImageConvert is a comprehensive suite of free online tools designed to help you manipulate, convert, and optimize PDF and image files directly in your web browser without requiring any software installation."
    },
    {
        category: "General Questions",
        question: "Is PDFImageConvert completely free to use?",
        answer: "Yes, all of our core conversion and optimization tools are 100% free to use. We do not require a credit card or a subscription to access our basic features."
    },
    {
        category: "General Questions",
        question: "Do I need to create an account to use the tools?",
        answer: "No account creation is required. You can start using our tools immediately without signing up or providing any personal information."
    },
    {
        category: "General Questions",
        question: "Are there any limitations on how many files I can process?",
        answer: "While our tools are free, we may impose reasonable rate limits to ensure fair usage and maintain server performance for all users. However, for typical daily use, you will not encounter any restrictions."
    },
    {
        category: "General Questions",
        question: "Can I use these tools on my mobile device?",
        answer: "Absolutely. Our website is fully responsive and optimized for mobile browsers, allowing you to convert and compress files directly from your smartphone or tablet."
    },
    {
        category: "General Questions",
        question: "Do I need to download any software?",
        answer: "No. All processing happens entirely within your web browser. There are no plugins, extensions, or desktop applications to install."
    },
    {
        category: "General Questions",
        question: "How do I contact support if I encounter an issue?",
        answer: "You can reach out to our support team via the Contact Us page. We strive to respond to all technical inquiries within 24-48 hours."
    },

    // PDF Conversion
    {
        category: "PDF Conversion",
        question: "How do I convert a PDF to a JPG image?",
        answer: "Simply navigate to our <a href='/pdf-to-jpg' class='text-blue-600 hover:underline'>PDF to JPG</a> tool, upload your PDF file, and click convert. The tool will render each page of your PDF into a high-quality JPG image."
    },
    {
        category: "PDF Conversion",
        question: "Will converting my Word document to PDF change the formatting?",
        answer: "No. Our <a href='/word-to-pdf' class='text-blue-600 hover:underline'>Word to PDF</a> converter is designed to preserve your exact layout, fonts, and margins, ensuring the resulting PDF looks identical to your original document."
    },
    {
        category: "PDF Conversion",
        question: "Can I convert multiple images into a single PDF?",
        answer: "Yes. Using our <a href='/jpg-to-pdf' class='text-blue-600 hover:underline'>JPG to PDF</a> tool, you can upload multiple images, arrange them in your desired order, and combine them into one cohesive PDF document."
    },
    {
        category: "PDF Conversion",
        question: "How do I extract text from a scanned PDF?",
        answer: "Currently, our tools focus on format conversion and structural manipulation. If your PDF is a scanned image, you would need an OCR (Optical Character Recognition) tool to extract editable text."
    },
    {
        category: "PDF Conversion",
        question: "Why is my converted image blurry?",
        answer: "If you are converting a PDF to an image, the output quality depends on the resolution of the original PDF. If the PDF contains low-resolution assets, the resulting image will reflect that."
    },
    {
        category: "PDF Conversion",
        question: "Can I convert an Excel spreadsheet to a PDF?",
        answer: "Yes, you can use our <a href='/excel-to-pdf' class='text-blue-600 hover:underline'>Excel to PDF</a> tool to lock your spreadsheets into a fixed layout for easy sharing and printing."
    },
    {
        category: "PDF Conversion",
        question: "Is it possible to convert a PowerPoint presentation to PDF?",
        answer: "Absolutely. Our <a href='/powerpoint-to-pdf' class='text-blue-600 hover:underline'>PowerPoint to PDF</a> tool will convert your slides into a PDF document, preserving all text and images while removing animations."
    },
    {
        category: "PDF Conversion",
        question: "How do I turn a PNG into a PDF?",
        answer: "You can use our <a href='/png-to-pdf' class='text-blue-600 hover:underline'>PNG to PDF</a> converter. It works exactly like the JPG converter, allowing you to turn transparent graphics into standard PDF files."
    },

    // Privacy & Security
    {
        category: "Privacy & Security",
        question: "Are my files safe when I upload them?",
        answer: "Yes. We utilize 100% local browser processing for many of our tools. For tools that require server processing, all uploads are secured using HTTPS/SSL encryption."
    },
    {
        category: "Privacy & Security",
        question: "Do you store my documents on your servers?",
        answer: "No. We have a strict zero-retention policy. Any file processed on our servers is automatically and permanently deleted immediately after the conversion is complete."
    },
    {
        category: "Privacy & Security",
        question: "Can anyone else access my converted files?",
        answer: "No. The download link generated for your converted file is unique to your session and cannot be accessed by anyone else or indexed by search engines."
    },
    {
        category: "Privacy & Security",
        question: "Do you read or analyze the content of my documents?",
        answer: "Absolutely not. Our automated systems process the files strictly for conversion purposes. No human ever views your documents, and no data is extracted or analyzed."
    },
    {
        category: "Privacy & Security",
        question: "How do I password protect a sensitive PDF?",
        answer: "You can use our <a href='/protect-pdf' class='text-blue-600 hover:underline'>Protect PDF</a> tool to encrypt your document with a strong password, ensuring only authorized individuals can open it."
    },
    {
        category: "Privacy & Security",
        question: "Is it safe to process financial or legal documents here?",
        answer: "Yes. Because we automatically delete all files and use secure encryption, our platform is safe for processing sensitive business, legal, and financial documents."
    },
    {
        category: "Privacy & Security",
        question: "Do you sell user data to third parties?",
        answer: "No. We respect your privacy and do not sell, rent, or share your personal data or uploaded files with any third-party advertisers or data brokers."
    },

    // Supported Formats
    {
        category: "Supported Formats",
        question: "Which image formats do you support?",
        answer: "We support all major web image formats, including JPG (JPEG), PNG, WebP, GIF, and BMP for both input and output conversions."
    },
    {
        category: "Supported Formats",
        question: "Can I convert HEIC images from my iPhone?",
        answer: "Yes, our <a href='/heic-to-jpg' class='text-blue-600 hover:underline'>HEIC to JPG</a> tool allows you to easily convert Apple's high-efficiency image format into standard JPGs viewable on any device."
    },
    {
        category: "Supported Formats",
        question: "Do you support converting SVG files?",
        answer: "Yes, we offer tools to convert vector SVG files into raster formats like PNG or JPG, as well as converting them into PDF documents."
    },
    {
        category: "Supported Formats",
        question: "Can I process animated GIFs?",
        answer: "While you can convert a GIF to a PDF or extract frames from it, converting a PDF into a GIF will generally result in a static image of the first page."
    },
    {
        category: "Supported Formats",
        question: "What versions of Microsoft Office files are supported?",
        answer: "We support modern Office formats (.docx, .xlsx, .pptx) as well as older legacy formats (.doc, .xls, .ppt) for conversion to PDF."
    },
    {
        category: "Supported Formats",
        question: "Are there any file formats you do not support?",
        answer: "We currently do not support highly specialized CAD formats (like .dwg) or proprietary raw camera files (like .cr2 or .nef)."
    },

    // File Size & Compression
    {
        category: "File Size & Compression",
        question: "What is the maximum file size I can upload?",
        answer: "Currently, the maximum file size for a single upload is 50MB. This limit ensures fast processing times and prevents browser crashes."
    },
    {
        category: "File Size & Compression",
        question: "How can I reduce the size of a large PDF?",
        answer: "You can drastically reduce file size using our <a href='/compress-pdf' class='text-blue-600 hover:underline'>Compress PDF</a> tool, which optimizes embedded images and removes redundant data."
    },
    {
        category: "File Size & Compression",
        question: "Will compressing an image ruin its quality?",
        answer: "Our <a href='/compress-image' class='text-blue-600 hover:underline'>Image Compressor</a> uses smart algorithms to find the perfect balance. It significantly reduces file size while keeping the visual degradation nearly imperceptible to the human eye."
    },
    {
        category: "File Size & Compression",
        question: "Why is my PDF still large after compression?",
        answer: "If your PDF consists entirely of text or vector graphics, there is very little data to compress. Compression is most effective on PDFs containing large, unoptimized raster images."
    },
    {
        category: "File Size & Compression",
        question: "How do I split a large PDF into smaller files?",
        answer: "Use our <a href='/split-pdf' class='text-blue-600 hover:underline'>Split PDF</a> tool to extract specific pages or divide a massive document into multiple smaller, manageable files."
    },
    {
        category: "File Size & Compression",
        question: "Can I compress multiple images at once?",
        answer: "Yes, our image compression tools support batch processing. You can upload multiple images and compress them all simultaneously."
    },

    // Document Manipulation
    {
        category: "Document Manipulation",
        question: "How do I combine multiple PDFs into one?",
        answer: "Navigate to our <a href='/merge-pdf' class='text-blue-600 hover:underline'>Merge PDF</a> tool, upload your files, arrange them in the desired order, and click merge to combine them into a single document."
    },
    {
        category: "Document Manipulation",
        question: "Can I delete a specific page from a PDF?",
        answer: "Yes. Use our <a href='/remove-pages' class='text-blue-600 hover:underline'>Remove Pages</a> tool. Simply upload the document, select the thumbnails of the pages you want to delete, and save the new file."
    },
    {
        category: "Document Manipulation",
        question: "How do I rotate a PDF that was scanned upside down?",
        answer: "Our <a href='/rotate-pdf' class='text-blue-600 hover:underline'>Rotate PDF</a> tool allows you to rotate individual pages or the entire document by 90, 180, or 270 degrees."
    },
    {
        category: "Document Manipulation",
        question: "Can I add page numbers to my PDF?",
        answer: "Yes, using our <a href='/add-page-numbers' class='text-blue-600 hover:underline'>Add Page Numbers</a> utility, you can customize the position, font, and starting number for your document."
    },
    {
        category: "Document Manipulation",
        question: "How do I add a watermark to my document?",
        answer: "Use the <a href='/watermark-pdf' class='text-blue-600 hover:underline'>Watermark PDF</a> tool to stamp text or an image across your pages to protect your copyright or indicate confidentiality."
    },
    {
        category: "Document Manipulation",
        question: "Is it possible to reorder pages within a PDF?",
        answer: "Yes. Upload your file to our <a href='/organize-pdf' class='text-blue-600 hover:underline'>Organize PDF</a> tool, where you can drag and drop page thumbnails to rearrange them exactly as needed."
    },

    // Troubleshooting & Performance
    {
        category: "Troubleshooting",
        question: "Why is the conversion taking so long?",
        answer: "Processing time depends on your internet connection speed and the complexity of the file. A 50-page PDF with high-resolution images will take longer to process than a 2-page text document."
    },
    {
        category: "Troubleshooting",
        question: "The tool crashed while processing my file. What should I do?",
        answer: "This usually happens if the file is too large or corrupted. Try refreshing the page, clearing your browser cache, and attempting the conversion again. Ensure your file is under the 50MB limit."
    },
    {
        category: "Troubleshooting",
        question: "Why did my PDF to Word conversion lose some formatting?",
        answer: "PDFs are fixed-layout documents, while Word is fluid. Complex layouts with overlapping elements or custom fonts may not translate perfectly. We continually improve our algorithms to minimize these discrepancies."
    },
    {
        category: "Troubleshooting",
        question: "I can't find my downloaded file. Where did it go?",
        answer: "By default, most web browsers save files to your computer's 'Downloads' folder. Check your browser's download history (usually accessible via Ctrl+J or Cmd+J) to locate the file."
    },
    {
        category: "Troubleshooting",
        question: "Why am I getting an 'Invalid File Format' error?",
        answer: "This error occurs if you try to upload a file type that the specific tool does not support (e.g., uploading an MP3 to the PDF to JPG converter). Ensure you are using the correct tool for your file type."
    },
    {
        category: "Troubleshooting",
        question: "Does this work on Safari and Firefox?",
        answer: "Yes, our platform is thoroughly tested and fully compatible with all modern web browsers, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge."
    },
    {
        category: "Troubleshooting",
        question: "The website looks broken on my screen.",
        answer: "If the layout appears distorted, you may be using an outdated browser version. Please update your browser to the latest version. If the issue persists, try disabling ad-blockers or extensions that might interfere with the site's CSS."
    },

    // Advanced Usage
    {
        category: "Advanced Usage",
        question: "Can I use PDFImageConvert via an API?",
        answer: "Currently, PDFImageConvert is designed as a consumer-facing web application. We do not offer a public API for developers at this time, as our architecture is heavily focused on client-side browser processing rather than server-side endpoints."
    },
    {
        category: "Advanced Usage",
        question: "How do I extract images from a PDF without converting the whole page?",
        answer: "While our standard PDF to JPG tool converts the entire page into an image, we are developing a dedicated 'Extract Images' tool that will parse the PDF structure and save only the embedded image assets."
    },
    {
        category: "Advanced Usage",
        question: "Is there a command-line interface (CLI) available?",
        answer: "No, we do not provide a CLI. Our tools are built exclusively for the web browser to ensure maximum accessibility across all operating systems without requiring terminal knowledge."
    },
    {
        category: "Advanced Usage",
        question: "Can I process files offline?",
        answer: "Because our tools rely on WebAssembly modules loaded by the browser, you need an initial internet connection to load the website. However, once the page is fully loaded, the actual file processing happens locally and does not require continuous internet access."
    },
    {
        category: "Advanced Usage",
        question: "Do you support batch processing of hundreds of files?",
        answer: "While our tools support batch processing, attempting to process hundreds of high-resolution files simultaneously may cause your browser to run out of memory and crash. We recommend processing files in batches of 20-50 depending on your device's RAM."
    },

    // Quality & Formatting
    {
        category: "Quality & Formatting",
        question: "How do I ensure the highest quality output?",
        answer: "For the best image quality, always start with a high-resolution source file. When converting to JPG, our tools automatically use a high-quality setting (typically 90-100%). For absolute lossless quality, choose PNG as your output format."
    },
    {
        category: "Quality & Formatting",
        question: "Why did the fonts change when converting Word to PDF?",
        answer: "If your Word document uses custom or premium fonts that are not installed on our rendering engine, the system will substitute them with the closest available standard font. To prevent this, embed the fonts within your Word document before converting."
    },
    {
        category: "Quality & Formatting",
        question: "Can I adjust the DPI of the output image?",
        answer: "Currently, our PDF to Image converter outputs at a standard web-optimized DPI (usually 150-300 DPI depending on the source). We plan to add manual DPI selection in a future update for print professionals."
    },
    {
        category: "Quality & Formatting",
        question: "Does compressing an image remove its EXIF data?",
        answer: "Yes, by default, our image compressor strips unnecessary metadata, including EXIF data (like GPS location and camera settings), to maximize file size reduction and protect your privacy."
    },
    {
        category: "Quality & Formatting",
        question: "Why does my converted PDF have a white margin?",
        answer: "This usually happens when converting images to PDF. If the aspect ratio of your image doesn't perfectly match the standard PDF page size (like A4 or Letter), the tool will add white margins (letterboxing) to fit the image without distorting it."
    }
];
