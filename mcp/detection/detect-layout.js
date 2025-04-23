function getLayoutDirection(node) {
  return node && node.layoutMode === 'VERTICAL' ? 'column' : 'row';
}

function isAutoLayout(node) {
  return (node && (node.layoutMode === 'VERTICAL' || node.layoutMode === 'HORIZONTAL'));
}

function interpretAlignment(value) {
  switch (value) {
    case 'MIN': return 'flex-start';
    case 'MAX': return 'flex-end';
    case 'CENTER': return 'center';
    case 'SPACE_BETWEEN': return 'space-between';
    case 'SPACE_AROUND': return 'space-around';
    default: return (value && value.toLowerCase().replaceAll('_', '-')) || 'undefined';
  }
}

function getLayoutAlignment(node) {
  return {
justifyContent: interpretAlignment(node && node.primaryAxisAlignItems),
    alignItems: interpretAlignment(node && node.counterAxisAlignItems)
  };
}

function getItemSpacing(node) {
  return (node && node.itemSpacing) || 0;
}

function getPadding(node) {
  return {
    top: (node && node.paddingTop) || 0,
    right: (node && node.paddingRight) || 0,
    bottom: (node && node.paddingBottom) || 0,
    left: (node && node.paddingLeft) || 0
  };
}

function getLayoutWrap(node) {
  const val = node && node.layoutWrap;
  return val === 'WRAP' ? 'wrap' : 'nowrap';
}