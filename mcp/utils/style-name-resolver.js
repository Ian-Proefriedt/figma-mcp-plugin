function getStyleNameById(styleId, styleType) {
  let styles = [];
  switch (styleType) {
    case 'text':
      styles = figma.getLocalTextStyles();
      break;
    case 'fill':
    case 'stroke':
      styles = figma.getLocalPaintStyles();
      break;
    case 'effect':
      styles = figma.getLocalEffectStyles();
      break;
  }
  const style = styles.find(s => s.id === styleId);
  return style ? style.name : null;
}