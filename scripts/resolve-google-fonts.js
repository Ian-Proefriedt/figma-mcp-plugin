// scripts/resolve-google-fonts.js
// Downloads fonts from Google Fonts if they aren't found locally

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const FONT_LIST_PATH = path.resolve(__dirname, '../data/fonts-needed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../data/fonts');

function buildGoogleFontURL(family, weight = 400) {
  const familyParam = family.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weight}&display=swap`;
}

async function downloadFontFile(url, outputPath) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const ext = path.extname(outputPath);

  if (ext === '.ttf') {
    const { default: ttf2woff2 } = await import('ttf2woff2');
    const woffBuffer = ttf2woff2(Buffer.from(buffer));
    const outputWoffPath = outputPath.replace(/\.ttf$/, '.woff2');
    fs.writeFileSync(outputWoffPath, woffBuffer);
    console.log(`🔄 Converted .ttf to .woff2: ${outputWoffPath}`);
  } else {
    fs.writeFileSync(outputPath, Buffer.from(buffer));
  }
}

function extractBestFontURL(css) {
  const match = [...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)'"]+\.(woff2|woff|ttf|otf)/g)];
  if (!match.length) return null;
  const preferredOrder = ['woff2', 'woff', 'ttf', 'otf'];
  for (const ext of preferredOrder) {
    const found = match.find(m => m[0].endsWith(`.${ext}`));
    if (found) return found[0];
  }
  return null;
}

async function resolveGoogleFont({ family, style, weight }) {
  const fontWeight = weight || 400;
  const apiURL = buildGoogleFontURL(family, fontWeight);
  const res = await fetch(apiURL);
  const css = await res.text();

  const fontURL = extractBestFontURL(css);
  if (!fontURL) {
    console.warn(`⚠️ No usable font URL found in CSS for ${family} — ${style}`);
    return;
  }

  const ext = path.extname(fontURL).replace('.', '');
  const safeName = `${family.replace(/\s+/g, '')}-${style}.${ext}`;
  const outputPath = path.join(OUTPUT_DIR, safeName);

  try {
    await downloadFontFile(fontURL, outputPath);
    console.log(`✅ Downloaded from Google Fonts: ${family} — ${style} (${ext})`);
  } catch (err) {
    console.error(`❌ Failed to download ${family} — ${style}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(FONT_LIST_PATH)) {
    console.error('❌ fonts-needed.json not found');
    return;
  }
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const fontRequests = JSON.parse(fs.readFileSync(FONT_LIST_PATH, 'utf-8'));
  for (const font of fontRequests) {
    await resolveGoogleFont(font);
  }
}

main();
