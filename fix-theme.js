const fs = require('fs');
let content = fs.readFileSync('app/unlock-pdf/page.tsx', 'utf8');

// Replace success screen icon
content = content.replace(
    'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
    'bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400'
);

// Replace download button
content = content.replace(
    'bg-zinc-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600',
    'bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600'
);

// Replace file info icon
content = content.replace(
    'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    'bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400'
);

// Replace progress bar
content = content.replace(
    'bg-zinc-700 dark:bg-zinc-600 h-full transition-all duration-300',
    'bg-purple-500 h-full transition-all duration-300'
);

// Replace unlock button
content = content.replace(
    'bg-zinc-800 py-4 text-base font-semibold text-white shadow-lg shadow-zinc-800/20 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600',
    'bg-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600'
);

// Fix verbosity
content = content.replace(
    'const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password });',
    '(pdfjsLib as any).verbosity = 0;\n                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password, verbosity: 0 });'
);

// Remove console.warn
content = content.replace(
    'console.warn("PDF load error (checking encryption):", error);',
    ''
);

fs.writeFileSync('app/unlock-pdf/page.tsx', content);
