/**
 * Material Components Properties Plugin
 * 
 * This plugin provides a UI for viewing and editing properties
 * of Figma nodes in a format familiar to web developers.
 */

// Debug flag for controlling logging output
const DEBUG = false;

// Only log in debug mode
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// Only warn in debug mode
function debugWarn(...args) {
  if (DEBUG) {
    console.warn(...args);
  }
}

debugLog("Running figma-mcp-plugin");

// For Figma plugins, we need to use the HTML from the UI file
// The following line gets replaced during build
const html = "<webview>";

// Show UI with dimensions that match the current implementation
figma.showUI(html, { width: 450, height: 600 });

// Handle messages from the UI
figma.ui.onmessage = (msg) => {
  debugLog("Message from UI:", msg);
  
  switch (msg.type) {
    case 'ready':
    case 'ui-ready':
      // UI is ready, send current selection
      sendSelectionInfo();
      break;
      
    case 'get-selection':
      // UI is requesting selection data
      sendSelectionInfo();
      break;
      
    default:
      debugWarn("Unknown message type:", msg.type);
  }
};

// Listen for selection changes
figma.on('selectionchange', () => {
  sendSelectionInfo();
});

/**
 * Send current selection info to the UI
 */
function sendSelectionInfo() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    // Nothing selected
    figma.ui.postMessage({
      type: 'selection-change',
      data: null
    });
    return;
  }
  
  // Get the first selected node
  const node = selection[0];
  
  // Process the node data
  const processedData = processNodeProperties(node);
  
  // Send to UI
  figma.ui.postMessage({
    type: 'selection-change',
    data: processedData
  });
  
  debugLog("Selection data sent to UI:", processedData);
}

/**
 * Process node properties into a structured format for the UI
 * This is a simplified version to get started - we'll expand this
 * as we continue the migration
 */
function processNodeProperties(node) {
  if (!node) return null;
  
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    
    // More properties will be added as we continue migration
    layout: {
      type: node.layoutMode ? "AUTO" : "NONE",
      autoLayout: node.layoutMode ? {
        mode: node.layoutMode,
        primaryAxis: {
          alignItems: node.primaryAxisAlignItems
        },
        counterAxis: {
          alignItems: node.counterAxisAlignItems
        },
        spacing: {
          items: node.itemSpacing
        }
      } : null
    }
  };
} 