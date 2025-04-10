/**
 * Layout Detection Utilities
 * 
 * This module provides functions for detecting and analyzing layout properties
 * of Figma nodes. It serves as the source of truth for layout detection.
 */

// Debug flag for controlling logging output
const DEBUG = false;

// Only log in debug mode
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// Only warn in debug mode
function debugWarn(...args) {
  if (DEBUG) {
    console.warn(...args);
  }
}

debugLog("Running figma-mcp-plugin");

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
 * @deprecated Use processNodeProperties instead for a more structured output format. 
 * This function is maintained for backwards compatibility.
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

  // Text properties
  if (node.type === "TEXT") {
    properties.text = {
      characters: node.characters,
      fontSize: node.fontSize,
      fontName: node.fontName,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      textAutoResize: node.textAutoResize,
      textCase: node.textCase,
      textDecoration: node.textDecoration,
      letterSpacing: node.letterSpacing,
      lineHeight: node.lineHeight,
      paragraphIndent: node.paragraphIndent,
      paragraphSpacing: node.paragraphSpacing,
      textStyleId: node.textStyleId,
      hyperlink: node.hyperlink,
      textTruncation: node.textTruncation,
      maxLines: node.maxLines,
      textTransform: node.textTransform,
      textBehavior: node.textBehavior
    };
  }

  // Visual properties
  properties.fills = node.fills;
  properties.strokes = node.strokes;
  properties.effects = node.effects;

  // Component properties
  if (node.type === "COMPONENT" || node.type === "INSTANCE") {
    properties.componentProperties = node.componentProperties;
    properties.variantProperties = node.variantProperties;
    properties.componentPropertyDefinitions = node.componentPropertyDefinitions;
    properties.componentPropertyReferences = node.componentPropertyReferences;
    properties.mainComponent = node.mainComponent ? {
      id: node.mainComponent.id,
      name: node.mainComponent.name
    } : null;
  }

  // Section properties
  if (node.type === "SECTION") {
    properties.section = {
      isExpanded: node.isExpanded,
      isLocked: node.isLocked,
      isSticky: node.isSticky
    };
  }

  // Group properties
  if (node.type === "GROUP") {
    properties.group = {
      isLocked: node.isLocked,
      isMask: node.isMask,
      clipsContent: node.clipsContent
    };
  }

  // Vector properties
  if (node.type === "VECTOR" || node.type === "STAR" || node.type === "LINE" || node.type === "ELLIPSE" || node.type === "POLYGON" || node.type === "RECTANGLE") {
    properties.vector = {
      vectorPaths: node.vectorPaths,
      vectorNetwork: node.vectorNetwork,
      handleMirroring: node.handleMirroring,
      pointCount: node.pointCount,
      pointRadius: node.pointRadius,
      starInnerRadius: node.starInnerRadius,
      starPointCount: node.starPointCount,
      arcData: node.arcData
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

  debugLog("=== Layout Properties ===");
  debugLog(`Node: ${node.name} (${node.type})`);
  debugLog(`Layout Type: ${getLayoutType(node)}`);
  debugLog(`Is Ignoring Auto Layout: ${isIgnoringAutoLayout(node)}`);
  
  if (node.parent) {
    debugLog("Parent Info:", {
      name: node.parent.name,
      type: node.parent.type,
      layoutMode: node.parent.layoutMode,
      layoutAlign: node.parent.layoutAlign,
      layoutGrow: node.parent.layoutGrow
    });
  }
  
  if (node.layoutPositioning) {
    debugLog(`Layout Positioning: ${node.layoutPositioning}`);
  }
  
  if (node.constraints) {
    debugLog("Constraints:", node.constraints);
  }
  
  if (node.layoutMode) {
    debugLog("Auto Layout Properties:", {
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

  // Log additional properties based on node type
  if (node.type === "TEXT") {
    debugLog("Text Properties:", {
      fontSize: node.fontSize,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      lineHeight: node.lineHeight,
      letterSpacing: node.letterSpacing
    });
  }

  if (node.type === "SECTION") {
    debugLog("Section Properties:", {
      isExpanded: node.isExpanded,
      isLocked: node.isLocked,
      isSticky: node.isSticky
    });
  }

  if (node.type === "GROUP") {
    debugLog("Group Properties:", {
      isLocked: node.isLocked,
      isMask: node.isMask,
      clipsContent: node.clipsContent
    });
  }

  if (node.type === "VECTOR" || node.type === "STAR" || node.type === "LINE" || node.type === "ELLIPSE" || node.type === "POLYGON" || node.type === "RECTANGLE") {
    debugLog("Vector Properties:", {
      vectorPaths: node.vectorPaths,
      vectorNetwork: node.vectorNetwork
    });
  }

  if (node.layoutGrids) {
    debugLog("Layout Grids:", node.layoutGrids);
  }
}

// Test function to verify layout detection
function testLayoutDetection() {
  console.log("=== Starting Layout Detection Tests ===");
  
  // Test 1: Basic node with no layout
  const basicNode = {
    id: "test1",
    name: "Basic Node",
    type: "RECTANGLE",
    visible: true,
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    rotation: 0,
    opacity: 1,
    blendMode: "NORMAL",
    isMask: false,
    effects: [],
    effectStyleId: "",
    backgroundStyleId: "",
    fillStyleId: "",
    strokeStyleId: "",
    gridStyleId: "",
    cornerRadius: 0,
    cornerSmoothing: 0,
    strokeWeight: 1,
    strokeAlign: "INSIDE",
    strokeCap: "NONE",
    strokeJoin: "MITER",
    strokeMiterLimit: 4,
    dashPattern: [],
    dashOffset: 0,
    strokeGeometry: [],
    strokeTopWeight: 1,
    strokeRightWeight: 1,
    strokeBottomWeight: 1,
    strokeLeftWeight: 1,
    relativeTransform: [[1, 0, 0], [0, 1, 0]],
    absoluteTransform: [[1, 0, 100], [0, 1, 100]],
    absoluteBoundingBox: { x: 100, y: 100, width: 200, height: 100 },
    absoluteRenderBounds: { x: 100, y: 100, width: 200, height: 100 },
    clipsContent: false,
    layoutPositioning: "AUTO",
    parent: {
      id: "parent1",
      name: "Parent",
      type: "FRAME",
      layoutMode: "NONE"
    }
  };
  
  console.log("\nTest 1: Basic Node");
  const basicProps = extractLayoutProperties(basicNode);
  console.log("Extracted Properties:", basicProps);
  console.log("Layout Type:", getLayoutType(basicNode));
  console.log("Is Ignoring Auto Layout:", isIgnoringAutoLayout(basicNode));
  
  // Test 2: Node in auto layout container
  const autoLayoutNode = {
    id: "test2",
    name: "Auto Layout Node",
    type: "RECTANGLE",
    visible: basicNode.visible,
    x: basicNode.x,
    y: basicNode.y,
    width: basicNode.width,
    height: basicNode.height,
    rotation: basicNode.rotation,
    opacity: basicNode.opacity,
    blendMode: basicNode.blendMode,
    isMask: basicNode.isMask,
    effects: basicNode.effects,
    effectStyleId: basicNode.effectStyleId,
    backgroundStyleId: basicNode.backgroundStyleId,
    fillStyleId: basicNode.fillStyleId,
    strokeStyleId: basicNode.strokeStyleId,
    gridStyleId: basicNode.gridStyleId,
    cornerRadius: basicNode.cornerRadius,
    cornerSmoothing: basicNode.cornerSmoothing,
    strokeWeight: basicNode.strokeWeight,
    strokeAlign: basicNode.strokeAlign,
    strokeCap: basicNode.strokeCap,
    strokeJoin: basicNode.strokeJoin,
    strokeMiterLimit: basicNode.strokeMiterLimit,
    dashPattern: basicNode.dashPattern,
    dashOffset: basicNode.dashOffset,
    strokeGeometry: basicNode.strokeGeometry,
    strokeTopWeight: basicNode.strokeTopWeight,
    strokeRightWeight: basicNode.strokeRightWeight,
    strokeBottomWeight: basicNode.strokeBottomWeight,
    strokeLeftWeight: basicNode.strokeLeftWeight,
    relativeTransform: basicNode.relativeTransform,
    absoluteTransform: basicNode.absoluteTransform,
    absoluteBoundingBox: basicNode.absoluteBoundingBox,
    absoluteRenderBounds: basicNode.absoluteRenderBounds,
    clipsContent: basicNode.clipsContent,
    layoutPositioning: "AUTO",
    parent: {
      id: "parent2",
      name: "Auto Layout Parent",
      type: "FRAME",
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      itemSpacing: 10,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      layoutWrap: "NO_WRAP",
      counterAxisSpacing: 0,
      counterAxisAlignContent: "AUTO"
    }
  };
  
  console.log("\nTest 2: Auto Layout Node");
  const autoLayoutProps = extractLayoutProperties(autoLayoutNode);
  console.log("Extracted Properties:", autoLayoutProps);
  console.log("Layout Type:", getLayoutType(autoLayoutNode));
  console.log("Is Ignoring Auto Layout:", isIgnoringAutoLayout(autoLayoutNode));
  
  // Test 3: Node ignoring auto layout
  const absoluteNode = {
    id: "test3",
    name: "Absolute Node",
    type: "RECTANGLE",
    visible: basicNode.visible,
    x: basicNode.x,
    y: basicNode.y,
    width: basicNode.width,
    height: basicNode.height,
    rotation: basicNode.rotation,
    opacity: basicNode.opacity,
    blendMode: basicNode.blendMode,
    isMask: basicNode.isMask,
    effects: basicNode.effects,
    effectStyleId: basicNode.effectStyleId,
    backgroundStyleId: basicNode.backgroundStyleId,
    fillStyleId: basicNode.fillStyleId,
    strokeStyleId: basicNode.strokeStyleId,
    gridStyleId: basicNode.gridStyleId,
    cornerRadius: basicNode.cornerRadius,
    cornerSmoothing: basicNode.cornerSmoothing,
    strokeWeight: basicNode.strokeWeight,
    strokeAlign: basicNode.strokeAlign,
    strokeCap: basicNode.strokeCap,
    strokeJoin: basicNode.strokeJoin,
    strokeMiterLimit: basicNode.strokeMiterLimit,
    dashPattern: basicNode.dashPattern,
    dashOffset: basicNode.dashOffset,
    strokeGeometry: basicNode.strokeGeometry,
    strokeTopWeight: basicNode.strokeTopWeight,
    strokeRightWeight: basicNode.strokeRightWeight,
    strokeBottomWeight: basicNode.strokeBottomWeight,
    strokeLeftWeight: basicNode.strokeLeftWeight,
    relativeTransform: basicNode.relativeTransform,
    absoluteTransform: basicNode.absoluteTransform,
    absoluteBoundingBox: basicNode.absoluteBoundingBox,
    absoluteRenderBounds: basicNode.absoluteRenderBounds,
    clipsContent: basicNode.clipsContent,
    layoutPositioning: "ABSOLUTE",
    constraints: {
      horizontal: "LEFT",
      vertical: "TOP"
    },
    parent: {
      id: "parent3",
      name: "Auto Layout Parent",
      type: "FRAME",
      layoutMode: "HORIZONTAL"
    }
  };
  
  console.log("\nTest 3: Absolute Node");
  const absoluteProps = extractLayoutProperties(absoluteNode);
  console.log("Extracted Properties:", absoluteProps);
  console.log("Layout Type:", getLayoutType(absoluteNode));
  console.log("Is Ignoring Auto Layout:", isIgnoringAutoLayout(absoluteNode));
  
  // Test 4: Text node with auto layout
  const textNode = {
    id: "test4",
    name: "Text Node",
    type: "TEXT",
    visible: basicNode.visible,
    x: basicNode.x,
    y: basicNode.y,
    width: basicNode.width,
    height: basicNode.height,
    rotation: basicNode.rotation,
    opacity: basicNode.opacity,
    blendMode: basicNode.blendMode,
    isMask: basicNode.isMask,
    effects: basicNode.effects,
    effectStyleId: basicNode.effectStyleId,
    backgroundStyleId: basicNode.backgroundStyleId,
    fillStyleId: basicNode.fillStyleId,
    strokeStyleId: basicNode.strokeStyleId,
    gridStyleId: basicNode.gridStyleId,
    cornerRadius: basicNode.cornerRadius,
    cornerSmoothing: basicNode.cornerSmoothing,
    strokeWeight: basicNode.strokeWeight,
    strokeAlign: basicNode.strokeAlign,
    strokeCap: basicNode.strokeCap,
    strokeJoin: basicNode.strokeJoin,
    strokeMiterLimit: basicNode.strokeMiterLimit,
    dashPattern: basicNode.dashPattern,
    dashOffset: basicNode.dashOffset,
    strokeGeometry: basicNode.strokeGeometry,
    strokeTopWeight: basicNode.strokeTopWeight,
    strokeRightWeight: basicNode.strokeRightWeight,
    strokeBottomWeight: basicNode.strokeBottomWeight,
    strokeLeftWeight: basicNode.strokeLeftWeight,
    relativeTransform: basicNode.relativeTransform,
    absoluteTransform: basicNode.absoluteTransform,
    absoluteBoundingBox: basicNode.absoluteBoundingBox,
    absoluteRenderBounds: basicNode.absoluteRenderBounds,
    clipsContent: basicNode.clipsContent,
    characters: "Hello World",
    fontSize: 16,
    fontName: { family: "Inter", style: "Regular" },
    textAlignHorizontal: "LEFT",
    textAlignVertical: "CENTER",
    textAutoResize: "NONE",
    textCase: "ORIGINAL",
    textDecoration: "NONE",
    letterSpacing: { value: 0, unit: "PIXELS" },
    lineHeight: { value: 20, unit: "PIXELS" },
    paragraphIndent: 0,
    paragraphSpacing: 0,
    textStyleId: "",
    hyperlink: null,
    textTruncation: "DISABLED",
    maxLines: 0,
    textTransform: "NONE",
    textBehavior: "AUTO",
    layoutPositioning: "AUTO",
    parent: {
      id: "parent4",
      name: "Text Parent",
      type: "FRAME",
      layoutMode: "VERTICAL"
    }
  };
  
  console.log("\nTest 4: Text Node");
  const textProps = extractLayoutProperties(textNode);
  console.log("Extracted Properties:", textProps);
  console.log("Layout Type:", getLayoutType(textNode));
  console.log("Is Ignoring Auto Layout:", isIgnoringAutoLayout(textNode));
  
  // Test 5: Component node
  const componentNode = {
    id: "test5",
    name: "Component Node",
    type: "COMPONENT",
    visible: basicNode.visible,
    x: basicNode.x,
    y: basicNode.y,
    width: basicNode.width,
    height: basicNode.height,
    rotation: basicNode.rotation,
    opacity: basicNode.opacity,
    blendMode: basicNode.blendMode,
    isMask: basicNode.isMask,
    effects: basicNode.effects,
    effectStyleId: basicNode.effectStyleId,
    backgroundStyleId: basicNode.backgroundStyleId,
    fillStyleId: basicNode.fillStyleId,
    strokeStyleId: basicNode.strokeStyleId,
    gridStyleId: basicNode.gridStyleId,
    cornerRadius: basicNode.cornerRadius,
    cornerSmoothing: basicNode.cornerSmoothing,
    strokeWeight: basicNode.strokeWeight,
    strokeAlign: basicNode.strokeAlign,
    strokeCap: basicNode.strokeCap,
    strokeJoin: basicNode.strokeJoin,
    strokeMiterLimit: basicNode.strokeMiterLimit,
    dashPattern: basicNode.dashPattern,
    dashOffset: basicNode.dashOffset,
    strokeGeometry: basicNode.strokeGeometry,
    strokeTopWeight: basicNode.strokeTopWeight,
    strokeRightWeight: basicNode.strokeRightWeight,
    strokeBottomWeight: basicNode.strokeBottomWeight,
    strokeLeftWeight: basicNode.strokeLeftWeight,
    relativeTransform: basicNode.relativeTransform,
    absoluteTransform: basicNode.absoluteTransform,
    absoluteBoundingBox: basicNode.absoluteBoundingBox,
    absoluteRenderBounds: basicNode.absoluteRenderBounds,
    clipsContent: basicNode.clipsContent,
    componentProperties: {
      variant: "default"
    },
    componentPropertyDefinitions: {
      variant: {
        type: "VARIANT",
        defaultValue: "default"
      }
    },
    componentPropertyReferences: {},
    mainComponent: null,
    layoutPositioning: "AUTO",
    parent: {
      id: "parent5",
      name: "Component Parent",
      type: "FRAME",
      layoutMode: "NONE"
    }
  };
  
  console.log("\nTest 5: Component Node");
  const componentProps = extractLayoutProperties(componentNode);
  console.log("Extracted Properties:", componentProps);
  console.log("Layout Type:", getLayoutType(componentNode));
  console.log("Is Ignoring Auto Layout:", isIgnoringAutoLayout(componentNode));
}

// Initialize the plugin UI
figma.showUI(__html__, { 
  width: 300, 
  height: 400,
  title: "v3-site Plugin"
});

// Run tests when plugin starts
testLayoutDetection();

/**
 * Sends selection information to the UI
 */
function sendSelectionInfo() {
  // Get current selection
  const selection = figma.currentPage.selection;
  
  // Get page context
  const pageContext = {
    id: figma.currentPage.id,
    name: figma.currentPage.name
  };
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'selection',
      data: {
        count: 0,
        items: [],
        pageContext
      }
    });
    return;
  }

  // Process selected layers
  const layerItems = selection.map(node => {
    // Log raw properties for debugging
    debugLog("=== Raw Properties for Node:", node.name, "===");
    if (DEBUG) {
      Object.entries(node).forEach(([key, value]) => {
        debugLog(`${key}:`, value);
      });
    }

    // Process the node properties
    const processedProperties = processNodeProperties(node);
    
    // Log processed properties for debugging
    debugLog("=== Processed Properties for Node:", node.name, "===");
    debugLog(processedProperties);

    return processedProperties;
  });

  figma.ui.postMessage({
    type: 'selection',
    data: {
      count: selection.length,
      items: layerItems,
      pageContext
    }
  });
}

// Basic message handling
figma.ui.onmessage = async (msg) => {
  debugLog('Plugin received message:', msg);
  
  if (msg.type === 'ready' || msg.type === 'ui-ready') {
    // Send plugin status
    figma.ui.postMessage({
      type: 'plugin-status',
      message: 'Initialized'
    });

    // Send initial selection info
    sendSelectionInfo();
  } else if (msg.type === 'get-raw-node-data') {
    // Get the raw node data directly from Figma's API
    const node = figma.getNodeById(msg.id);
    if (node) {
      // Process the node data in a consistent format
      const processedData = processNodeProperties(node);
      logLayoutProperties(node);
      
      // Send the processed node data back to the UI
      figma.ui.postMessage({
        type: 'raw-node-data',
        id: msg.id,
        data: processedData
      });
      
      // Log the exact data we're sending to the UI
      debugWarn("Sending data to UI:", {
        type: 'raw-node-data',
        id: msg.id,
        data: processedData
      });
    }
  }
};

// Listen for selection changes
figma.on('selectionchange', () => {
  sendSelectionInfo();
}); 

// Process utilities for Figma properties
function processNodeProperties(node) {
  if (!node) return null;

  return {
    // Basic properties
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    position: processPosition(node),
    size: processSize(node),
    transform: processTransform(node),
    visual: processVisualProperties(node),
    
    // Layout properties
    layout: processLayoutProperties(node),
    
    // Type-specific properties
    text: node.type === "TEXT" ? processTextProperties(node) : null,
    component: (node.type === "COMPONENT" || node.type === "INSTANCE") ? 
      processComponentProperties(node) : null,
    section: node.type === "SECTION" ? processSectionProperties(node) : null,
    group: node.type === "GROUP" ? processGroupProperties(node) : null,
    vector: isVectorType(node.type) ? processVectorProperties(node) : null
  };
}

function processPosition(node) {
  return {
    x: node.x,
    y: node.y,
    absolute: {
      x: node.absoluteBoundingBox ? node.absoluteBoundingBox.x : 0,
      y: node.absoluteBoundingBox ? node.absoluteBoundingBox.y : 0
    }
  };
}

function processSize(node) {
  return {
    width: { value: node.width, unit: "PIXELS" },
    height: { value: node.height, unit: "PIXELS" },
    absolute: {
      width: (node.absoluteBoundingBox && node.absoluteBoundingBox.width) || 0,
      height: (node.absoluteBoundingBox && node.absoluteBoundingBox.height) || 0
    },
    constraints: node.constraints
  };
}

function processTransform(node) {
  return {
    rotation: node.rotation,
    relative: node.relativeTransform,
    absolute: node.absoluteTransform
  };
}

function processVisualProperties(node) {
  return {
    opacity: node.opacity,
    blendMode: node.blendMode,
    effects: node.effects,
    fills: node.fills,
    strokes: node.strokes,
    cornerRadius: node.cornerRadius,
    cornerSmoothing: node.cornerSmoothing,
    stroke: {
      weight: node.strokeWeight,
      align: node.strokeAlign,
      cap: node.strokeCap,
      join: node.strokeJoin,
      miterLimit: node.strokeMiterLimit,
      dashPattern: node.dashPattern,
      geometry: node.strokeGeometry,
      weights: {
        top: node.strokeTopWeight,
        right: node.strokeRightWeight,
        bottom: node.strokeBottomWeight,
        left: node.strokeLeftWeight
      }
    }
  };
}

function processLayoutProperties(node) {
  return {
    type: getLayoutType(node),
    isIgnoringAutoLayout: isIgnoringAutoLayout(node),
    positioning: node.layoutPositioning,
    constraints: node.constraints,
    align: {
      layout: node.layoutAlign,
      grow: node.layoutGrow
    },
    sizing: {
      horizontal: node.layoutSizingHorizontal,
      vertical: node.layoutSizingVertical
    },
    grid: {
      grids: node.layoutGrids,
      styleId: node.layoutGridStyleId
    },
    autoLayout: node.layoutMode ? {
      mode: node.layoutMode,
      primaryAxis: {
        alignItems: node.primaryAxisAlignItems,
        sizingMode: node.primaryAxisSizingMode
      },
      counterAxis: {
        alignItems: node.counterAxisAlignItems,
        sizingMode: node.counterAxisSizingMode,
        spacing: node.counterAxisSpacing,
        alignContent: node.counterAxisAlignContent
      },
      spacing: {
        items: node.itemSpacing
      },
      padding: {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      },
      wrap: node.layoutWrap
    } : null,
    parent: node.parent ? {
      id: node.parent.id,
      name: node.parent.name,
      type: node.parent.type,
      layout: {
        mode: node.parent.layoutMode,
        align: node.parent.layoutAlign,
        grow: node.parent.layoutGrow,
        sizing: {
          horizontal: node.parent.layoutSizingHorizontal,
          vertical: node.parent.layoutSizingVertical
        }
      }
    } : null
  };
}

function processTextProperties(node) {
  return {
    content: node.characters,
    style: {
      fontSize: node.fontSize,
      fontName: node.fontName,
      alignment: {
        horizontal: node.textAlignHorizontal,
        vertical: node.textAlignVertical
      },
      autoResize: node.textAutoResize,
      case: node.textCase,
      decoration: node.textDecoration,
      spacing: {
        letter: node.letterSpacing,
        line: node.lineHeight,
        paragraph: {
          indent: node.paragraphIndent,
          spacing: node.paragraphSpacing
        }
      },
      styleId: node.textStyleId,
      truncation: {
        type: node.textTruncation,
        maxLines: node.maxLines
      },
      transform: node.textTransform,
      behavior: node.textBehavior
    },
    hyperlink: node.hyperlink
  };
}

function processComponentProperties(node) {
  return {
    properties: node.componentProperties,
    variantProperties: node.variantProperties,
    definitions: node.componentPropertyDefinitions,
    references: node.componentPropertyReferences,
    mainComponent: node.mainComponent ? {
      id: node.mainComponent.id,
      name: node.mainComponent.name
    } : null
  };
}

function processSectionProperties(node) {
  return {
    isExpanded: node.isExpanded,
    isLocked: node.isLocked,
    isSticky: node.isSticky
  };
}

function processGroupProperties(node) {
  return {
    isLocked: node.isLocked,
    isMask: node.isMask,
    clipsContent: node.clipsContent
  };
}

function processVectorProperties(node) {
  return {
    paths: node.vectorPaths,
    network: node.vectorNetwork,
    handleMirroring: node.handleMirroring,
    points: {
      count: node.pointCount,
      radius: node.pointRadius
    },
    star: node.type === "STAR" ? {
      innerRadius: node.starInnerRadius,
      pointCount: node.starPointCount
    } : null,
    arc: node.type === "ELLIPSE" ? node.arcData : null
  };
}

function isVectorType(type) {
  return ["VECTOR", "STAR", "LINE", "ELLIPSE", "POLYGON", "RECTANGLE"].includes(type);
} 