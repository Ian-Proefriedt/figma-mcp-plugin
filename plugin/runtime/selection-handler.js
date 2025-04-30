import { isImageNode } from '../detection/style-detection.js';
import { sanitizeClassName } from '../utils/classname-sanitizer.js';
import { traverseNodeTree } from '../core/recursive-node-traversal.js';

export function handleSelection(node, { exportId, onlyExportImages = false } = {}) {
  // 1. Find the top root (for correct context)
  const root = getTraversalRoot(node);
  const fullTree = traverseNodeTree(root);

  // 2. Locate the originally selected node inside it
  const tree = findNodeById(fullTree, node.id);
  if (!tree) {
    console.warn("❌ Selected node not found in processed tree.");
    return;
  }

  // 3. Filename
  const safeName = (node.name || 'unnamed')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
  const filename = `${safeName}_tree.json`;

  // 4. Tree + Font
  if (!onlyExportImages) {
    figma.ui.postMessage({
      type: 'export-tree-to-server',
      exportId,
      tree: {
        name: filename,
        contents: tree
      }
    });

    figma.ui.postMessage({
      type: 'trigger-font-resolution',
      exportId
    });
  }

  // 5. Images
  const imagePromises = [];

  function collectImageNodes(node) {
    if (isImageNode(node) && node.fills) {
      const imageFill = node.fills.find(f => f.type === 'IMAGE');
      if (imageFill?.imageHash) {
        const promise = figma.getImageByHash(imageFill.imageHash).getBytesAsync()
          .then(bytes => {
            figma.ui.postMessage({
              type: 'export-image',
              exportId,
              bytes: Array.from(bytes),
              name: sanitizeClassName(node.name || 'image') + '.png'
            });
          })
          .catch(err => {
            console.warn(`⚠️ Failed to extract image: ${node.name}`, err);
          });
        imagePromises.push(promise);
      }
    }

    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(collectImageNodes);
    }
  }

  collectImageNodes(tree);

  Promise.all(imagePromises).then(() => {
    console.log(`📦 Image export complete [exportId=${exportId}]`);
  });
}

// utility
function getTraversalRoot(node) {
  let current = node;
  while (current.parent && current.parent.type !== 'PAGE') {
    current = current.parent;
  }
  return current;
}

function findNodeById(tree, id) {
  if (tree.id === id) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}
