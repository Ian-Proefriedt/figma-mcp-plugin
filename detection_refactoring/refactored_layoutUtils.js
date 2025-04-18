// refactored_layoutUtils.js
// Refactored layout property detection for MCP Plugin (Cursor-compatible, export-ready)

/**
 * Determines whether a node uses Auto Layout
 */
export function isAutoLayout(node) {
  return node?.layoutMode === 'HORIZONTAL' || node?.layoutMode === 'VERTICAL';
}

/**
 * Extracts layout direction (flex-direction)
 */
export function getLayoutDirection(node) {
  return node?.layoutMode === 'VERTICAL' ? 'column' : 'row';
}

/**
 * Extracts primary and cross axis alignment (for justify-content and align-items)
 */
export function getLayoutAlignment(node) {
  const primary = node?.primaryAxisAlignItems || 'MIN';
  const cross = node?.counterAxisAlignItems || 'MIN';

  return {
    justifyContent: mapAlignmentValue(primary),
    alignItems: mapAlignmentValue(cross),
  };
}

/**
 * Maps Figma alignment keywords to CSS terms
 */
function mapAlignmentValue(value) {
  switch (value) {
    case 'MIN': return 'flex-start';
    case 'MAX': return 'flex-end';
    case 'CENTER': return 'center';
    case 'SPACE_BETWEEN': return 'space-between';
    case 'SPACE_AROUND': return 'space-around';
    default: return 'flex-start';
  }
}

/**
 * Extracts padding values for each edge
 */
export function getPadding(node) {
  return {
    top: node?.paddingTop ?? 0,
    right: node?.paddingRight ?? 0,
    bottom: node?.paddingBottom ?? 0,
    left: node?.paddingLeft ?? 0,
  };
}

/**
 * Extracts spacing between items (gap)
 */
export function getItemSpacing(node) {
  return node?.itemSpacing ?? 0;
}

/**
 * Detects wrap behavior in auto layout (flex-wrap)
 */
export function getLayoutWrap(node) {
  return node?.layoutWrap === 'WRAP';
}

/**
 * Detects sizing behavior of a container (hug, fill, fixed)
 */
export function getSizingModes(node) {
  return {
    widthMode: node?.primaryAxisSizingMode?.toLowerCase() ?? 'undefined',
    heightMode: node?.counterAxisSizingMode?.toLowerCase() ?? 'undefined',
  };
}

/**
 * Detects layout positioning (CSS position)
 */
export function getLayoutPositioning(node) {
  return node?.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'undefined';
}
