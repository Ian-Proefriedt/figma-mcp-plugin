import { interpretLayoutProperties } from '../interpreters/layoutInterpreters.js';

/**
 * Process a Figma node into a standardized format for our UI
 * @param {Object} node - The Figma node
 * @returns {Object} - Processed node data
 */
export function processNodeProperties(node) {
  if (!node) return null;

  return {
    // Basic properties
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    
    // Layout properties - using our interpreter
    layout: processLayoutProperties(node),
    
    // We'll add more properties as we migrate more code
  };
}

/**
 * Process layout properties using our interpreters
 * @param {Object} node - The Figma node
 * @returns {Object} - Processed layout properties
 */
function processLayoutProperties(node) {
  // We're using our interpreter module here
  return interpretLayoutProperties(node);
} 