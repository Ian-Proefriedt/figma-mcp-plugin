import { interpretFontWeight } from '../interpretation/text-interpretation.js';

export function getTextContent(node) {
  return (node && node.characters) || '';
}

export function getFontStyle(node) {
  return {
    fontSize: (node && node.fontSize) || null,
    fontName: (node && node.fontName && node.fontName.family) || null,
    fontStyle: (node && node.fontName && node.fontName.style) || null,
    fontWeight: interpretFontWeight((node && node.fontName && node.fontName.style) || null)
  };
}

export function getTextAlignment(node) {
  return {
    horizontal: (node && node.textAlignHorizontal && node.textAlignHorizontal.toLowerCase()) || 'left',
    vertical: (node && node.textAlignVertical && node.textAlignVertical.toLowerCase()) || 'top'
  };
}

export function getTextSpacing(node) {
  return {
    letterSpacing: (node && node.letterSpacing && node.letterSpacing.value) || null,
    lineHeight: (node && node.lineHeight && node.lineHeight.value) || null,
    paragraphSpacing: (node && node.paragraphSpacing) || null
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
  return (node && node.textStyleId) || null;
}
