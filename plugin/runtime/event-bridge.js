import { handleSelection } from './selection-handler.js';
import { traverseNodeTree } from '../core/recursive-node-traversal.js';
import { logNodeOutput } from '../utils/logging/detection-log.js';
import { processTokens } from '../processing/variable-processing.js';

const tokenMap = processTokens(); // ✅ No detection logic here

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

export function registerPluginEvents() {
  figma.showUI(__html__, { visible: true, width: 300, height: 200 });

  figma.on('selectionchange', () => {
    const selected = figma.currentPage.selection[0];
    if (!selected) return;

    const root = getTraversalRoot(selected);
    const fullTree = traverseNodeTree(root);

    const result = findNodeById(fullTree, selected.id);
    if (!result) {
      console.warn('⚠️ Selected node not found in processed tree');
      return;
    }

    logNodeOutput(selected, result);

    try {
      const safeResult = JSON.parse(JSON.stringify(result, (key, value) => {
        if (key === 'imageRef') return null;
        return value;
      }));

      figma.ui.postMessage({
        type: 'selection-change',
        data: safeResult
      });

    } catch (err) {
      console.error('❌ Failed to post message due to unsafe data:', err);
    }
  });

  figma.ui.onmessage = msg => {
    const node = figma.currentPage.selection[0];

    if (msg.type === 'start-export') {
      if (!node) {
        figma.notify("Please select a node first.");
        return;
      }
      const exportId = msg.exportId;
      if (!exportId) {
        console.warn('❗ Ignoring export message: missing exportId', msg);
        return;
      }

      // ✳️ Export node tree
      handleSelection(node, { exportId });

      // ✅ Export token map as a separate message
      try {
        figma.ui.postMessage({
          type: 'export-variable-map',
          exportId, // ✅ send it for consistency
          name: `raw/variable-map.json`,
          contents: tokenMap
        });
        console.log('📦 Sent variable-map.json to server');
      } catch (err) {
        console.error('❌ Failed to export token map:', err);
      }
    }

    else if (msg.type === 'begin-image-export') {
      if (!node) {
        figma.notify("Please select a node first.");
        return;
      }
      const exportId = msg.exportId;
      if (!exportId) {
        console.warn('❗ Ignoring export message: missing exportId', msg);
        return;
      }

      console.log("✅ begin-image-export received. Triggering image extraction for exportId:", exportId);
      handleSelection(node, { onlyExportImages: true, exportId });
    }

    else if (msg.type === 'ai-message') {
      figma.notify(`🤖 AI: ${msg.message}`, { timeout: 5000 });

      figma.ui.postMessage({
        type: 'show-ai-feedback',
        message: msg.message,
        payload: msg.payload
      });
    }
  };
}
