// interpretation/style-interpretation.js

export function rgbToHex(color) {
  if (!color || typeof color.r !== 'number') return null;
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function interpretFill(raw) {
  if (!raw || !raw.color) return null;

  return {
    color: rgbToHex(raw.color),
    type: interpretFillType(raw.type),
    opacity: raw.opacity ?? 1,
    visible: raw.visible ?? true,
    styleId: raw.styleId || null
  };
}

export function interpretImageFill(raw) {
  if (!raw || !raw.imageRef) return null;

  return {
    imageRef: raw.imageRef,
    scaleMode: raw.scaleMode?.toLowerCase() || null,
    opacity: raw.opacity ?? 1,
    visible: raw.visible ?? true,
    styleId: raw.styleId || null
  };
}

export function interpretStroke(raw) {
  if (!raw || !raw.color) return null;

  return {
    color: rgbToHex(raw.color),
    opacity: raw.opacity ?? 1,
    width: raw.weight ?? null,
    align: raw.align || null,
    styleId: raw.styleId || null
  };
}

export function interpretShadow(raw) {
  if (!raw || !raw.color) return null;

  return {
    color: rgbToHex(raw.color),
    offsetX: raw.offset?.x ?? 0,
    offsetY: raw.offset?.y ?? 0,
    blur: raw.radius ?? 0,
    spread: raw.spread ?? 0,
    blendMode: raw.blendMode || null,
    visible: raw.visible ?? true
  };
}

export function interpretBlendMode(value) {
  if (!value || value === 'NORMAL' || value === 'PASS_THROUGH') return null;

  const map = {
    MULTIPLY: 'multiply',
    SCREEN: 'screen',
    OVERLAY: 'overlay',
    DARKEN: 'darken',
    LIGHTEN: 'lighten',
    COLOR_DODGE: 'color-dodge',
    COLOR_BURN: 'color-burn',
    HARD_LIGHT: 'hard-light',
    SOFT_LIGHT: 'soft-light',
    DIFFERENCE: 'difference',
    EXCLUSION: 'exclusion',
    HUE: 'hue',
    SATURATION: 'saturation',
    COLOR: 'color',
    LUMINOSITY: 'luminosity'
  };

  return map[value] || value.toLowerCase().replaceAll('_', '-');
}

export function interpretFillType(type) {
  switch (type) {
    case 'SOLID': return 'solid';
    case 'LINEAR_GRADIENT': return 'linear-gradient';
    case 'RADIAL_GRADIENT': return 'radial-gradient';
    case 'ANGULAR_GRADIENT': return 'conic-gradient';
    default: return type?.toLowerCase() || 'unknown';
  }
}
