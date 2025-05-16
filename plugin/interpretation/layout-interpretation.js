export function interpretAlignment(value) {
    switch (value) {
      case 'MIN': return 'flex-start';
      case 'MAX': return 'flex-end';
      case 'CENTER': return 'center';
      case 'SPACE_BETWEEN': return 'space-between';
      case 'SPACE_AROUND': return 'space-around';
      default: return (value && value.toLowerCase().replaceAll('_', '-')) || 'undefined';
    }
  }

  export function interpretSizeValues(node, layoutDirection, rawSizeData) {
    const isRow = layoutDirection === 'row';
    const parent = node.parent;
  
    const widthMode = isRow ? rawSizeData.primary : rawSizeData.counter;
    const heightMode = isRow ? rawSizeData.counter : rawSizeData.primary;
  
    const width = interpretAxisSize(widthMode, rawSizeData.grow, rawSizeData.width, parent?.width);
    const height = interpretAxisSize(heightMode, rawSizeData.grow, rawSizeData.height, parent?.height);
  
    return { width, height };
  }
  
  function interpretAxisSize(mode, grow, px, parentPx) {
    if (mode === 'auto' && grow === 1) return 'flex: 1';       // Fill container (explicit)
    if (mode === 'auto') return 'fit-content';                 // Hug contents
  
    // Inferred 100% when fixed size matches parent size
    if (
      mode === 'fixed' &&
      typeof px === 'number' &&
      typeof parentPx === 'number' &&
      Math.round(px) === Math.round(parentPx)
    ) {
      return '100%';
    }
  
    // Default fixed size
    return `${Math.round(px)}px`;
  }  