// scripts/generate-fonts.js (ESM)
// Reads latest *_tree.json and outputs a list of unique fonts to fonts-needed.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const OUTPUT_PATH = path.resolve(DATA_DIR, 'fonts-needed.json');

function getLatestTreeFile() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(name => name.endsWith('_tree.json'))
    .map(name => ({
      name,
      time: fs.statSync(path.join(DATA_DIR, name)).mtime
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error('❌ No *_tree.json file found in /data');
    process.exit(1);
  }

  return path.join(DATA_DIR, files[0].name);
}

function collectFontsFromTree(node, fonts = new Set()) {
  if (!node) return fonts;

  if (node.text && node.text.fontName && node.text.fontStyle) {
    const key = `${node.text.fontName}:::${node.text.fontStyle}:::${node.text.fontWeight || ''}`;
    fonts.add(key);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(child => collectFontsFromTree(child, fonts));
  }

  return fonts;
}

function main() {
  const latestTreePath = getLatestTreeFile();
  console.log(`🌳 Using tree file: ${latestTreePath}`);

  const tree = JSON.parse(fs.readFileSync(latestTreePath, 'utf-8'));
  const fontSet = collectFontsFromTree(tree);

  const fontList = Array.from(fontSet).map(pair => {
    const [family, style, weight] = pair.split(':::');
    return {
      family,
      style,
      weight: weight ? parseInt(weight, 10) : null
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fontList, null, 2));
  console.log(`✅ Saved ${fontList.length} fonts to fonts-needed.json`);
}

main();