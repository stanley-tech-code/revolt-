const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public/images');

async function processDirectory() {
  const files = fs.readdirSync(dir);
  let converted = 0;
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, base + '.webp');
      
      if (!fs.existsSync(outputPath)) {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted ${file} to ${base}.webp`);
        converted++;
      }
    }
  }
  console.log(`Finished converting ${converted} images.`);
}

processDirectory().catch(console.error);
