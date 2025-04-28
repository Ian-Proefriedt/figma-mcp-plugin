// Import necessary backend logic
import { handleSelection } from './selection/selection-handler.js'; // For export flow
import { traverseNodeTree } from '../core/recursive-node-traversal.js';
import { logNodeOutput } from '../utils/detection-log.js';

// Import server-related functions
import { exportTreeToServer, exportImageToServer, triggerFontResolution } from './server/export-flow.js'; // Export logic

// Import server helper function to start server
import { handleServerStart as handleServerStartHelper } from './server/server-helper.js'; // Correct import from backend

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

/**
 * Registers all plugin events and listens to messages from the UI.
 */
export function registerPluginEvents() {
  figma.showUI(__html__, { visible: true, width: 300, height: 200 });

  // Listen for selection changes and send the processed node data to the UI
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

    // Log and send the selected node data to the UI
    logNodeOutput(selected, result);

    figma.ui.postMessage({
      type: 'selection-change',
      data: result
    });
  });

  // Handle messages from the UI
  figma.ui.onmessage = (msg) => {
    if (msg.type === 'start-server') {
      // ➡️ Start the server when requested
      handleServerStartHelper((err) => {
        if (err) {
          console.error('❌ Failed to start server:', err);
          figma.notify('Failed to start server. See console.');
        } else {
          console.log('✅ Server is running.');
          figma.notify('Server started successfully.');
        }
      });
    }

    else if (msg.type === 'start-export') {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Please select a node first.");
        return;
      }

      // ➡️ Now just handle export logic (assumes server already running)
      exportTreeToServer(msg.tree);
      exportImageToServer(msg.image);
      triggerFontResolution();

      handleSelection(node); // Handles the node selection logic
    }
  };

  // ✅ (No call to setupSelectionChangeHandler() anymore)
}
