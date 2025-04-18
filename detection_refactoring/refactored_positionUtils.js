// refactored_positionUtils.js
// Handles detection of position, size, rotation, constraints, visibility, and z-order (CSS-ready)

export function getPosition(node) {
  return {
    x: node?.x ?? 0,
    y: node?.y ?? 0
  };
}

export function getSize(node) {
  return {
    width: node?.width ?? 0,
    height: node?.height ?? 0
  };
}

export function getRotation(node) {
  return node?.rotation ?? 0;
}

export function getConstraints(node) {
  return {
    horizontal: mapConstraint(node?.constraints?.horizontal ?? 'undefined'),
    vertical: mapConstraint(node?.constraints?.vertical ?? 'undefined')
  };
}

function mapConstraint(value) {
  switch (value) {
    case 'MIN': return 'start';
    case 'MAX': return 'end';
    case 'CENTER': return 'center';
    case 'STRETCH': return 'stretch';
    case 'SCALE': return 'scale';
    default: return 'undefined';
  }
}

function getFixedStatus(node) {
  const isAbsolute = node?.layoutPositioning === 'ABSOLUTE';
  const isTopLevel = node?.parent?.type === 'FRAME' && !node?.parent?.parent;
  return isAbsolute && isTopLevel;
}

export function getPositioning(node) {
  if (getFixedStatus(node)) return 'fixed';
  return node?.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'relative';
}

export function getVisibility(node) {
  return node?.visible ?? true;
}

export function getLockStatus(node) {
  return node?.locked ?? false;
}

export function getClipping(node) {
  return node?.clipsContent ?? false;
}

export function getZIndex(node) {
  if (!node?.parent || !Array.isArray(node.parent?.children)) return 0;

  const index = node.parent.children.indexOf(node);

  if (getFixedStatus(node)) return 9999;

  return index;
} 
