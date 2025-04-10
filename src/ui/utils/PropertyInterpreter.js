/**
 * Centralized Property Interpreter Utility for interpreting node properties
 */

// Export the PropertyInterpreter as a module
export const PropertyInterpreter = {
  /**
   * Determines the layout type based on Figma node properties
   */
  layoutType: function(node) {
    if (!node) return "None";
    
    if (node.layout && node.layout.autoLayout && node.layout.autoLayout.mode) {
      return "Flex";
    }
    
    if (node.type === "FRAME") {
      return "Block";
    }
      
    if (node.type === "GROUP") {
      return "Flex";
    }
    
    return "None";
  },
  
  /**
   * Interprets Figma's layout mode into CSS flex direction
   */
  direction: function(node) {
    const mode = node.layout && node.layout.autoLayout && node.layout.autoLayout.mode;
    return mode === "VERTICAL" ? "column" : "row";
  },
  
  /**
   * Interprets Figma's counter axis alignment into CSS align-items
   */
  alignItems: function(node) {
    const align = node.layout && node.layout.autoLayout && node.layout.autoLayout.counterAxis && node.layout.autoLayout.counterAxis.alignItems;
    
    switch (align) {
      case "MIN": return "flex-start";
      case "MAX": return "flex-end";
      case "CENTER": return "center";
      case "SPACE_BETWEEN": return "space-between";
      default: return "flex-start";
    }
  },
  
  /**
   * Interprets Figma's primary axis alignment into CSS justify-content
   */
  justifyContent: function(node) {
    const justify = node.layout && node.layout.autoLayout && node.layout.autoLayout.primaryAxis && node.layout.autoLayout.primaryAxis.alignItems;
    
    switch (justify) {
      case "MIN": return "flex-start";
      case "MAX": return "flex-end";
      case "CENTER": return "center";
      case "SPACE_BETWEEN": return "space-between";
      case "SPACE_AROUND": return "space-around";
      default: return "flex-start";
    }
  },
  
  /**
   * Interprets Figma's padding values into CSS padding
   */
  padding: function(node) {
    const padding = node.layout && node.layout.autoLayout && node.layout.autoLayout.padding;
    
    return {
      top: padding && padding.top || 0,
      right: padding && padding.right || 0,
      bottom: padding && padding.bottom || 0,
      left: padding && padding.left || 0
    };
  },
  
  /**
   * Interprets Figma's spacing values into CSS gap
   */
  gap: function(node) {
    return node.layout && node.layout.autoLayout && node.layout.autoLayout.spacing && node.layout.autoLayout.spacing.items || 0;
  },
  
  /**
   * Interprets Figma's blend mode
   */
  blendMode: function(mode) {
    if (!mode) return 'Normal';
    
    const blendModes = {
      'PASS_THROUGH': 'Pass Through',
      'NORMAL': 'Normal',
      'DARKEN': 'Darken',
      'MULTIPLY': 'Multiply',
      'LINEAR_BURN': 'Linear Burn',
      'COLOR_BURN': 'Color Burn',
      'LIGHTEN': 'Lighten',
      'SCREEN': 'Screen',
      'LINEAR_DODGE': 'Linear Dodge',
      'COLOR_DODGE': 'Color Dodge',
      'OVERLAY': 'Overlay',
      'SOFT_LIGHT': 'Soft Light',
      'HARD_LIGHT': 'Hard Light',
      'DIFFERENCE': 'Difference',
      'EXCLUSION': 'Exclusion',
      'HUE': 'Hue',
      'SATURATION': 'Saturation',
      'COLOR': 'Color',
      'LUMINOSITY': 'Luminosity'
    };
    
    return blendModes[mode] || mode;
  },
  
  /**
   * Converts RGB to HEX color
   */
  rgbToHex: function(r, g, b) {
    const toHex = (n) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  },
  
  /**
   * Determines if a node actually should be in auto layout despite being marked absolute
   */
  isActuallyInAutoLayout: function(data) {
    if (data.type !== "TEXT") return false;

    const layoutMode = data.layout && data.layout.parent && data.layout.parent.layoutMode;
    const positioning = data.layout && data.layout.positioning;
    const constraints = (data.layout && data.layout.constraints) || {};
    const hasNeutralConstraints = (
      constraints.horizontal === "MIN" &&
      constraints.vertical === "MIN"
    );

    const isMarkedAbsolute = positioning === "ABSOLUTE";
    const isInsideAutoLayout = layoutMode === "HORIZONTAL" || layoutMode === "VERTICAL";
    const isAutoPositioning = positioning === "AUTO";

    if (isMarkedAbsolute && isInsideAutoLayout && hasNeutralConstraints) {
      return true;
    }

    if (isAutoPositioning) {
      return true;
    }

    return false;
  }
};

// Make it available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.PropertyInterpreter = PropertyInterpreter;
} 