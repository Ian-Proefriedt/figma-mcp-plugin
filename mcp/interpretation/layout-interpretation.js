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