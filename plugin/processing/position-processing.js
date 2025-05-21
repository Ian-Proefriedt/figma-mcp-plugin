import {
  getPositionType,
  getRawPositionData,
  getRotation,
  getZIndex,
  
} from '../detection/position-detection.js';

import { interpretPositionConstraints } from '../interpretation/position-interpretation.js';

export function processPositionUI(node) {

  const rawPosition = getRawPositionData(node);
  const interpretedPositionConstraints = interpretPositionConstraints(rawPosition);

  return {
    position: getPositionType(node),
    ...interpretedPositionConstraints,
    rotation: getRotation(node),
    zIndex: getZIndex(node)
  };
}
