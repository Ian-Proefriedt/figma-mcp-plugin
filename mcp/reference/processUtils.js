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
      x: node.absoluteBoundingBox?.x || 0,
      y: node.absoluteBoundingBox?.y || 0
    }
  };
}

function processSize(node) {
  return {
    width: { value: node.width, unit: "PIXELS" },
    height: { value: node.height, unit: "PIXELS" },
    absolute: {
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0
    }
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

// Export the main processing function
module.exports = {
  processNodeProperties
}; 