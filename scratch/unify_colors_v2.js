const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

dirs.forEach(dir => {
    const filePath = path.join(toolsDir, dir, 'page.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace emerald with blue to provide better contrast in light mode.
    // Result Box bg replacements:
    content = content.replace(/bg-emerald-50 dark:bg-emerald-950\/20/g, 'bg-zinc-100 dark:bg-zinc-900/50');
    content = content.replace(/border-emerald-100 dark:border-emerald-900\/30/g, 'border-zinc-200 dark:border-zinc-800');
    
    // Icon replacements
    content = content.replace(/bg-emerald-100 text-emerald-600 dark:bg-emerald-900\/50 dark:text-emerald-400/g, 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400');

    // Input focus rings
    content = content.replace(/focus:ring-emerald-500/g, 'focus:ring-blue-500');
    content = content.replace(/focus:border-emerald-500/g, 'focus:border-blue-500');
    
    // Dropdown border and ring
    content = content.replace(/border-emerald-500 ring-2 ring-emerald-500\/20/g, 'border-blue-500 ring-2 ring-blue-500/20');
    
    // Dropdown items
    content = content.replace(/bg-emerald-50 dark:bg-emerald-500\/10 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500\/20/g, 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${dir}`);
});
