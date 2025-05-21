import {
  getRawFill,
  getRawImage,
  getRawStroke,
  getCornerRadius,
  getRawBlendMode,
  getRawShadow
} from '../detection/style-detection.js';

import {
  interpretFill,
  interpretImageFill,
  interpretStroke,
  interpretShadow,
  interpretBlendMode
} from '../interpretation/style-interpretation.js';

import { getStyleNameById } from '../utils/style-name-resolver.js';

export function processStyleUI(node) {
  const rawFill = getRawFill(node);
  const rawImage = getRawImage(node);
  const rawStroke = getRawStroke(node);
  const rawShadow = getRawShadow(node);
  const rawBlendMode = getRawBlendMode(node);

  const fill = interpretFill(rawFill);
  const image = interpretImageFill(rawImage);
  const stroke = interpretStroke(rawStroke);
  const shadow = interpretShadow(rawShadow);
  const blendMode = interpretBlendMode(rawBlendMode);

  return {
    fillStyleName: fill?.styleId ? getStyleNameById(fill.styleId, 'fill') : null,
    background: fill?.color || null,
    opacity: fill?.opacity ?? 1,

    image: image || null, // structured image group
    stroke: stroke || null, // structured stroke group

    radius: getCornerRadius(node),
    blendMode: blendMode || null,
    shadow: shadow || null, // structured shadow group

    strokeStyleName: stroke?.styleId ? getStyleNameById(stroke.styleId, 'stroke') : null
  };
}
