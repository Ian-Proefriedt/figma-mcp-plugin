import { interpretAlignment } from '../interpretation/layout-interpretation.js';

export function getLayoutDirection(node) {
  return node && node.layoutMode === 'VERTICAL' ? 'column' : 'row';
}

export function isAutoLayout(node) {
  return (node && (node.layoutMode === 'VERTICAL' || node.layoutMode === 'HORIZONTAL'));
}

export function getLayoutAlignment(node) {
  return {
    justifyContent: interpretAlignment(node && node.primaryAxisAlignItems),
    alignItems: interpretAlignment(node && node.counterAxisAlignItems)
  };
}

export function getItemSpacing(node) {
  return (node && node.itemSpacing) || 0;
}

export function getPadding(node) {
  return {
    top: (node && node.paddingTop) || 0,
    right: (node && node.paddingRight) || 0,
    bottom: (node && node.paddingBottom) || 0,
    left: (node && node.paddingLeft) || 0
  };
}

export function getLayoutWrap(node) {
  const val = node && node.layoutWrap;
  return val === 'WRAP' ? 'wrap' : 'nowrap';
}
