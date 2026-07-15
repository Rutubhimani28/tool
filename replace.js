const fs = require('fs');
let content = fs.readFileSync('app/pdf-to-jpg/page.tsx', 'utf8');

// Add state
content = content.replace(
    'const [resultFileName, setResultFileName] = useState("");',
    'const [resultFileName, setResultFileName] = useState("");\n    const [previewUrl, setPreviewUrl] = useState<string | null>(null);'
);

// Set previewUrl
content = content.replace(
    'zip.file(`${file.name.replace(".pdf", "")}_page_${i}.jpg`, blob);\n                }',
    'zip.file(`${file.name.replace(".pdf", "")}_page_${i}.jpg`, blob);\n                    if (i === 1) {\n                        setPreviewUrl(URL.createObjectURL(blob));\n                    }\n                }'
);

// Add UI
const targetUI = 'Your images have been packaged into a ZIP file.\\r\\n                        </p>\\r\\n                    </div>';
const replacementUI = targetUI + '\\r\\n\\r\\n                    {/* Preview */}\\r\\n                    {previewUrl && (\\r\\n                        <div className="w-full max-w-md aspect-[1/1.4] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex flex-col">\\r\\n                            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">\\r\\n                                Previewing first page\\r\\n                            </div>\\r\\n                            <div className="flex-1 flex items-center justify-center p-4">\\r\\n                                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain shadow-sm" />\\r\\n                            </div>\\r\\n                        </div>\\r\\n                    )}';
content = content.replace(targetUI, replacementUI);

// Revoke previewUrl
content = content.replace(
    'setResultUrl(null);\n                                setResultFileName("");',
    'setResultUrl(null);\n                                setResultFileName("");\n                                if (previewUrl) URL.revokeObjectURL(previewUrl);\n                                setPreviewUrl(null);'
);

fs.writeFileSync('app/pdf-to-jpg/page.tsx', content);
