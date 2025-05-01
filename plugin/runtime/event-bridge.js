import { handleSelection } from './selection-handler.js';
import { traverseNodeTree } from '../core/recursive-node-traversal.js';
import { logNodeOutput } from '../utils/detection-log.js';

/**
 * Finds the top-level parent to use for sibling-aware traversal.
 */
function getTraversalRoot(node) {
  let current = node;
  while (current.parent && current.parent.type !== 'PAGE') {
    current = current.parent;
  }
  return current;
}

/**
 * Recursively searches a tree for a node by ID.
 */
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
        // Strip imageRef from style.image
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
      handleSelection(node, { exportId });
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
      handleSelection(node, { onlyExportImages: true, exportId });
    }
  
    // ✅ NEW: AI-to-Plugin Message
    else if (msg.type === 'ai-message') {
      figma.notify(`🤖 AI: ${msg.message}`, { timeout: 5000 });
  
      figma.ui.postMessage({
        type: 'show-ai-feedback',
        message: msg.message,
        payload: msg.payload
      });
    }
      

    // ✳️ Future: Allow UI → plugin messages to be relayed to server via fetch
    // Example:
    // if (msg.type === 'send-to-ai') {
    //   fetch('http://localhost:3001/send-to-ai', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(msg.payload)
    //   });
    // }
  };
}
