// Import detection and export logic
import { handleSelection } from './selection/selection-handler.js';
import { exportTreeToServer, exportImageToServer, triggerFontResolution } from './server/export-flow.js';

/**
 * Registers all plugin events and listens to messages from the UI.
 */
export function registerPluginEvents() {
  figma.showUI(__html__, { visible: true, width: 300, height: 200 });

  let lastSelectedNodeId = null;

  // ✅ Smart selection listener to avoid redundant triggers
  figma.on('selectionchange', () => {
    const selected = figma.currentPage.selection[0];

    if (!selected) {
      lastSelectedNodeId = null;
      return;
    }

    if (selected.id === lastSelectedNodeId) {
      console.log('⚠️ Duplicate selection — skipping re-export:', selected.name);
      return;
    }

    lastSelectedNodeId = selected.id;
    console.log('📌 New node selected:', selected.name);
    handleSelection(selected);
  });

  // ✅ UI ↔ Plugin message bridge
  figma.ui.onmessage = (msg) => {
    console.log('📬 Plugin received message from UI:', msg);

    if (msg.type === 'export-tree-to-server') {
      exportTreeToServer(msg.tree);
    }

    else if (msg.type === 'export-image') {
      exportImageToServer(msg.name, msg.bytes);
    }

    else if (msg.type === 'trigger-font-resolution') {
      triggerFontResolution();
    }

    else if (msg.type === 'selection-change') {
      const node = figma.currentPage.selection[0];
      if (node) {
        handleSelection(node); // Optional: manually re-trigger from UI
      }
    }
  };
}
