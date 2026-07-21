const sharp = require('sharp');
const path = require('path');

async function cropIcon() {
    try {
        const inputPath = path.join(__dirname, 'public', 'logo.png');
        const outputPath = path.join(__dirname, 'public', 'icon.png');

        await sharp(inputPath)
            .trim() // Trims transparent pixels by default
            .toFile(outputPath);

        console.log('Successfully cropped logo.png to icon.png');
    } catch (error) {
        console.error('Error cropping image:', error);
    }
}

cropIcon();
