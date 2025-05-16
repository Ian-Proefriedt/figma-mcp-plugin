// processing/layout-processing.js

import {
  isAutoLayout,
  getLayoutDirection,
  getRawLayoutAlignment,
  getItemSpacing,
  getPadding,
  getLayoutWrap
} from '../detection/layout-detection.js';

import { interpretAlignment } from '../interpretation/layout-interpretation.js';

export function processLayoutUI(node) {
  if (node.type === 'TEXT') return null;

  const rawAlignment = getRawLayoutAlignment(node);

  return {
    type: isAutoLayout(node) ? 'Flex' : 'Block',
    direction: getLayoutDirection(node),
    justifyContent: interpretAlignment(rawAlignment.primaryAxis),
    alignItems: interpretAlignment(rawAlignment.counterAxis),
    gap: getItemSpacing(node),
    padding: getPadding(node),
    wrap: getLayoutWrap(node)
  };
}
