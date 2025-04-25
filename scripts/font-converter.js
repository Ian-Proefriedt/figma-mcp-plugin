import fs from 'fs';
import path from 'path';
import { fallbackConvertOtf } from './otf-fallback-converter.js';

export async function convertAndSaveTTF(inputPath, outputDir, outputName) {
  const { default: ttf2woff2 } = await import('ttf2woff2');
  const buffer = fs.readFileSync(inputPath);
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = path.join(outputDir, outputName);

  try {
    const woff = ttf2woff2(buffer);
    fs.writeFileSync(outputPath, woff);
    return outputPath;
  } catch (err) {
    if (ext === '.otf') {
      console.warn(`⚠️ Conversion failed for .otf: ${path.basename(inputPath)} — trying fallback...`);
      return await fallbackConvertOtf(inputPath, outputPath);
    } else {
      console.error(`❌ Failed to convert font: ${path.basename(inputPath)}:`, err.message);
      return null;
    }
  }
}