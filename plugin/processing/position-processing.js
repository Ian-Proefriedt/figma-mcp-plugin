// processing/position-processing.js

import {
  getPosition,
  getSize,
  getSizingModes,
  getRotation,
  getRawConstraints,
  getPositioning,
  getClipping,
  getZIndex
} from '../detection/position-detection.js';

import { interpretConstraint } from '../interpretation/position-interpretation.js';

export function processPositionUI(node) {
  const pos = getPosition(node);
  const size = getSize(node);
  const sizing = getSizingModes(node);
  const rawConstraints = getRawConstraints(node);

  return {
    x: pos.x,
    y: pos.y,
    width: size.width,
    widthMode: sizing.widthMode,
    height: size.height,
    heightMode: sizing.heightMode,
    rotation: getRotation(node),
    constraints: {
      horizontal: interpretConstraint(rawConstraints.horizontal, 'horizontal'),
      vertical: interpretConstraint(rawConstraints.vertical, 'vertical')
    },
    positioning: getPositioning(node),
    clipping: getClipping(node),
    zIndex: getZIndex(node)
  };
}
