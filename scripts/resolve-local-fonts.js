// scripts/resolve-local-fonts.js (universal version with dynamic pyftsubset path)
// Searches system font folders for .ttf/.otf matches and converts them to .woff2 using fonttools

const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { exec, execSync } = require('child_process');

const FONT_LIST_PATH = path.resolve(__dirname, '../data/fonts-needed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../data/fonts');

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

const SYSTEM_FONT_DIRS = isWindows
  ? [
      'C:/Windows/Fonts',
      `C:/Users/${process.env.USERNAME}/AppData/Local/Microsoft/Windows/Fonts`
    ]
  : isMac
  ? [
      '/System/Library/Fonts',
      '/Library/Fonts',
      path.resolve(process.env.HOME, 'Library/Fonts')
    ]
  : [];

function resolvePyftsubsetPath() {
  try {
    const cmd = isWindows ? 'where pyftsubset' : 'which pyftsubset';
    return execSync(cmd).toString().trim();
  } catch {
    return null;
  }
}

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

function convertWithPyftsubset(pyftsubsetPath, inputPath, outputName) {
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

async function main() {
  const pyftsubsetPath = resolvePyftsubsetPath();
  if (!pyftsubsetPath) {
    console.warn('⚠️ pyftsubset (fonttools) is not installed or not in PATH. Skipping local font conversion.');
    return;
  }

  if (!fs.existsSync(FONT_LIST_PATH)) {
    console.error('❌ fonts-needed.json not found at', FONT_LIST_PATH);
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const fontRequests = JSON.parse(fs.readFileSync(FONT_LIST_PATH, 'utf-8'));
  const allFontFiles = SYSTEM_FONT_DIRS.flatMap(dir => findFontsRecursively(dir));
  const allFontMeta = allFontFiles.map(loadFontMeta).filter(Boolean);

  for (const requested of fontRequests) {
    const match = matchFont(requested, allFontMeta);
    if (match) {
      const safeName = `${requested.family.replace(/\s+/g, '')}-${requested.style}.woff2`;
      try {
        const out = await convertWithPyftsubset(pyftsubsetPath, match.filePath, safeName);
        console.log(`✅ Found and converted: ${requested.family} — ${requested.style} → ${out}`);
      } catch (err) {
        console.warn(`⚠️ Conversion failed for ${requested.family} — ${requested.style}:`, err);
      }
    } else {
      console.warn(`⚠️ Font not found: ${requested.family} — ${requested.style}`);
    }
  }
}

(async () => await main())();
