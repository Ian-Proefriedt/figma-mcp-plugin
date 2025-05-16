// processing/text-processing.js

import {
  getTextContent,
  getRawFontStyle,
  getTextAlignment,
  getTextSpacing,
  getTextCaseAndDecoration
} from '../detection/text-detection.js';

import { interpretFontWeight } from '../interpretation/text-interpretation.js';
import { getStyleNameById } from '../utils/style-name-resolver.js';

export function processTextUI(node) {
  if (!node || node.type !== 'TEXT') return null;

  const styleName = getStyleNameById(node?.textStyleId, 'text');

  const styleDef = node?.textStyleId
    ? figma.getLocalTextStyles().find(s => s.id === node.textStyleId)
    : null;

  const font = styleDef
    ? {
        fontSize: styleDef.fontSize,
        fontName: styleDef.fontName.family,
        fontStyle: styleDef.fontName.style,
        fontWeight: interpretFontWeight(styleDef.fontName.style)
      }
    : (() => {
        const raw = getRawFontStyle(node);
        return {
          fontSize: raw.fontSize,
          fontName: raw.fontName,
          fontStyle: raw.fontStyle,
          fontWeight: interpretFontWeight(raw.fontStyle)
        };
      })();

  const spacing = styleDef
    ? {
        letterSpacing: styleDef.letterSpacing?.value,
        lineHeight: styleDef.lineHeight?.value,
        paragraphSpacing: styleDef.paragraphSpacing || null
      }
    : getTextSpacing(node);

  const caseDecor = getTextCaseAndDecoration(node);

  return {
    textStyleName: styleName || null,
    textContent: getTextContent(node),
    fontSize: font.fontSize,
    fontName: font.fontName,
    fontStyle: font.fontStyle,
    fontWeight: font.fontWeight,
    alignment: getTextAlignment(node),
    letterSpacing: spacing.letterSpacing,
    lineHeight: spacing.lineHeight,
    paragraphSpacing: spacing.paragraphSpacing,
    textCase: caseDecor.textCase,
    textDecoration: caseDecor.textDecoration
  };
}
