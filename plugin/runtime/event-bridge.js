import { handleSelection } from '../runtime/selection-handler.js';
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

  // ✅ Enhanced: process full tree, send only selected node
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

    figma.ui.postMessage({
      type: 'selection-change',
      data: result
    });
  });

  // ✅ Export still triggers full tree export + assets
  figma.ui.onmessage = msg => {
    if (msg.type === 'start-export') {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Please select a node first.");
        return;
      }
      handleSelection(node);
    }
  };
}
