import re

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. app/page.tsx
fix_file('app/page.tsx', [
    ('<input\n                name="input"\n                type="text"', '<input\n                id="search-input"\n                name="search-input"\n                type="text"')
])

# 2. app/png-to-jpg/page.tsx
fix_file('app/png-to-jpg/page.tsx', [
    ('<input\n                                    type="range"', '<input\n                                    id="quality-slider"\n                                    name="quality-slider"\n                                    type="range"'),
    ('<input\n                                    type="number"\n                                    min="0"\n                                    max="100"', '<input\n                                    id="quality-input"\n                                    name="quality-input"\n                                    type="number"\n                                    min="0"\n                                    max="100"')
])

# 3. app/merge-pdf/page.tsx
fix_file('app/merge-pdf/page.tsx', [
    ('<input\n                                type="text"\n                                value={mergedFileName}', '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"\n                                value={mergedFileName}')
])

# 4. app/jpg-to-pdf/page.tsx
fix_file('app/jpg-to-pdf/page.tsx', [
    ('<input\n                                type="text"\n                                value={mergedFileName}', '<input\n                                id="merged-filename"\n                                name="merged-filename"\n                                type="text"\n                                value={mergedFileName}')
])

# 5. app/image-resizer/page.tsx
fix_file('app/image-resizer/page.tsx', [
    ('<input\n                                    type="number"\n                                    value={width}', '<input\n                                    id="resize-width"\n                                    name="resize-width"\n                                    type="number"\n                                    value={width}'),
    ('<input\n                                    type="number"\n                                    value={height}', '<input\n                                    id="resize-height"\n                                    name="resize-height"\n                                    type="number"\n                                    value={height}'),
    ('<input\n                                type="checkbox"\n                                checked={maintainAspectRatio}', '<input\n                                id="maintain-aspect-ratio"\n                                name="maintain-aspect-ratio"\n                                type="checkbox"\n                                checked={maintainAspectRatio}')
])

# 6. app/image-cropper/page.tsx
fix_file('app/image-cropper/page.tsx', [
    ('<input\n                                    type="number"\n                                    value={Math.round(crop.x)}', '<input\n                                    id="crop-x"\n                                    name="crop-x"\n                                    type="number"\n                                    value={Math.round(crop.x)}'),
    ('<input\n                                    type="number"\n                                    value={Math.round(crop.y)}', '<input\n                                    id="crop-y"\n                                    name="crop-y"\n                                    type="number"\n                                    value={Math.round(crop.y)}'),
    ('<input\n                                    type="number"\n                                    value={Math.round(crop.width)}', '<input\n                                    id="crop-width"\n                                    name="crop-width"\n                                    type="number"\n                                    value={Math.round(crop.width)}'),
    ('<input\n                                    type="number"\n                                    value={Math.round(crop.height)}', '<input\n                                    id="crop-height"\n                                    name="crop-height"\n                                    type="number"\n                                    value={Math.round(crop.height)}')
])

print("Done")
