export function rgbToHex(color) {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  
  export function interpretFillType(type) {
    switch (type) {
      case 'SOLID': return 'solid';
      case 'LINEAR_GRADIENT': return 'linear-gradient';
      case 'RADIAL_GRADIENT': return 'radial-gradient';
      case 'ANGULAR_GRADIENT': return 'conic-gradient';
      default: return (type && type.toLowerCase()) || 'unknown';
    }
  }
  
  export function interpretBlendMode(value) {
    if (!value || value === 'NORMAL' || value === 'PASS_THROUGH') return null;
  
    switch (value) {
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
      default: return value.toLowerCase().replaceAll('_', '-');
    }
  }