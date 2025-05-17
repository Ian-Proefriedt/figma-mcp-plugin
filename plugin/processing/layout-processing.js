import {
  isAutoLayout,
  getLayoutDirection,
  getRawSizeData,
  getRawLayoutAlignment,
  getItemSpacing,
  getPadding,
  getLayoutWrap
} from '../detection/layout-detection.js';

import { interpretAlignment, interpretSizeValues } from '../interpretation/layout-interpretation.js';

export function processLayoutUI(node) {

  const direction = getLayoutDirection(node);
  const rawAlignment = getRawLayoutAlignment(node);
  const sizeData = getRawSizeData(node);
  const interpretedSize = interpretSizeValues(node, direction, sizeData);

  return {
    type: isAutoLayout(node) ? 'Flex' : 'Block',
    direction,
    width: interpretedSize.width,
    height: interpretedSize.height,
    justifyContent: interpretAlignment(rawAlignment.primaryAxis),
    alignItems: interpretAlignment(rawAlignment.counterAxis),
    gap: getItemSpacing(node),
    padding: getPadding(node),
    wrap: getLayoutWrap(node),
  };
}
