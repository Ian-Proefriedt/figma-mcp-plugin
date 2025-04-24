// scripts/resolve-google-fonts.js (with cleanup of temp .ttf/.otf files after conversion)
// Downloads fonts from Google Fonts if they aren't found locally and optionally converts to .woff2

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const FONT_LIST_PATH = path.resolve(__dirname, '../data/fonts-needed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../data/fonts');

const isWindows = process.platform === 'win32';

function resolvePyftsubsetPath() {
  try {
    const cmd = isWindows ? 'where pyftsubset' : 'which pyftsubset';
    return execSync(cmd).toString().trim();
  } catch {
    return null;
  }
}

function buildGoogleFontURL(family, weight = 400) {
  const familyParam = family.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weight}&display=swap`;
}

async function convertWithPyftsubset(pyftsubsetPath, inputPath, outputName) {
  const outputPath = path.join(OUTPUT_DIR, outputName);
  return new Promise((resolve, reject) => {
    const cmd = `"${pyftsubsetPath}" "${inputPath}" --flavor=woff2 --output-file="${outputPath}" --layout-features='*' --glyphs='*'`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr || err.message);
      }
      resolve(outputPath);
    });
  });
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

async function downloadFontFile(url, outputPath) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  return outputPath;
}

async function resolveGoogleFont({ family, style, weight }) {
  const pyftsubsetPath = resolvePyftsubsetPath();
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
  const rawFile = path.join(OUTPUT_DIR, `${family.replace(/\s+/g, '')}-${style}.${ext}`);

  try {
    await downloadFontFile(fontURL, rawFile);
    console.log(`✅ Downloaded from Google Fonts: ${family} — ${style} (${ext})`);

    if (pyftsubsetPath && ['ttf', 'otf'].includes(ext)) {
      const woffName = `${family.replace(/\s+/g, '')}-${style}.woff2`;
      await convertWithPyftsubset(pyftsubsetPath, rawFile, woffName);
      fs.unlinkSync(rawFile); // delete .ttf/.otf after conversion
      console.log(`🔁 Converted to .woff2 and removed original: ${woffName}`);
    } else if (!pyftsubsetPath && ['ttf', 'otf'].includes(ext)) {
      console.warn(`⚠️ pyftsubset not found. Skipped conversion of ${family} — ${style}`);
    }
  } catch (err) {
    console.error(`❌ Failed to handle ${family} — ${style}:`, err.message);
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
