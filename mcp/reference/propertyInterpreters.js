/**
 * Utility functions to interpret Figma property values into standard CSS/React values
 */

/**
 * Determines the layout type based on Figma node properties
 * @param {Object} node - The Figma node
 * @returns {string} - The interpreted layout type
 */
function interpretLayoutType(node) {
  // If it's a frame with auto layout, it's a flex container
  if (node.type === "FRAME" && node.layoutMode) {
    return "Flex";
  }
  // If it's a frame without auto layout, it's a block container
  if (node.type === "FRAME") {
    return "Block";
  }
  // If it's a group, it's a flex container by default
  if (node.type === "GROUP") {
    return "Flex";
  }
  // Default to None for other types
  return "None";
}

/**
 * Interprets Figma's layout mode into CSS flex direction
 * @param {string} layoutMode - Figma's layout mode
 * @returns {string} - CSS flex direction
 */
function interpretDirection(layoutMode) {
  switch (layoutMode) {
    case "VERTICAL":
      return "column";
    case "HORIZONTAL":
      return "row";
    default:
      return "row"; // Default to row for non-auto-layout
  }
}

/**
 * Interprets Figma's counter axis alignment into CSS align-items
 * @param {string} counterAxisAlignItems - Figma's counter axis alignment
 * @returns {string} - CSS align-items value
 */
function interpretAlignItems(counterAxisAlignItems) {
  switch (counterAxisAlignItems) {
    case "MIN":
      return "flex-start";
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "SPACE_BETWEEN":
      return "space-between";
    default:
      return "flex-start";
  }
}

/**
 * Interprets Figma's primary axis alignment into CSS justify-content
 * @param {string} primaryAxisAlignItems - Figma's primary axis alignment
 * @returns {string} - CSS justify-content value
 */
function interpretJustifyContent(primaryAxisAlignItems) {
  switch (primaryAxisAlignItems) {
    case "MIN":
      return "flex-start";
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "SPACE_BETWEEN":
      return "space-between";
    case "SPACE_AROUND":
      return "space-around";
    default:
      return "flex-start";
  }
}

/**
 * Interprets Figma's padding values into CSS padding
 * @param {Object} padding - Figma's padding object
 * @returns {Object} - CSS padding values
 */
function interpretPadding(padding) {
  return {
    top: padding?.top || 0,
    right: padding?.right || 0,
    bottom: padding?.bottom || 0,
    left: padding?.left || 0
  };
}

/**
 * Interprets Figma's spacing values into CSS gap
 * @param {number} itemSpacing - Figma's item spacing
 * @returns {number} - CSS gap value
 */
function interpretGap(itemSpacing) {
  return itemSpacing || 0;
}

/**
 * Main function to interpret all layout properties
 * @param {Object} node - The Figma node
 * @returns {Object} - Interpreted layout properties
 */
export function interpretLayoutProperties(node) {
  if (!node) return null;

  const layout = node.layout || {};
  const autoLayout = layout.autoLayout || {};

  return {
    type: interpretLayoutType(node),
    direction: interpretDirection(autoLayout.mode),
    alignItems: interpretAlignItems(autoLayout.counterAxis?.alignItems),
    justifyContent: interpretJustifyContent(autoLayout.primaryAxis?.alignItems),
    gap: interpretGap(autoLayout.spacing?.items),
    padding: interpretPadding(autoLayout.padding)
  };
} 