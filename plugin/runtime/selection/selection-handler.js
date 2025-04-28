import { traverseNodeTree } from '../../core/recursive-node-traversal.js';
import { isImageNode } from '../../detection/style-detection.js';
import { sanitizeClassName } from '../../utils/classname-sanitizer.js';
import { logNodeOutput } from '../../utils/detection-log.js';
import { handleServerStart } from '../server/server-helper.js'; // KEEP THIS ONE AS IS

export function handleSelection(node) {
  if (!node) {
    console.warn("No node selected.");
    return null;
  }

  const tree = traverseNodeTree(node);

  // ✅ Add your exact recursive logging here
  logNodeOutput(node, tree);

  // Check if the server is running and start it if necessary
  handleServerStart((err) => {
    if (err) {
      console.error('Error starting the server:', err);
      return;
    }

    // Now that the server is running, proceed with export actions
    figma.ui.postMessage({
      type: 'export-tree-to-server',
      tree
    });

    figma.ui.postMessage({
      type: 'selection-change',
      data: tree
    });

    figma.ui.postMessage({
      type: 'trigger-font-resolution'
    });

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
  });
}