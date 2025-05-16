// processing/style-processing.js

import {
  getRawFillAndImage,
  getRawStroke,
  getCornerRadius,
  getRawBlendMode,
  getShadowPresence
} from '../detection/style-detection.js';

import {
  interpretFillType,
  interpretBlendMode,
  rgbToHex
} from '../interpretation/style-interpretation.js';

import { getStyleNameById } from '../utils/style-name-resolver.js';

export function processStyleUI(node) {
  const { fill: rawFill, image } = getRawFillAndImage(node);
  const stroke = getRawStroke(node);

  const interpretedFill = rawFill
    ? {
        type: interpretFillType(rawFill.rawType),
        color: rawFill.rawColor ? rgbToHex(rawFill.rawColor) : null,
        opacity: rawFill.opacity || 1,
        styleId: rawFill.styleId || null
      }
    : null;

  const fillStyleName = getStyleNameById(interpretedFill?.styleId, 'fill');
  const strokeStyleName = getStyleNameById(stroke?.styleId, 'stroke');

  return {
    fillStyleName: fillStyleName || null,
    fill: interpretedFill?.color || null,
    opacity: interpretedFill?.opacity ?? 1,
    image: image || null,
    imageScaleMode: image?.scaleMode || null,
    stroke: stroke?.rawColor ? rgbToHex(stroke.rawColor) : null,
    strokeWidth: stroke?.weight || null,
    strokeOpacity: stroke?.opacity || null,
    strokeStyleName: strokeStyleName || null,
    radius: getCornerRadius(node),
    blendMode: interpretBlendMode(getRawBlendMode(node)),
    shadow: getShadowPresence(node)
  };
}
