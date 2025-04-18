// refactored_styleUtils.js
// Refactored detection and interpretation of visual styling properties (including images and gradients)

export function getFillAndImage(node) {
  const fills = node?.fills ?? [];
  let image = null;
  let fill = null;

  for (const f of fills) {
    if (!image && f.type === 'IMAGE') {
      image = {
        type: 'image',
        imageRef: f.imageRef ?? null,
        scaleMode: f.scaleMode?.toLowerCase() ?? 'undefined',
        styleId: node?.fillStyleId ?? null
      };
    } else if (!fill && (f.type === 'SOLID' || f.type?.endsWith('_GRADIENT'))) {
      fill = {
        type: interpretFillType(f.type),
        color: f.color ? rgbToHex(f.color) : null,
        opacity: f.opacity ?? 1,
        styleId: node?.fillStyleId ?? null
      };
    }
  }

  return { fill, image };
}

function interpretFillType(type) {
  switch (type) {
    case 'SOLID': return 'solid';
    case 'LINEAR_GRADIENT': return 'linear-gradient';
    case 'RADIAL_GRADIENT': return 'radial-gradient';
    case 'ANGULAR_GRADIENT': return 'conic-gradient';
    default: return type?.toLowerCase() ?? 'unknown';
  }
}

export function getImageScale(node) {
  const fill = node?.fills?.[0];
  return fill?.type === 'IMAGE' ? fill.scaleMode?.toLowerCase() ?? 'undefined' : 'undefined';
}

export function getStroke(node) {
  if (!node?.strokes || node.strokes.length === 0) {
    return {
      type: 'none',
      color: null,
      weight: 0,
      opacity: 1,
      align: node?.strokeAlign?.toLowerCase() ?? 'undefined',
      styleId: node?.strokeStyleId ?? null
    };
  }

  const stroke = node.strokes[0];
  return {
    type: stroke.type?.toLowerCase() || 'unknown',
    color: stroke.color ? rgbToHex(stroke.color) : null,
    weight: node.strokeWeight ?? 1,
    opacity: stroke.opacity ?? 1,
    align: node?.strokeAlign?.toLowerCase() ?? 'center',
    styleId: node?.strokeStyleId ?? null
  };
}

export function getCornerRadius(node) {
  return node?.cornerRadius ?? 0;
}

export function getBlendMode(node) {
  return mapBlendMode(node?.blendMode);
}

export function getShadowPresence(node) {
  return (node?.effects || []).some(effect => effect.type === 'DROP_SHADOW') ? 'custom' : 'none';
}

function mapBlendMode(mode) {
  if (!mode) return 'normal';

  const blendModes = {
    'PASS_THROUGH': 'pass-through',
    'NORMAL': 'normal',
    'DARKEN': 'darken',
    'MULTIPLY': 'multiply',
    'LINEAR_BURN': 'linear-burn',
    'COLOR_BURN': 'color-burn',
    'LIGHTEN': 'lighten',
    'SCREEN': 'screen',
    'LINEAR_DODGE': 'linear-dodge',
    'COLOR_DODGE': 'color-dodge',
    'OVERLAY': 'overlay',
    'SOFT_LIGHT': 'soft-light',
    'HARD_LIGHT': 'hard-light',
    'DIFFERENCE': 'difference',
    'EXCLUSION': 'exclusion',
    'HUE': 'hue',
    'SATURATION': 'saturation',
    'COLOR': 'color',
    'LUMINOSITY': 'luminosity'
  };

  return blendModes[mode] || mode.toLowerCase();
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16).padStart(2, '0');
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
