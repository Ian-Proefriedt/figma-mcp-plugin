// refactored_textUtils.js
// Refactored text property detection and interpretation (CSS-ready)

export function getTextContent(node) {
  return node?.characters ?? 'undefined';
}

export function getFontStyle(node) {
  const fontName = node?.fontName;

  return {
    fontSize: node?.fontSize ?? 'undefined',
    fontName: typeof fontName === 'object' && fontName.family ? fontName.family : 'undefined',
    fontStyle: typeof fontName === 'object' && fontName.style ? fontName.style : 'undefined'
  };
}

export function getTextAlignment(node) {
  const horizontal = node?.textAlignHorizontal;
  const vertical = node?.textAlignVertical;

  return {
    horizontal: horizontal ? mapTextAlign(horizontal) : 'undefined',
    vertical: vertical ? vertical.toLowerCase() : 'undefined'
  };
}

export function getTextSpacing(node) {
  return {
    letterSpacing: node?.letterSpacing ? formatSpacing(node.letterSpacing) : 'undefined',
    lineHeight: node?.lineHeight ? formatLineHeight(node.lineHeight) : 'undefined',
    paragraphSpacing: node?.paragraphSpacing ?? 'undefined'
  };
}

export function getTextCaseAndDecoration(node) {
  return {
    textCase: node?.textCase ? mapTextCase(node.textCase) : 'undefined',
    textDecoration: node?.textDecoration ? mapTextDecoration(node.textDecoration) : 'undefined'
  };
}

export function getTextResizing(node) {
  return node?.textAutoResize?.toLowerCase() ?? 'undefined';
}

export function getTextTruncation(node) {
  return {
    type: node?.textTruncation?.toLowerCase() ?? 'undefined',
    maxLines: node?.maxLines ?? 'undefined'
  };
}

export function getTextStyleId(node) {
  return node?.textStyleId ?? 'undefined';
}

function mapTextAlign(value) {
  switch (value) {
    case 'LEFT': return 'left';
    case 'CENTER': return 'center';
    case 'RIGHT': return 'right';
    case 'JUSTIFIED': return 'justify';
    default: return 'undefined';
  }
}

function mapTextCase(value) {
  switch (value) {
    case 'UPPER': return 'uppercase';
    case 'LOWER': return 'lowercase';
    case 'TITLE': return 'capitalize';
    case 'ORIGINAL':
    default: return 'undefined';
  }
}

function mapTextDecoration(value) {
  switch (value) {
    case 'UNDERLINE': return 'underline';
    case 'STRIKETHROUGH': return 'line-through';
    case 'NONE':
    default: return 'undefined';
  }
}

function formatSpacing(spacing) {
  if (!spacing || spacing.value === undefined) return 'undefined';
  return spacing.unit === 'PERCENT' ? `${spacing.value}%` : spacing.value;
}

function formatLineHeight(lineHeight) {
  if (!lineHeight || lineHeight.value === undefined) return 'undefined';
  return lineHeight.value;
}
