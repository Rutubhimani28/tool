const fs = require('fs');

function fixFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [oldRegex, newStr] of replacements) {
        content = content.replace(oldRegex, newStr);
    }
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. app/page.tsx
fixFile('app/page.tsx', [
    [/<input\s+name="input"\s+type="text"/g, '<input\n                id="search-input"\n                name="search-input"\n                type="text"']
]);

// 2. app/png-to-jpg/page.tsx
fixFile('app/png-to-jpg/page.tsx', [
    [/<input\s+type="range"/g, '<input\n                                    id="quality-slider"\n                                    name="quality-slider"\n                                    type="range"'],
    [/<input\s+type="number"\s+min="0"\s+max="100"/g, '<input\n                                    id="quality-input"\n                                    name="quality-input"\n                                    type="number"\n                                    min="0"\n                                    max="100"']
]);

// 3. app/merge-pdf/page.tsx
fixFile('app/merge-pdf/page.tsx', [
    [/<input\s+type="text"\s+value=\{mergedFileName\}/g, '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"\n                                value={mergedFileName}']
]);

// 4. app/jpg-to-pdf/page.tsx
fixFile('app/jpg-to-pdf/page.tsx', [
    [/<input\s+type="text"\s+value=\{mergedFileName\}/g, '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"\n                                value={mergedFileName}']
]);

// 5. app/image-resizer/page.tsx
fixFile('app/image-resizer/page.tsx', [
    [/<input\s+type="number"\s+value=\{width\}/g, '<input\n                                    id="resize-width"\n                                    name="resize-width"\n                                    type="number"\n                                    value={width}'],
    [/<input\s+type="number"\s+value=\{height\}/g, '<input\n                                    id="resize-height"\n                                    name="resize-height"\n                                    type="number"\n                                    value={height}'],
    [/<input\s+type="checkbox"\s+checked=\{maintainAspectRatio\}/g, '<input\n                                id="maintain-aspect-ratio"\n                                name="maintain-aspect-ratio"\n                                type="checkbox"\n                                checked={maintainAspectRatio}']
]);

// 6. app/image-cropper/page.tsx
fixFile('app/image-cropper/page.tsx', [
    [/<input\s+type="number"\s+value=\{Math\.round\(crop\.x\)\}/g, '<input\n                                    id="crop-x"\n                                    name="crop-x"\n                                    type="number"\n                                    value={Math.round(crop.x)}'],
    [/<input\s+type="number"\s+value=\{Math\.round\(crop\.y\)\}/g, '<input\n                                    id="crop-y"\n                                    name="crop-y"\n                                    type="number"\n                                    value={Math.round(crop.y)}'],
    [/<input\s+type="number"\s+value=\{Math\.round\(crop\.width\)\}/g, '<input\n                                    id="crop-width"\n                                    name="crop-width"\n                                    type="number"\n                                    value={Math.round(crop.width)}'],
    [/<input\s+type="number"\s+value=\{Math\.round\(crop\.height\)\}/g, '<input\n                                    id="crop-height"\n                                    name="crop-height"\n                                    type="number"\n                                    value={Math.round(crop.height)}']
]);

console.log("Done");
