/**
 * UI module exports
 */

// Import CSS to ensure webpack processes it
import './styles/main.css';

// Export utilities
export { Logger } from './utils/Logger.js';
export { PropertyInterpreter } from './utils/PropertyInterpreter.js';
export { default as PropertyBlockUtils } from './utils/PropertyBlockUtils.js';
export { UIFactory } from './utils/UIFactory.js';

// Export components
export { PropertyBlock, Behavior, EditBehavior } from './components/PropertyBlock.js';

// Export property modules
export { PropertyRegistry } from './properties/PropertyRegistry.js';
export { PropertyHandler } from './properties/PropertyHandler.js';

// Export state management
export { AppState } from './state/AppState.js';

// Export plugin modules
export { default as MessageHandler } from './plugin/MessageHandler.js';
export * as PluginUI from './plugin/PluginUI.js';

// UI entry point - initialization code
import { onDocReady, initPluginUI } from './plugin/PluginUI.js';

// When DOM is ready, initialize the UI
onDocReady(() => {
  console.log('[MCP] Initializing modular UI');
  
  // Initialize the plugin UI
  try {
    initPluginUI();
  } catch (error) {
    console.error('[MCP] Error initializing UI', error);
    
    // Fallback to send ready message if initialization fails
    setTimeout(() => {
      if (typeof window.readyMessageSent === 'undefined' || !window.readyMessageSent) {
        console.log('[MCP] Sending backup ready message');
        parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');
        window.readyMessageSent = true;
      }
    }, 1000);
  }
}); 