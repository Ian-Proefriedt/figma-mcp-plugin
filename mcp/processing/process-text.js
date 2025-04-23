function processTextUI(node) {
  const styleName = getStyleNameById(node && node.textStyleId, 'text');
  const styleDef = node && node.textStyleId
    ? figma.getLocalTextStyles().find(s => s.id === node.textStyleId)
    : null;

  const font = styleDef
  ? {
      fontSize: styleDef.fontSize,
      fontName: styleDef.fontName.family,
      fontStyle: styleDef.fontName.style,
      fontWeight: interpretFontWeight(styleDef.fontName.style)
      }
    : getFontStyle(node);

  const spacing = styleDef
    ? {
        letterSpacing: styleDef.letterSpacing && styleDef.letterSpacing.value,
        lineHeight: styleDef.lineHeight && styleDef.lineHeight.value,
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