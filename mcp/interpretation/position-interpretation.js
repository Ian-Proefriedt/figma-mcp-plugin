export function interpretConstraint(value, axis) {
  if (axis === 'horizontal') {
    switch (value) {
      case 'MIN': return 'left';
      case 'MAX': return 'right';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  } else if (axis === 'vertical') {
    switch (value) {
      case 'MIN': return 'top';
      case 'MAX': return 'bottom';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  }
  return 'undefined';
}