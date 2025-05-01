import { isImageNode } from '../detection/style-detection.js';
import { sanitizeClassName } from '../utils/classname-sanitizer.js';
import { traverseNodeTree } from '../core/recursive-node-traversal.js';

export function handleSelection(node, { exportId, onlyExportImages = false } = {}) {
  // 1. Process only the selected subtree for tree and font data
  const processedTree = traverseNodeTree(node);
  if (!processedTree) {
    console.warn("❌ Failed to process selected node.");
    return;
  }

  // 2. Filename for the tree export
  const safeName = (node.name || 'unnamed')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
  const filename = `${safeName}_tree.json`;

  // 3. Tree + Font export (skip if only exporting images)
  if (!onlyExportImages) {
    figma.ui.postMessage({
      type: 'export-tree-to-server',
      exportId,
      tree: {
        name: filename,
        contents: processedTree
      }
    });

    figma.ui.postMessage({
      type: 'trigger-font-resolution',
      exportId
    });

    return; // 🚫 Do not run image logic during this call
  }

  // 4. Image export only (on separate call)
  const imagePromises = [];
  let imageCount = 0;

  function collectImageNodes(rawNode) {
    if (isImageNode(rawNode) && rawNode.fills) {
      const imageFill = rawNode.fills.find(f => f.type === 'IMAGE');
      if (imageFill?.imageHash) {
        const promise = figma.getImageByHash(imageFill.imageHash).getBytesAsync()
          .then(bytes => {
            figma.ui.postMessage({
              type: 'export-image',
              exportId,
              bytes: Array.from(bytes),
              name: sanitizeClassName(rawNode.name || 'image') + '.png'
            });
          })
          .catch(err => {
            console.warn(`⚠️ Failed to extract image: ${rawNode.name}`, err);
          });

        imageCount++;
        imagePromises.push(promise);
      }
    }

    if ('children' in rawNode && Array.isArray(rawNode.children)) {
      rawNode.children.forEach(collectImageNodes);
    }
  }

  collectImageNodes(node); // use raw node, not processedTree

  figma.ui.postMessage({
    type: 'image-export-count',
    exportId,
    count: imageCount
  });

  Promise.all(imagePromises).then(() => {
    figma.ui.postMessage({
      type: 'image-export-count',
      exportId,
      count: imageCount
    });    
    
  });
  
}