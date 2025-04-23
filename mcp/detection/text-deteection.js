function getTextContent(node) {
  return (node && node.characters) || '';
}

function interpretFontWeight(style) {
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

function getFontStyle(node) {
  return {
    fontSize: (node && node.fontSize) || null,
    fontName: (node && node.fontName && node.fontName.family) || null,
    fontStyle: (node && node.fontName && node.fontName.style) || null,
    fontWeight: interpretFontWeight((node && node.fontName && node.fontName.style) || null)
  };
}

function getTextAlignment(node) {
  return {
    horizontal: (node && node.textAlignHorizontal && node.textAlignHorizontal.toLowerCase()) || 'left',
    vertical: (node && node.textAlignVertical && node.textAlignVertical.toLowerCase()) || 'top'
  };
}

function getTextSpacing(node) {
  return {
    letterSpacing: (node && node.letterSpacing && node.letterSpacing.value) || null,
    lineHeight: (node && node.lineHeight && node.lineHeight.value) || null,
    paragraphSpacing: (node && node.paragraphSpacing) || null
  };
}

function getTextCaseAndDecoration(node) {
  return {
    textCase: (node && node.textCase && node.textCase.toLowerCase()) || 'original',
    textDecoration: (node && node.textDecoration && node.textDecoration.toLowerCase()) || 'none'
  };
}

function getTextStyleId(node) {
  return (node && node.textStyleId) || null;
}
