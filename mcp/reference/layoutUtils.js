/**
 * Layout Detection Utilities
 * 
 * This module provides functions for detecting and analyzing layout properties
 * of Figma nodes. It serves as the source of truth for layout detection.
 */

/**
 * Determines if a node is ignoring its parent's auto layout
 * @param {SceneNode} node - The node to check
 * @returns {boolean} - True if the node is ignoring auto layout
 */
function isIgnoringAutoLayout(node) {
  if (!node || !node.parent) return false;
  
    const parent = node.parent;
  const parentHasAutoLayout = parent && "layoutMode" in parent ? 
    (parent.layoutMode === "HORIZONTAL" || parent.layoutMode === "VERTICAL") : 
    false;
  
  const isAbsolutePositioned = node.layoutPositioning === "ABSOLUTE";
  
  return parentHasAutoLayout && isAbsolutePositioned;
}

/**
 * Gets the layout type of a node
 * @param {SceneNode} node - The node to check
 * @returns {string} - The layout type (AUTO, ABSOLUTE, or NONE)
 */
function getLayoutType(node) {
  if (!node) return "NONE";
  
  // Check if node itself has auto layout
  if (node.layoutMode && node.layoutMode !== "NONE") {
    return "AUTO";
  }
  
  // Check if node is ignoring parent's auto layout
  if (isIgnoringAutoLayout(node)) {
    return "ABSOLUTE";
  }
  
  return "NONE";
}

/**
 * Extracts all relevant layout properties from a node
 * @param {SceneNode} node - The node to extract properties from
 * @returns {Object} - The extracted properties
 */
function extractLayoutProperties(node) {
  if (!node) return null;

  // Basic properties
  const properties = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    opacity: node.opacity,
    blendMode: node.blendMode,
    rotation: node.rotation,
    relativeTransform: node.relativeTransform,
    absoluteTransform: node.absoluteTransform,
    absoluteBoundingBox: node.absoluteBoundingBox,
    absoluteRenderBounds: node.absoluteRenderBounds,
    clipsContent: node.clipsContent,
    isMask: node.isMask,
    effects: node.effects,
    effectStyleId: node.effectStyleId,
    backgroundStyleId: node.backgroundStyleId,
    fillStyleId: node.fillStyleId,
    strokeStyleId: node.strokeStyleId,
    gridStyleId: node.gridStyleId,
    cornerRadius: node.cornerRadius,
    cornerSmoothing: node.cornerSmoothing,
    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign,
    strokeCap: node.strokeCap,
    strokeJoin: node.strokeJoin,
    strokeMiterLimit: node.strokeMiterLimit,
    dashPattern: node.dashPattern,
    dashOffset: node.dashOffset,
    strokeGeometry: node.strokeGeometry,
    strokeTopWeight: node.strokeTopWeight,
    strokeRightWeight: node.strokeRightWeight,
    strokeBottomWeight: node.strokeBottomWeight,
    strokeLeftWeight: node.strokeLeftWeight
  };

  // Layout participation
  properties.layoutType = getLayoutType(node);
  properties.isIgnoringAutoLayout = isIgnoringAutoLayout(node);
  properties.layoutPositioning = node.layoutPositioning;
  properties.constraints = node.constraints;
  properties.layoutAlign = node.layoutAlign;
  properties.layoutGrow = node.layoutGrow;
  properties.layoutSizingHorizontal = node.layoutSizingHorizontal;
  properties.layoutSizingVertical = node.layoutSizingVertical;
  properties.layoutGrids = node.layoutGrids;
  properties.layoutGridStyleId = node.layoutGridStyleId;

  // Auto layout container properties
  if (node.layoutMode) {
    properties.layoutMode = node.layoutMode;
    properties.primaryAxisAlignItems = node.primaryAxisAlignItems;
    properties.counterAxisAlignItems = node.counterAxisAlignItems;
    properties.primaryAxisSizingMode = node.primaryAxisSizingMode;
    properties.counterAxisSizingMode = node.counterAxisSizingMode;
    properties.itemSpacing = node.itemSpacing;
    properties.paddingTop = node.paddingTop;
    properties.paddingRight = node.paddingRight;
    properties.paddingBottom = node.paddingBottom;
    properties.paddingLeft = node.paddingLeft;
    properties.layoutWrap = node.layoutWrap;
    properties.counterAxisSpacing = node.counterAxisSpacing;
    properties.counterAxisAlignContent = node.counterAxisAlignContent;
  }

  // Parent info
  if (node.parent) {
    properties.parent = {
      id: node.parent.id,
      name: node.parent.name,
      type: node.parent.type,
      layoutMode: node.parent.layoutMode,
      layoutAlign: node.parent.layoutAlign,
      layoutGrow: node.parent.layoutGrow,
      layoutSizingHorizontal: node.parent.layoutSizingHorizontal,
      layoutSizingVertical: node.parent.layoutSizingVertical
    };
  }

  return properties;
}

/**
 * Logs layout-related fields for debugging
 * @param {SceneNode} node - The node to log properties for
 */
function logLayoutProperties(node) {
  if (!node) return;

  console.log("=== Layout Properties ===");
  console.log(`Node: ${node.name} (${node.type})`);
  console.log(`Layout Type: ${getLayoutType(node)}`);
  console.log(`Is Ignoring Auto Layout: ${isIgnoringAutoLayout(node)}`);
  
  if (node.parent) {
    console.log("Parent Info:", {
      name: node.parent.name,
      type: node.parent.type,
      layoutMode: node.parent.layoutMode,
      layoutAlign: node.parent.layoutAlign,
      layoutGrow: node.parent.layoutGrow
    });
  }
  
  if (node.layoutPositioning) {
    console.log(`Layout Positioning: ${node.layoutPositioning}`);
  }
  
  if (node.constraints) {
    console.log("Constraints:", node.constraints);
  }
  
  if (node.layoutMode) {
    console.log("Auto Layout Properties:", {
      layoutMode: node.layoutMode,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      counterAxisAlignItems: node.counterAxisAlignItems,
      itemSpacing: node.itemSpacing,
      padding: {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      },
      layoutWrap: node.layoutWrap,
      counterAxisSpacing: node.counterAxisSpacing,
      counterAxisAlignContent: node.counterAxisAlignContent
    });
  }
}

module.exports = {
    isIgnoringAutoLayout,
    getLayoutType,
  extractLayoutProperties,
  logLayoutProperties
  };