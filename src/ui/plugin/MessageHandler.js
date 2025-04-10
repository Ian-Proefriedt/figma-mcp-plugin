/**
 * Handler for plugin messages
 */

import { Logger } from '../utils/Logger.js';
import { AppState } from '../state/AppState.js';

// Import any additional dependencies as needed

/**
 * Initialize the message handler for plugin communication
 */
export function initMessageHandler() {
  // Update the window.onmessage handler
  window.onmessage = (event) => {
    // Validate the message
    const msg = event.data.pluginMessage;
    if (!msg || !msg.type) {
      Logger.warn('Messaging', 'Invalid message received', event.data);
      return;
    }
    
    // Handle different message types
    switch (msg.type) {
      case 'selection-change':
      case 'selection':
        Logger.debug('Messaging', 'Selection changed', msg.data && msg.data.id);
        handleSelectionChange(msg.data);
        break;
        
      case 'raw-node-data':
        Logger.debug('Messaging', 'Raw node data received', msg.data && msg.data.id);
        handleRawNodeData(msg.data);
        break;
        
      case 'plugin-status':
        Logger.info('Messaging', `Status: ${msg.message || 'Unknown'}`);
        updateStatus(msg.message || 'Unknown status');
        break;
        
      case 'init':
        Logger.info('Messaging', 'Plugin initialized');
        break;
        
      default:
        Logger.warn('Messaging', 'Unknown message type', msg.type);
    }
  };
}

/**
 * Send a message to the plugin
 * @param {Object} message - The message to send
 */
export function sendPluginMessage(message) {
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Notify plugin that UI is ready
 */
export function sendReadyMessage() {
  sendPluginMessage({ type: 'ready' });
  window.readyMessageSent = true;
}

// Handler for selection change messages
export function handleSelectionChange(data) {
  if (!data) return;
  
  Logger.debug('Selection', 'Selection change data', data);
  Logger.debug('Selection', 'Selection data type', typeof data);
  
  // If data is an array or has items, use the first item
  if (data.items && Array.isArray(data.items) && data.items.length > 0) {
    Logger.debug('Selection', 'Using first item from selection array');
    data = data.items[0];
  }
  
  // Store and update UI
  AppState.setSelection(data);
}

// Handler for raw node data
export function handleRawNodeData(data) {
  if (!data) {
    Logger.warn('NodeData', 'Received null or undefined node data');
    return;
  }
  
  // IMPORTANT: Log the full data structure to debug issues
  Logger.debug('NodeData', 'Full data structure received', data);
  Logger.debug('NodeData', 'Data type', typeof data);
  Logger.debug('NodeData', 'Data properties', Object.keys(data));
  
  // Log detailed raw data for debugging
  if (Logger.level <= Logger.LEVELS.DEBUG) {
    Logger.debug('NodeData', `Raw Node Data: ${data.name} (${data.id})`);
    Logger.debug('NodeData', 'Basic Info', { id: data.id, name: data.name, type: data.type });
    
    if (data.layout) Logger.debug('NodeData', 'Layout', data.layout);
    if (data.visual) Logger.debug('NodeData', 'Visual', data.visual);
    if (data.text) Logger.debug('NodeData', 'Text', data.text);
    if (data.position) Logger.debug('NodeData', 'Position', data.position);
    if (data.size) Logger.debug('NodeData', 'Size', data.size);
  }
  
  Logger.info('NodeData', 'Processing node data', { 
    id: data.id, 
    type: data.type,
    name: data.name 
  });
  
  // Update UI with raw node data - using AppState to handle all updates
  AppState.setSelection(data);
}

// Update status display
export function updateStatus(message) {
  AppState.updateStatus(message);
}

// Create a MessageHandler object with all the exported functions
const MessageHandler = {
  initMessageHandler,
  sendPluginMessage,
  sendReadyMessage,
  handleSelectionChange,
  handleRawNodeData,
  updateStatus
};

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.MessageHandler = MessageHandler;
}

// Export as default as well
export default MessageHandler; 