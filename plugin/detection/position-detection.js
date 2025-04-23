import { interpretConstraint } from '../interpretation/position-interpretation.js';

export function isOverlapping(a, b) {
  if (!a || !b) return false;
  const ax = a.x, ay = a.y, aw = a.width, ah = a.height;
  const bx = b.x, by = b.y, bw = b.width, bh = b.height;
  return !(ax + aw <= bx || ax >= bx + bw || ay + ah <= by || ay >= by + bh);
}

export function isActuallyInAutoLayout(node) {
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

export function getFixedStatus(node) {
  const isAbsolute = node && node.layoutPositioning === 'ABSOLUTE';
  const parent = node && node.parent;
  const isRootChild = parent && parent.type === 'FRAME' && (!parent.parent || parent.parent.type === 'PAGE');
  return isAbsolute && isRootChild;
}

export function getPosition(node) {
  return { x: (node && node.x) || 0, y: (node && node.y) || 0 };
}

export function getSize(node) {
  return { width: (node && node.width) || 0, height: (node && node.height) || 0 };
}

export function getSizingModes(node) {
  return {
    widthMode: (node && node.primaryAxisSizingMode && node.primaryAxisSizingMode.toLowerCase()) || 'fixed',
    heightMode: (node && node.counterAxisSizingMode && node.counterAxisSizingMode.toLowerCase()) || 'fixed'
  };
}

export function getRotation(node) {
  return (node && node.rotation) || 0;
}

export function getConstraints(node) {
  const raw = (node && node.constraints) || {};
  return {
    horizontal: interpretConstraint(raw.horizontal, 'horizontal'),
    vertical: interpretConstraint(raw.vertical, 'vertical')
  };
}

export function getPositioning(node) {
  if (isActuallyInAutoLayout(node)) return 'relative';
  if (getFixedStatus(node)) return 'fixed';
  return node && node.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'relative';
}

export function getClipping(node) {
  return (node && node.clipsContent) || false;
}

export function getZIndex(node) {
  return 1; // placeholder: replaced by traverseNodeTree z-index logic
}
