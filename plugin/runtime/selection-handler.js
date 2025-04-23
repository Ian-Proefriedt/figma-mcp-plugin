import { traverseNodeTree } from '../core/recursive-node-traversal.js';
import { isImageNode } from '../detection/style-detection.js';
import { sanitizeClassName } from '../utils/classname-sanitizer.js';

export function handleSelection(node) {
  if (!node) {
    console.warn("No node selected.");
    return null;
  }

  const tree = traverseNodeTree(node);
  figma.ui.postMessage({
    type: 'export-tree-to-server',
    tree
  });

  // Also trigger font resolution from UI
  figma.ui.postMessage({
    type: 'trigger-font-resolution'
  });

  // 🔽 Detect and post image data
  const imagePromises = [];

  function collectImageNodes(node) {
    if (isImageNode(node) && node.fills) {
      const imageFill = node.fills.find(f => f.type === 'IMAGE');
      if (imageFill && imageFill.imageHash) {
        const promise = figma.getImageByHash(imageFill.imageHash).getBytesAsync()
          .then(bytes => {
            figma.ui.postMessage({
              type: 'export-image',
              bytes: Array.from(bytes),
              name: sanitizeClassName(node.name || 'image') + '.png'
            });
          })
          .catch(err => {
            console.warn('⚠️ Failed to extract image for', node.name, err);
          });
        imagePromises.push(promise);
      }
    }
    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(collectImageNodes);
    }
  }

  collectImageNodes(node);
  Promise.all(imagePromises).then(() => {
    console.log('📦 All image exports complete');
  });
}
