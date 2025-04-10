/**
 * PluginUI - Main UI initialization and management
 */

import { Logger } from '../utils/Logger.js';
import { createPropertyBlock, initPropertyBlocks } from '../utils/PropertyBlockUtils.js';
import { PropertyHandler } from '../properties/PropertyHandler.js';
import { AppState } from '../state/AppState.js';

/**
 * Initialize plugin UI when page is ready
 */
export function initPluginUI() {
  Logger.info('PluginUI', 'Initializing plugin UI');
  
  try {
    // Initialize property blocks
    initPropertyBlocks();
    
    // Initialize section behaviors
    initSections();
    
    // Send ready message to plugin
    sendReadyMessage();
    
    Logger.info('PluginUI', 'UI initialization complete');
  } catch (error) {
    Logger.error('PluginUI', 'Error initializing UI', error);
    throw error;
  }
}

/**
 * Initialize section behaviors
 */
export function initSections() {
  Logger.info('Init', 'Initializing section behaviors');
  
  // Set initial state for all sections - closed
  document.querySelectorAll('.section-content-wrapper').forEach(wrapper => {
    wrapper.style.height = '0';
  });
  
  // Use event delegation instead of individual listeners
  const container = document.querySelector('.plugin-container');
  if (container) {
    container.addEventListener('click', (event) => {
      // Find if a section header or its child was clicked
      const header = event.target.closest('.section-header');
      if (!header) return;
      
      const section = header.parentElement;
      const wrapper = section.querySelector('.section-content-wrapper');
      const arrow = header.querySelector('.section-arrow');
    
      if (!wrapper || !arrow) return;
    
      if (section.classList.contains('expanded')) {
        // Collapse section
        wrapper.style.height = wrapper.scrollHeight + 'px';
        wrapper.offsetHeight; // Force reflow
        wrapper.style.height = '0';
        section.classList.remove('expanded');
        arrow.classList.remove('expanded');
      } else {
        // Expand section
        section.classList.add('expanded');
        arrow.classList.add('expanded');
        wrapper.style.height = 'auto';
        const targetHeight = wrapper.scrollHeight;
        wrapper.style.height = '0';
        wrapper.offsetHeight; // Force reflow
        wrapper.style.height = targetHeight + 'px';
      }
    });
  }
  
  // Expand the first section by default
  const firstSection = document.querySelector('.section');
  if (firstSection) {
    const header = firstSection.querySelector('.section-header');
    if (header) {
      // Trigger a click event instead of calling click()
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      header.dispatchEvent(clickEvent);
    }
  }
}

/**
 * Send ready message to plugin
 */
function sendReadyMessage() {
  window.parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');
  window.readyMessageSent = true;
  Logger.info('PluginUI', 'Ready message sent to plugin');
}

/**
 * Execute when document is ready
 * @param {Function} callback - Function to execute
 */
export function onDocReady(callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(callback, 1);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.initPluginUI = initPluginUI;
  window.initPropertyBlocks = initPropertyBlocks;
  window.initSections = initSections;
} 