import {
  isAutoLayout,
  getLayoutDirection,
  getLayoutWrap,
  getRawSizeData,
  getRawLayoutAlignment,
  getItemSpacing,
  getPadding,
  getOverflow
} from '../detection/layout-detection.js';

import { interpretAlignment, interpretSizeAndLayoutBehavior, interpretOverflow } from '../interpretation/layout-interpretation.js';

export function processLayoutUI(node) {

  const direction = getLayoutDirection(node);
  const rawAlignment = getRawLayoutAlignment(node);
  const sizeData = getRawSizeData(node);
  const interpretedSizeAndLayoutBehavior = interpretSizeAndLayoutBehavior(sizeData);
  const overflowRaw = getOverflow(node);
  const overflow = interpretOverflow(overflowRaw);

  return {
    display: isAutoLayout(node) ? 'flex' : 'block',
    direction,
    flexWrap: getLayoutWrap(node),
    ...interpretedSizeAndLayoutBehavior,
    justifyContent: interpretAlignment(rawAlignment.primaryAxis),
    alignItems: interpretAlignment(rawAlignment.counterAxis),
    gap: getItemSpacing(node),
    padding: getPadding(node),
    overflow,
  };
}

