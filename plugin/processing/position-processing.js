// processing/position-processing.js

import {
  getPosition,
  getRotation,
  getRawConstraints,
  getPositioning,
  getClipping,
  getZIndex
} from '../detection/position-detection.js';

import { interpretConstraint } from '../interpretation/position-interpretation.js';

export function processPositionUI(node) {
  const pos = getPosition(node);
  const rawConstraints = getRawConstraints(node);

  return {
    x: pos.x,
    y: pos.y,
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
