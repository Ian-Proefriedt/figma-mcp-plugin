import {
  rgbToHex,
  interpretFillType,
  interpretBlendMode
} from '../interpretation/style-interpretation.js';

export function isImageNode(node) {
  return node && node.type === 'RECTANGLE' && node.fills && node.fills.some(f => f.type === 'IMAGE');
}

export function getFillAndImage(node) {
  const fills = (node && node.fills) || [];
  let image = null;
  let fill = null;
  for (const f of fills) {
    if (!image && f.type === 'IMAGE') {
      image = {
        type: 'image',
        imageRef: f.imageHash || null,
        scaleMode: typeof f.scaleMode === 'string' ? f.scaleMode.toLowerCase() : 'undefined',
        styleId: (node && node.fillStyleId) || null
      };
    } else if (!fill && (f.type === 'SOLID' || (f && f.type && f.type.endsWith('_GRADIENT')))) {
      fill = {
        type: interpretFillType(f.type),
        color: f.color ? rgbToHex(f.color) : null,
        opacity: f.opacity || 1,
        styleId: (node && node.fillStyleId) || null
      };
    }
  }
  return { fill, image };
}

export function getStroke(node) {
  const stroke = (node && node.strokes && node.strokes[0]) || null;
  return {
    color: (stroke && stroke.color) || null,
    opacity: (stroke && stroke.opacity) || 1,
    weight: (node && node.strokeWeight) || 1,
    styleId: (node && node.strokeStyleId) || null
  };
}

export function getCornerRadius(node) {
  return (node && node.cornerRadius) || 0;
}

export function getBlendMode(node) {
  return interpretBlendMode(node && node.blendMode);
}

export function getShadowPresence(node) {
  const effects = (node && node.effects) || [];
  return effects.some(effect => effect.type === 'DROP_SHADOW');
}
