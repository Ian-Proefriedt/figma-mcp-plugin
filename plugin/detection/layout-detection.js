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
  const val = node && node.layoutWrap;
  return val === 'WRAP' ? 'wrap' : 'nowrap';
}
