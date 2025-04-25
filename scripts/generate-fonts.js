// scripts/generate-fonts.js (ESM)
// Reads tree.json and outputs a list of unique fonts to fonts-needed.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TREE_PATH = path.resolve(__dirname, '../data/tree.json');
const OUTPUT_PATH = path.resolve(__dirname, '../data/fonts-needed.json');

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
  if (!fs.existsSync(TREE_PATH)) {
    console.error('❌ tree.json not found at', TREE_PATH);
    return;
  }

  const tree = JSON.parse(fs.readFileSync(TREE_PATH, 'utf-8'));
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