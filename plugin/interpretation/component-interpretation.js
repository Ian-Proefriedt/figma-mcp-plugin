// interpretation/component-interpretation.js

export function interpretPropName(rawPropString) {
    if (typeof rawPropString !== 'string') return null;
  
    // Remove the #ID portion (e.g., "Title#2525:4" → "Title")
    const [rawName] = rawPropString.split('#');
  
    // Convert to camelCase
    return rawName
      .trim()
      .replace(/[^\w\s]/g, '')                      // remove symbols
      .replace(/\s+(\w)/g, (_, c) => c.toUpperCase()) // capitalize letters after spaces
      .replace(/^([A-Z])/, (_, c) => c.toLowerCase()); // lowercase first letter
  }
  