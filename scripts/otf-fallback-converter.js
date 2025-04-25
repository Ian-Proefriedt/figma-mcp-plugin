import fs from 'fs';
import path from 'path';

export async function fallbackConvertOtf(inputPath, outputWoff2Path) {
  try {
    const { default: otf2ttf } = await import('otf2ttf');
    const { default: ttf2woff2 } = await import('ttf2woff2');

    const ttfBuffer = otf2ttf(fs.readFileSync(inputPath));
    const woffBuffer = ttf2woff2(ttfBuffer);

    fs.writeFileSync(outputWoff2Path, woffBuffer);
    console.log(`✅ OTF fallback succeeded: ${path.basename(outputWoff2Path)}`);
    return outputWoff2Path;
  } catch (err) {
    console.error(`❌ Fallback OTF conversion failed for ${path.basename(inputPath)}:`, err.message);
    return null;
  }
}