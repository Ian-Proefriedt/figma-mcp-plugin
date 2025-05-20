import {
  isAutoLayout,
  getLayoutDirection,
  getRawSizeData,
  getRawLayoutAlignment,
  getItemSpacing,
  getPadding,
  getLayoutWrap,
  getOverflow
} from '../detection/layout-detection.js';

import { interpretAlignment, interpretSizeValues, interpretOverflow } from '../interpretation/layout-interpretation.js';

export function processLayoutUI(node) {

  const direction = getLayoutDirection(node);
  const rawAlignment = getRawLayoutAlignment(node);
  const sizeData = getRawSizeData(node);
  const interpretedSize = interpretSizeValues(sizeData);
  const overflowRaw = getOverflow(node);
  const overflow = interpretOverflow(overflowRaw);

  return {
    display: isAutoLayout(node) ? 'flex' : 'block',
    direction,
    width: interpretedSize.width,
    height: interpretedSize.height,
    justifyContent: interpretAlignment(rawAlignment.primaryAxis),
    alignItems: interpretAlignment(rawAlignment.counterAxis),
    gap: getItemSpacing(node),
    padding: getPadding(node),
    wrap: getLayoutWrap(node),
    overflow
  };
}
