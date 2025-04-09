# Property Detection Documentation

## Table of Contents
1. [Core Detection Strategy](#core-detection-strategy)
2. [Property Categories](#property-categories)
3. [Type-Specific Detection](#type-specific-detection)
4. [Layout Detection](#layout-detection)
5. [Implementation Details](#implementation-details)
6. [Related Documentation](#related-documentation)

## Core Detection Strategy

### Data Flow
1. **Initial Detection**
   - Triggered by Figma selection change
   - Detects properties for selected element and all descendants
   - Stores properties for later use
   - Updates UI based on selected layer

2. **Property Processing**
   - Raw Figma data → Processed properties
   - Type-specific interpretation
   - Format conversion for Cursor
   - Validation and error handling

### Detection Functions
```javascript
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
```

## Property Categories

### 1. Basic Properties
- ID and name
- Visibility
- Position and size
- Transform data
- Visual properties (opacity, blend mode, fills, strokes, effects)

### 2. Layout Properties
- Auto layout detection
- Layout positioning
- Constraints
- Alignment
- Sizing behavior
- Grid properties
- Parent layout information

### 3. Type-Specific Properties
- Text properties
- Component properties
- Section properties
- Group properties
- Vector properties

## Type-Specific Detection

### Text Properties
```javascript
if (node.type === "TEXT") {
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
```

### Component Properties
```javascript
if (node.type === "COMPONENT" || node.type === "INSTANCE") {
  return {
    componentProperties: node.componentProperties,
    variantProperties: node.variantProperties,
    componentPropertyDefinitions: node.componentPropertyDefinitions,
    componentPropertyReferences: node.componentPropertyReferences,
    mainComponent: node.mainComponent ? {
      id: node.mainComponent.id,
      name: node.mainComponent.name
    } : null
  };
}
```

### Vector Properties
```javascript
if (isVectorType(node.type)) {
  return {
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
```

## Layout Detection

### Auto Layout Detection
```javascript
function isIgnoringAutoLayout(node) {
  if (!node || !node.parent) return false;
  
  const parent = node.parent;
  const parentHasAutoLayout = parent && "layoutMode" in parent ? 
    (parent.layoutMode === "HORIZONTAL" || parent.layoutMode === "VERTICAL") : 
    false;
  
  const isAbsolutePositioned = node.layoutPositioning === "ABSOLUTE";
  
  return parentHasAutoLayout && isAbsolutePositioned;
}
```

### Layout Type Inference
```javascript
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
```

## Implementation Details

### Property Interpretation
1. **Layout Properties**
   - Direction interpretation
   - Alignment interpretation
   - Spacing interpretation
   - Padding interpretation
   - Grid interpretation
   - Parent layout interpretation

2. **Visual Properties**
   - Color format conversion
   - Effect interpretation
   - Stroke interpretation
   - Fill interpretation
   - Style ID resolution

3. **Text Properties**
   - Font family mapping
   - Text alignment mapping
   - Line height calculation
   - Letter spacing conversion
   - Style ID resolution

### Error Handling
1. **Validation**
   - Property existence checks
   - Type validation
   - Value range validation
   - Format validation
   - Style ID validation

2. **Fallback Behavior**
   - Default values
   - Type-specific defaults
   - Error logging
   - UI feedback

### Testing and Debugging
1. **Console Logging**
   - Property detection logs
   - Interpretation logs
   - Error logs
   - State transition logs
   - Layout debugging logs

2. **Visual Testing**
   - Property display verification
   - Type-specific rendering
   - Error state visualization
   - State transition verification 

## Related Documentation

### Internal References
- [Property Block Refactor Plan](../docs/property-block-refactor-plan.md) - UI implementation of property blocks
- [Plugin Architecture](../docs/plugin-architecture.md) - System architecture and data flow
- [Plugin Documentation](../docs/plugin-documentation.md) - High-level plugin concepts

### External References
- [Figma Plugin API](https://www.figma.com/plugin-docs/) - Official Figma plugin documentation
- [Figma Node Types](https://www.figma.com/plugin-docs/api/nodes/) - Figma node type reference 