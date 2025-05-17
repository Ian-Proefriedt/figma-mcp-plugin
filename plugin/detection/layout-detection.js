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

export function getRawSizeData(node) {
  console.log(`[🔍 RAW LAYOUT] ${node.name}`, {
    type: node.type,
    layoutMode: node.layoutMode,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    layoutGrow: node.layoutGrow,
    layoutAlign: node.layoutAlign,
    width: node.width,
    height: node.height,
    parentWidth: node.parent?.width,
    parentHeight: node.parent?.height,
    parentLayoutMode: node.parent?.layoutMode
  });
    
  return {
    width: node?.width || 0,
    height: node?.height || 0,
    primary: node.primaryAxisSizingMode?.toLowerCase() || 'fixed',
    counter: node.counterAxisSizingMode?.toLowerCase() || 'fixed',
    grow: node.layoutGrow || 0
  };
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
