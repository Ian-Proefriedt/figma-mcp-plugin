// detection/text-detection.js

export function getTextContent(node) {
  return (node && node.characters) || '';
}

export function getRawFontStyle(node) {
  return {
    fontSize: node?.fontSize || null,
    fontName: node?.fontName?.family || null,
    fontStyle: node?.fontName?.style || null
  };
}

export function getTextAlignment(node) {
  return {
    horizontal: node?.textAlignHorizontal?.toLowerCase() || 'left',
    vertical: node?.textAlignVertical?.toLowerCase() || 'top'
  };
}

export function getTextSpacing(node) {
  return {
    letterSpacing: node?.letterSpacing?.value || null,
    lineHeight: node?.lineHeight?.value || null,
    paragraphSpacing: node?.paragraphSpacing || null
  };
}

export function getTextCaseAndDecoration(node) {
  const rawCase = node?.textCase;
  const rawDecoration = node?.textDecoration;

  return {
    textCase: typeof rawCase === 'string' ? rawCase.toLowerCase() : null,
    textDecoration: typeof rawDecoration === 'string' ? rawDecoration.toLowerCase() : null
  };
}

export function getTextStyleId(node) {
  return node?.textStyleId || null;
}
