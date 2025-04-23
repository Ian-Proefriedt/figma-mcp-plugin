import {
  isAutoLayout,
  getLayoutDirection,
  getLayoutAlignment,
  getItemSpacing,
  getPadding,
  getLayoutWrap
} from '../detection/layout-detection.js';

export function processLayoutUI(node) {
  if (node.type === 'TEXT') return null;
  const alignment = getLayoutAlignment(node);
  return {
    type: isAutoLayout(node) ? 'Flex' : 'Block',
    direction: getLayoutDirection(node),
    justifyContent: alignment.justifyContent,
    alignItems: alignment.alignItems,
    gap: getItemSpacing(node),
    padding: getPadding(node),
    wrap: getLayoutWrap(node)
  };
}
