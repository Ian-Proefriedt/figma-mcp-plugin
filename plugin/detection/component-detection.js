// detection/component-prop-detection.js

// TEXT
export function getTextPropertyReference(node) {
    if (
      node.type === 'TEXT' &&
      'componentPropertyReferences' in node &&
      node.componentPropertyReferences?.characters
    ) {
      return node.componentPropertyReferences.characters;
    }
    return null;
  }
  
  // BOOLEAN
  export function getBooleanPropertyReference(node) {
    if (
      'componentPropertyReferences' in node &&
      typeof node.componentPropertyReferences?.visible === 'string'
    ) {
      return node.componentPropertyReferences.visible;
    }
    return null;
  }
  
  // INSTANCE_SWAP
  export function getInstanceSwapPropertyReference(node) {
    if (
      node.type === 'INSTANCE' &&
      'componentPropertyReferences' in node &&
      typeof node.componentPropertyReferences?.component === 'string'
    ) {
      return node.componentPropertyReferences.component;
    }
    return null;
  }
  
  // IMAGE
  export function getImagePropertyReference(node) {
    if (
      node.fills &&
      Array.isArray(node.fills) &&
      node.fills.some(fill => fill.boundVariables?.image) &&
      node.boundVariables?.image
    ) {
      return node.boundVariables.image;
    }
    return null;
  }
  