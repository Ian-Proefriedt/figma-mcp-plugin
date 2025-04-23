function isOverlapping(a, b) {
  if (!a || !b) return false;
  const ax = a.x, ay = a.y, aw = a.width, ah = a.height;
  const bx = b.x, by = b.y, bw = b.width, bh = b.height;
  return !(ax + aw <= bx || ax >= bx + bw || ay + ah <= by || ay >= by + bh);
}

function interpretConstraint(value, axis) {
  if (axis === 'horizontal') {
    switch (value) {
      case 'MIN': return 'left';
      case 'MAX': return 'right';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  } else if (axis === 'vertical') {
    switch (value) {
      case 'MIN': return 'top';
      case 'MAX': return 'bottom';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  }
  return 'undefined';
}

function isActuallyInAutoLayout(node) {
  if (!node || node.type !== "TEXT") return false;
  const parentLayout = node.parent && node.parent.layoutMode;
  const positioning = node.layoutPositioning;
  const constraints = node.constraints || {};
  const hasNeutralConstraints = (constraints.horizontal === "MIN" && constraints.vertical === "MIN");
  const isMarkedAbsolute = positioning === "ABSOLUTE";
  const isInsideAutoLayout = parentLayout === "HORIZONTAL" || parentLayout === "VERTICAL";
  const isAutoPositioning = positioning === "AUTO";
  return ((isMarkedAbsolute && isInsideAutoLayout && hasNeutralConstraints) || isAutoPositioning);
}

function getFixedStatus(node) {
  const isAbsolute = node && node.layoutPositioning === 'ABSOLUTE';
  const parent = node && node.parent;
  const isRootChild = parent && parent.type === 'FRAME' && (!parent.parent || parent.parent.type === 'PAGE');
  return isAbsolute && isRootChild;
}

function getPosition(node) {
  return { x: (node && node.x) || 0, y: (node && node.y) || 0 };
}

function getSize(node) {
  return { width: (node && node.width) || 0, height: (node && node.height) || 0 };
}

function getSizingModes(node) {
  return {
    widthMode: (node && node.primaryAxisSizingMode && node.primaryAxisSizingMode.toLowerCase()) || 'fixed',
    heightMode: (node && node.counterAxisSizingMode && node.counterAxisSizingMode.toLowerCase()) || 'fixed'
  };
}

function getRotation(node) {
  return (node && node.rotation) || 0;
}

function getConstraints(node) {
  const raw = (node && node.constraints) || {};
  return {
    horizontal: interpretConstraint(raw.horizontal, 'horizontal'),
    vertical: interpretConstraint(raw.vertical, 'vertical')
  };
}

function getPositioning(node) {
  if (isActuallyInAutoLayout(node)) return 'relative';
  if (getFixedStatus(node)) return 'fixed';
  return node && node.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'relative';
}

function getClipping(node) {
  return (node && node.clipsContent) || false;
}

function getZIndex(node) {
  return 1; // placeholder: replaced by traverseNodeTree z-index logic
}