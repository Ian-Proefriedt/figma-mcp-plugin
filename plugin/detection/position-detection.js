// detection/position-detection.js

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

export function getRawPositionData(node) {
  const parent = node.parent;

  const x = node.relativeTransform?.[0]?.[2] ?? node.x ?? null;
  const y = node.relativeTransform?.[1]?.[2] ?? node.y ?? null;

  return {
    x,
    y,
    width: node.width ?? null,
    height: node.height ?? null,
    parentWidth: parent?.width ?? null,
    parentHeight: parent?.height ?? null,
    horizontalConstraint: node.constraints?.horizontal ?? null,
    verticalConstraint: node.constraints?.vertical ?? null
  };
}

export function getRotation(node) {
  return node?.rotation || null;
}

export function getPositionType(node) {
  if (isActuallyInAutoLayout(node)) return 'relative';
  if (getFixedStatus(node)) return 'fixed';
  return node && node.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'relative';
}

export function getZIndex(node) {
  return 1; // placeholder: replaced by traverseNodeTree z-index logic
}
