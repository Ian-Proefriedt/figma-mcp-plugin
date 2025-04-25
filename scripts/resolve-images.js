// scripts/resolve-images.js (ESM)
// Parses tree.json and saves image fills to /data/images

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const treePath = path.resolve(__dirname, '../data/tree.json');
const outputDir = path.resolve(__dirname, '../data/images');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function collectImages(node, all = []) {
  if (node?.style?.image?.imageRef) {
    all.push({
      hash: node.style.image.imageRef,
      name: node.className || node.name || 'image',
      format: 'png'
    });
  }
  if (Array.isArray(node.children)) {
    node.children.forEach(child => collectImages(child, all));
  }
  return all;
}

async function downloadImage({ hash, name, format }) {
  const apiUrl = `https://api.figma.com/v1/images/${process.env.FIGMA_FILE_ID}?ids=${hash}&format=${format}`;
  const headers = {
    'X-Figma-Token': process.env.FIGMA_API_KEY
  };

  try {
    const res = await fetch(apiUrl, { headers });
    const json = await res.json();
    const url = json?.images?.[hash];
    if (!url) throw new Error('Image URL not found');

    const img = await fetch(url);
    const buffer = await img.arrayBuffer();
    const filePath = path.join(outputDir, `${name}.${format}`);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`✅ Saved ${filePath}`);
  } catch (err) {
    console.warn(`❌ Failed to download image ${name}:`, err);
  }
}

async function run() {
  const tree = JSON.parse(fs.readFileSync(treePath, 'utf-8'));
  const images = collectImages(tree);
  for (const img of images) {
    await downloadImage(img);
  }
}

run();