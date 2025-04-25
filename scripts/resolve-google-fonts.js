// scripts/resolve-google-fonts.js
// Downloads fonts from Google Fonts if they aren't found locally

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertAndSaveTTF } from './font-converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const FONT_LIST_PATH = path.resolve(__dirname, '../data/fonts-needed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../data/fonts');

function buildGoogleFontURL(family, weight = 400) {
  const familyParam = family.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weight}&display=swap`;
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
  const safeRawName = `${family.replace(/\s+/g, '')}-${style}.${ext}`;
  const rawPath = path.join(OUTPUT_DIR, safeRawName);

  try {
    const fileRes = await fetch(fontURL);
    const buffer = await fileRes.arrayBuffer();
    fs.writeFileSync(rawPath, Buffer.from(buffer));
    console.log(`✅ Downloaded from Google Fonts: ${family} — ${style} (${ext})`);

    if (['ttf', 'otf'].includes(ext)) {
      const safeWoffName = `${family}-${style}`
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^\w-]/g, '') + '.woff2';

      const convertedPath = await convertAndSaveTTF(rawPath, OUTPUT_DIR, safeWoffName);
      if (convertedPath) {
        fs.unlinkSync(rawPath);
        console.log(`🔁 Converted to .woff2 and removed original: ${safeWoffName}`);
      }
    }
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