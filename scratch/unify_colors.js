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

    // Replace all primary themes with emerald
    content = content.replace(/bg-(purple|blue|sky|green|amber|emerald)-50 dark:bg-(purple|blue|sky|green|amber|emerald)-950\/20/g, 'bg-emerald-50 dark:bg-emerald-950/20');
    content = content.replace(/border-(purple|blue|sky|green|amber|emerald)-100 dark:border-(purple|blue|sky|green|amber|emerald)-900\/30/g, 'border-emerald-100 dark:border-emerald-900/30');
    
    // Icon replacements
    content = content.replace(/bg-(purple|blue|sky|green|amber|emerald)-100 text-(purple|blue|sky|green|amber|emerald)-600 dark:bg-(purple|blue|sky|green|amber|emerald)-900\/50 dark:text-(purple|blue|sky|green|amber|emerald)-400/g, 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400');

    // Input focus rings
    content = content.replace(/focus:ring-(purple|blue|sky|green|amber|emerald)-500/g, 'focus:ring-emerald-500');
    content = content.replace(/focus:border-(purple|blue|sky|green|amber|emerald)-500/g, 'focus:border-emerald-500');
    
    // Dropdown border and ring
    content = content.replace(/border-(purple|blue|sky|green|amber|emerald)-500 ring-2 ring-(purple|blue|sky|green|amber|emerald)-500\/20/g, 'border-emerald-500 ring-2 ring-emerald-500/20');
    
    // Dropdown items
    content = content.replace(/bg-(purple|blue|sky|green|amber|emerald)-50 dark:bg-(purple|blue|sky|green|amber|emerald)-500\/10 text-(purple|blue|sky|green|amber|emerald)-600 dark:text-(purple|blue|sky|green|amber|emerald)-400 font-semibold hover:bg-(purple|blue|sky|green|amber|emerald)-100 dark:hover:bg-(purple|blue|sky|green|amber|emerald)-500\/20/g, 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${dir}`);
});
