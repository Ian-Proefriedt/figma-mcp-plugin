// detection/layout-detection.js

export function getRawLayoutAlignment(node) {
  return {
    primaryAxis: node?.primaryAxisAlignItems || null,
    counterAxis: node?.counterAxisAlignItems || null
  };
}

export function getLayoutDirection(node) {
  return node?.layoutMode === 'VERTICAL' ? 'column' : 'row';
}

export function isAutoLayout(node) {
  return node?.layoutMode === 'VERTICAL' || node?.layoutMode === 'HORIZONTAL';
}

export function getItemSpacing(node) {
  return node?.itemSpacing || 0;
}

export function getPadding(node) {
  const padding = {
    top: node.paddingTop || 0,
    right: node.paddingRight || 0,
    bottom: node.paddingBottom || 0,
    left: node.paddingLeft || 0
  };

  const allZero = Object.values(padding).every(val => val === 0);
  return allZero ? "none" : padding;
}

export function getLayoutWrap(node) {
  return node?.layoutWrap === 'WRAP' ? 'wrap' : 'nowrap';
}
