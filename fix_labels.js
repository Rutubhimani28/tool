const fs = require('fs');

function fixFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [oldStr, newStr] of replacements) {
        content = content.replace(oldStr, newStr);
    }
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. app/image-cropper/page.tsx
fixFile('app/image-cropper/page.tsx', [
    ['<label className="text-xs font-semibold text-zinc-500 uppercase">Width (px)</label>', '<label htmlFor="crop-width" className="text-xs font-semibold text-zinc-500 uppercase">Width (px)</label>'],
    ['<label className="text-xs font-semibold text-zinc-500 uppercase">Height (px)</label>', '<label htmlFor="crop-height" className="text-xs font-semibold text-zinc-500 uppercase">Height (px)</label>'],
    ['<label className="text-xs font-semibold text-zinc-500 uppercase">X Position</label>', '<label htmlFor="crop-x" className="text-xs font-semibold text-zinc-500 uppercase">X Position</label>'],
    ['<label className="text-xs font-semibold text-zinc-500 uppercase">Y Position</label>', '<label htmlFor="crop-y" className="text-xs font-semibold text-zinc-500 uppercase">Y Position</label>']
]);

// 2. app/image-resizer/page.tsx
fixFile('app/image-resizer/page.tsx', [
    ['<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">\n                                    <Straighten className="h-4 w-4 text-zinc-400" /> Width (px)\n                                </label>', '<label htmlFor="resize-width" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">\n                                    <Straighten className="h-4 w-4 text-zinc-400" /> Width (px)\n                                </label>'],
    ['<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">\n                                    <Height className="h-4 w-4 text-zinc-400" /> Height (px)\n                                </label>', '<label htmlFor="resize-height" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">\n                                    <Height className="h-4 w-4 text-zinc-400" /> Height (px)\n                                </label>'],
    ['<label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">', '<label htmlFor="maintain-aspect-ratio" className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">']
]);

// 3. app/page.tsx
fixFile('app/page.tsx', [
    ['<input\n                id="search-input"\n                name="search-input"\n                type="text"', '<input\n                id="search-input"\n                name="search-input"\n                aria-label="Search tools"\n                type="text"']
]);

// 4. app/png-to-jpg/page.tsx
fixFile('app/png-to-jpg/page.tsx', [
    ['<input\n                                    id="quality-slider"\n                                    name="quality-slider"\n                                    type="range"', '<input\n                                    id="quality-slider"\n                                    name="quality-slider"\n                                    aria-label="Image Quality Slider"\n                                    type="range"'],
    ['<input\n                                    id="quality-input"\n                                    name="quality-input"\n                                    type="number"', '<input\n                                    id="quality-input"\n                                    name="quality-input"\n                                    aria-label="Image Quality Input"\n                                    type="number"']
]);

// 5. app/merge-pdf/page.tsx
fixFile('app/merge-pdf/page.tsx', [
    ['<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"', '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                aria-label="Merged file name"\n                                type="text"']
]);

// 6. app/jpg-to-pdf/page.tsx
fixFile('app/jpg-to-pdf/page.tsx', [
    ['<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"', '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                aria-label="Merged file name"\n                                type="text"']
]);

// 7. app/protect-pdf/page.tsx
fixFile('app/protect-pdf/page.tsx', [
    ['<input type="text" name="username" autoComplete="username" className="hidden" aria-hidden="true" />', '<input type="text" id="username" name="username" aria-label="Username" autoComplete="username" className="hidden" aria-hidden="true" />']
]);

// 8. app/unlock-pdf/page.tsx
fixFile('app/unlock-pdf/page.tsx', [
    ['<input type="text" name="username" id="username" autoComplete="username" className="hidden" />', '<input type="text" name="username" id="username" aria-label="Username" autoComplete="username" className="hidden" />']
]);

// 9. app/split-pdf/page.tsx
fixFile('app/split-pdf/page.tsx', [
    ['<input\n                                id="custom-ranges"\n                                name="custom-ranges"\n                                type="text"', '<input\n                                id="custom-ranges"\n                                name="custom-ranges"\n                                aria-label="Custom ranges"\n                                type="text"']
]);

console.log("Done");
