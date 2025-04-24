// scripts/resolve-local-fonts.js
// Searches system font folders for .ttf/.otf matches and converts them to .woff2

const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
// const ttf2woff2 = require('ttf2woff2'); (replaced with dynamic import)

const FONT_LIST_PATH = path.resolve(__dirname, '../data/fonts-needed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../data/fonts');

const SYSTEM_FONT_DIRS = process.platform === 'darwin'
  ? [
      '/System/Library/Fonts',
      '/Library/Fonts',
      path.resolve(process.env.HOME || '', 'Library/Fonts')
    ]
  : [
      'C:/Windows/Fonts',
      `C:/Users/${process.env.USERNAME}/AppData/Local/Microsoft/Windows/Fonts`
    ];

function findFontsRecursively(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      findFontsRecursively(fullPath, files);
    } else if (fullPath.match(/\.(ttf|otf)$/i)) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadFontMeta(filePath) {
  try {
    const font = fontkit.openSync(filePath);
    return {
      filePath,
      family: font.familyName.trim(),
      style: font.subfamilyName.trim()
    };
  } catch {
    return null;
  }
}

function matchFont(requested, systemFonts) {
  return systemFonts.find(font =>
    font.family.toLowerCase() === requested.family.toLowerCase() &&
    font.style.toLowerCase() === requested.style.toLowerCase()
  );
}

async function convertAndSaveTTF(inputPath, outputName) {
  const { default: ttf2woff2 } = await import('ttf2woff2');
  const buffer = fs.readFileSync(inputPath);
  const woff = ttf2woff2(buffer);
  const outputPath = path.join(OUTPUT_DIR, outputName);
  fs.writeFileSync(outputPath, woff);
  return outputPath;
}

async function main() {
  if (!fs.existsSync(FONT_LIST_PATH)) {
    console.error('❌ fonts-needed.json not found at', FONT_LIST_PATH);
    return;
  }

  const fontRequests = JSON.parse(fs.readFileSync(FONT_LIST_PATH, 'utf-8'));
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allFontFiles = SYSTEM_FONT_DIRS.flatMap(dir => findFontsRecursively(dir));
  const allFontMeta = allFontFiles.map(loadFontMeta).filter(Boolean);

  for (const requested of fontRequests) {
    const match = matchFont(requested, allFontMeta);
    if (match) {
      const safeName = `${requested.family}-${requested.style}`
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^\w-]/g, '') + '.woff2';

      const out = await convertAndSaveTTF(match.filePath, safeName);
      console.log(`✅ Found and converted: ${requested.family} — ${requested.style} → ${out}`);
    } else {
      console.warn(`⚠️ Font not found: ${requested.family} — ${requested.style}`);
    }
  }
}

(async () => await main())();
