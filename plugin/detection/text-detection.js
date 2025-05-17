export function getTextContent(node) {
  return (node && node.characters) || '';
}

export function getRawFontStyle(node) {
  return {
    fontSize: typeof node?.fontSize === 'number' ? node.fontSize : null,
    fontName: node?.fontName?.family || null,
    fontStyle: node?.fontName?.style || null
  };
}

export function getTextAlignment(node) {
  const hAlign = node?.textAlignHorizontal?.toLowerCase();
  const vAlign = node?.textAlignVertical?.toLowerCase();

  return {
    horizontal: hAlign !== 'left' ? hAlign : null,
    vertical: vAlign !== 'top' ? vAlign : null
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
    textCase: rawCase && rawCase !== 'ORIGINAL' ? rawCase.toLowerCase() : null,
    textDecoration: rawDecoration && rawDecoration !== 'NONE' ? rawDecoration.toLowerCase() : null
  };
}

export function getTextStyleId(node) {
  return node?.textStyleId || null;
}