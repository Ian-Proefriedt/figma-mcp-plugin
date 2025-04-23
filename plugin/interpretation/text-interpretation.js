export function interpretFontWeight(style) {
    if (!style || typeof style !== 'string') return null;
    const normalized = style.trim().toLowerCase();
  
    switch (normalized) {
      case 'thin':
      case 'hairline': return 100;
      case 'extra light':
      case 'ultralight': return 200;
      case 'light': return 300;
      case 'regular':
      case 'normal': return 400;
      case 'medium': return 500;
      case 'semibold':
      case 'demibold': return 600;
      case 'bold': return 700;
      case 'extra bold':
      case 'ultrabold': return 800;
      case 'black':
      case 'heavy': return 900;
      default: return null;
    }
  }