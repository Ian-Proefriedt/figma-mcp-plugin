import { getRawImage } from '../detection/style-detection.js';
import { sanitizeClassName } from '../utils/classname-sanitizer.js';
import { traverseNodeTree } from '../core/recursive-node-traversal.js';
import { getSanitizeWarnings, clearSanitizeWarnings } from '../utils/value-sanitizer.js';


export function handleSelection(node, { exportId, onlyExportImages = false } = {}) {

  console.log("📥 handleSelection() called. onlyExportImages =", onlyExportImages, "exportId:", exportId);
  // 1. Process only the selected subtree for tree and font data
  const processedTree = traverseNodeTree(node);
  if (!processedTree) {
    console.warn("❌ Failed to process selected node.");
    return;
  }

  const sanitizeWarnings = getSanitizeWarnings();
if (sanitizeWarnings.length > 0) {
  figma.ui.postMessage({
    type: 'sanitize-warnings',
    exportId,
    warnings: sanitizeWarnings
  });
}
clearSanitizeWarnings();

  // 2. Filename for the tree export
  const safeName = (node.name || 'unnamed')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
  const filename = `${safeName}_tree.json`;

  // 2.5: Scan tree for unpostable values (debug only)
  function findUnsafeValues(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) return [];

    const issues = [];

    for (const key in obj) {
      const value = obj[key];
      const fullPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        if (typeof value.type === 'string' && typeof value.remove === 'function') {
          issues.push(`⚠️ Raw Figma node found at ${fullPath}`);
        } else {
          issues.push(...findUnsafeValues(value, fullPath));
        }
      } else if (typeof value === 'function') {
        issues.push(`⚠️ Function found at ${fullPath}`);
      } else if (typeof value === 'symbol') {
        issues.push(`⚠️ Symbol found at ${fullPath}`);
      }
    }

    return issues;
  }

  const issues = findUnsafeValues(processedTree);
  if (issues.length > 0) {
    console.warn('🔍 Tree safety scan found potential issues:', issues);
  }

  // 3. Tree + Font export (skip if only exporting images)
  if (!onlyExportImages) {
    try {
      const payload = {
        type: 'export-tree-to-server',
        exportId,
        tree: {
          name: filename,
          contents: processedTree
        }
      };

      JSON.stringify(payload); // validate safety
      figma.ui.postMessage(payload);
    } catch (err) {
      console.error('❌ Unsafe export payload: Cannot postMessage tree:', err);
      figma.notify('Export failed: unresolved symbol in component or variant.');

      console.log('🔍 ProcessedTree summary:', {
        id: processedTree.id,
        name: processedTree.name,
        type: processedTree.type,
        childCount: processedTree.children?.length || 0
      });

      return;
    }

    figma.ui.postMessage({
      type: 'trigger-font-resolution',
      exportId
    });

    return;
  }

  // 4. Image export only (on separate call)
  const imagePromises = [];
  let imageCount = 0;

  function collectImageNodes(rawNode) {
    if (!rawNode) return;
  
    const rawImage = getRawImage(rawNode);
    if (rawImage?.imageRef) {
      console.log("🧪 Image node detected:", rawNode.name);
  
      const promise = figma.getImageByHash(rawImage.imageRef).getBytesAsync()
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
  
    if ('children' in rawNode && Array.isArray(rawNode.children)) {
      rawNode.children.forEach(collectImageNodes);
    }
  }
  
  

  collectImageNodes(node); // use raw node, not processedTree

  console.log("🖼️ Image export completed. Total image nodes found:", imageCount);
  
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
