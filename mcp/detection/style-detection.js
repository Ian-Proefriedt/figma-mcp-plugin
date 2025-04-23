function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function interpretFillType(type) {
  switch (type) {
    case 'SOLID': return 'solid';
    case 'LINEAR_GRADIENT': return 'linear-gradient';
    case 'RADIAL_GRADIENT': return 'radial-gradient';
    case 'ANGULAR_GRADIENT': return 'conic-gradient';
    default: return (type && type.toLowerCase()) || 'unknown';
  }
}

function isImageNode(node) {
  return node && node.type === 'RECTANGLE' && node.fills && node.fills.some(f => f.type === 'IMAGE');
}

function getFillAndImage(node) {
  const fills = (node && node.fills) || [];
  let image = null;
  let fill = null;
  for (const f of fills) {
    if (!image && f.type === 'IMAGE') {
      image = {
        type: 'image',
        imageRef: f.imageHash || null,
        scaleMode: (f && f.scaleMode && f.scaleMode.toLowerCase()) || 'undefined',
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

function getStroke(node) {
  const stroke = (node && node.strokes && node.strokes[0]) || null;
  return {
    color: (stroke && stroke.color) || null,
    opacity: (stroke && stroke.opacity) || 1,
    weight: (node && node.strokeWeight) || 1,
    styleId: (node && node.strokeStyleId) || null
  };
}

function getCornerRadius(node) {
  return (node && node.cornerRadius) || 0;
}

function interpretBlendMode(value) {
  switch (value) {
    case 'PASS_THROUGH':
    case 'NORMAL': return 'normal';
    case 'MULTIPLY': return 'multiply';
    case 'SCREEN': return 'screen';
    case 'OVERLAY': return 'overlay';
    case 'DARKEN': return 'darken';
    case 'LIGHTEN': return 'lighten';
    case 'COLOR_DODGE': return 'color-dodge';
    case 'COLOR_BURN': return 'color-burn';
    case 'HARD_LIGHT': return 'hard-light';
    case 'SOFT_LIGHT': return 'soft-light';
    case 'DIFFERENCE': return 'difference';
    case 'EXCLUSION': return 'exclusion';
    case 'HUE': return 'hue';
    case 'SATURATION': return 'saturation';
    case 'COLOR': return 'color';
    case 'LUMINOSITY': return 'luminosity';
    default: return (value && value.toLowerCase().replaceAll('_', '-')) || 'normal';
  }
}

function getBlendMode(node) {
  return interpretBlendMode(node && node.blendMode);
}

function getShadowPresence(node) {
  const effects = (node && node.effects) || [];
  return effects.some(effect => effect.type === 'DROP_SHADOW');
}