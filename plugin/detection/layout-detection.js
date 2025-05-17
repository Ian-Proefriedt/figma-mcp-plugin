// detection/layout-detection.js

export function getRawLayoutAlignment(node) {
  return {
    primaryAxis: node?.primaryAxisAlignItems || null,
    counterAxis: node?.counterAxisAlignItems || null
  };
}

export function getLayoutDirection(node) {
  return node?.layoutMode === 'VERTICAL' ? 'column' : node?.layoutMode === 'HORIZONTAL' ? 'row' : null;
}

export function isAutoLayout(node) {
  return node?.layoutMode === 'VERTICAL' || node?.layoutMode === 'HORIZONTAL';
}

export function getRawSizeData(node) {
  const parent = node.parent;
  const isText = node.type === 'TEXT';

  return {
    parentLayoutMode: parent?.layoutMode ?? null,
    parentWidth: parent?.width ?? null,
    parentHeight: parent?.height ?? null,

    layoutGrow: typeof node.layoutGrow === 'number' ? node.layoutGrow : 0,
    layoutAlign: node.layoutAlign ?? null,

    layoutMode: node.layoutMode || 'NONE',
    primaryAxisSizingMode: node.primaryAxisSizingMode ?? null,
    counterAxisSizingMode: node.counterAxisSizingMode ?? null,

    isText,
    ...(isText && {
      textAutoResize: node.textAutoResize ?? null
    }),

    width: node?.width ?? 0,
    height: node?.height ?? 0
  };
}

export function getItemSpacing(node) {
  const spacing = node?.itemSpacing;
  return spacing && spacing !== 0 ? spacing : null;
}

export function getPadding(node) {
  const padding = {
    top: node.paddingTop || 0,
    right: node.paddingRight || 0,
    bottom: node.paddingBottom || 0,
    left: node.paddingLeft || 0
  };

  const allZero = Object.values(padding).every(val => val === 0);
  return allZero ? null : padding;
}

export function getLayoutWrap(node) {
  return node?.layoutWrap === 'WRAP' ? 'wrap' : null;
}

export function getOverflow(node) {
  return (node && node.clipsContent) || null;
}