const fs = require('fs');
// Read the original favicon.ico if it exists, otherwise we might need to extract it from the old svg
// Wait, favicon.ico was deleted. We need to extract the base64 from the existing icon.svg
const oldSvg = fs.readFileSync('app/icon.svg', 'utf8');
const base64Match = oldSvg.match(/href="data:image\/x-icon;base64,([^"]+)"/);
if (base64Match) {
    const ico = base64Match[1];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="white"/>
  <image href="data:image/x-icon;base64,${ico}" width="60" height="60" x="2" y="2"/>
</svg>`;
    fs.writeFileSync('app/icon.svg', svg);
    console.log('Updated app/icon.svg with larger image');
} else {
    console.error('Could not find base64 image in app/icon.svg');
}
