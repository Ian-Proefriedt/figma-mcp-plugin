/**
 * Registry of property definitions
 * This defines all the properties that can be displayed and edited in the UI
 */

// Import interpreters if needed
import { PropertyInterpreter } from '../utils/PropertyInterpreter.js';

// Export the registry as a module
export const PropertyRegistry = {
  // Layout properties
  'type': {
    type: 'dropdown',
    label: 'Type',
    options: ['Block', 'Flex'],
    section: 'layout',
    priority: 10,
    getValue: (data) => (data.layout && data.layout.autoLayout && data.layout.autoLayout.mode !== undefined) ? "Flex" : "Block",
    render: (el, value) => { el.textContent = value; }
  },
  'direction': {
    type: 'dropdown',
    label: 'Direction',
    options: ['row', 'column'],
    section: 'layout',
    priority: 20,
    getValue: (data) => (data.layout && data.layout.autoLayout && data.layout.autoLayout.mode === "VERTICAL") ? "column" : "row",
    render: (el, value) => { el.textContent = value; }
  },
  'align': {
    type: 'dropdown',
    label: 'Align',
    options: ['flex-start', 'center', 'flex-end', 'space-between'],
    section: 'layout',
    priority: 30,
    getValue: (data) => {
      const align = (data.layout && data.layout.autoLayout && data.layout.autoLayout.counterAxis && data.layout.autoLayout.counterAxis.alignItems) || "MIN";
      return (align === "MIN" ? "flex-start" : 
              align === "MAX" ? "flex-end" : 
              align === "CENTER" ? "center" : "flex-start");
    },
    render: (el, value) => { el.textContent = value; }
  },
  'justify': {
    type: 'dropdown',
    label: 'Justify',
    options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    section: 'layout',
    priority: 40,
    getValue: (data) => {
      const justify = (data.layout && data.layout.autoLayout && data.layout.autoLayout.primaryAxis && data.layout.autoLayout.primaryAxis.alignItems) || "MIN";
      return (justify === "MIN" ? "flex-start" : 
             justify === "MAX" ? "flex-end" : 
             justify === "CENTER" ? "center" : 
             justify === "SPACE_BETWEEN" ? "space-between" : "flex-start");
    },
    render: (el, value) => { el.textContent = value; }
  },
  'gap': {
    type: 'number',
    label: 'Gap',
    min: 0,
    max: 1000,
    section: 'layout',
    priority: 50,
    getValue: (data) => (data.layout && data.layout.autoLayout && data.layout.autoLayout.spacing && data.layout.autoLayout.spacing.items) || 0,
    render: (el, value) => { el.textContent = value; }
  },
  'overflow': {
    type: 'dropdown',
    label: 'Overflow',
    options: ['visible', 'hidden'],
    section: 'layout',
    priority: 60,
    getValue: (data) => (data.visual && data.visual.clipsContent) ? "hidden" : "visible",
    render: (el, value) => { el.textContent = value; }
  },
  
  // Position & Size properties
  'z-index': {
    type: 'number',
    label: 'Z-Index',
    min: -999,
    max: 999,
    section: 'position',
    priority: 10,
    getValue: (data) => data.zIndex || 0,
    render: (el, value) => { el.textContent = value; }
  },
  'positioning': {
    type: 'dropdown',
    label: 'Positioning',
    options: ['Absolute', 'Relative'],
    section: 'position',
    priority: 20,
    getValue: (data) => {
      const isActuallyInAutoLayout = PropertyInterpreter.isActuallyInAutoLayout(data);
      const isInAutoLayout = 
        (data.layout && data.layout.type === 'AUTO') || 
        (data.layout && data.layout.parent && data.layout.parent.type === 'AUTO') ||
        (data.layout && data.layout.parent && data.layout.parent.layoutMode === "HORIZONTAL") ||
        (data.layout && data.layout.parent && data.layout.parent.layoutMode === "VERTICAL") ||
        isActuallyInAutoLayout;
      const ignoresAutoLayout = (data.layout && data.layout.isIgnoringAutoLayout === true) && !isActuallyInAutoLayout;
      return (isInAutoLayout && !ignoresAutoLayout) ? "Relative" : "Absolute";
    },
    render: (el, value) => { el.textContent = value; }
  },
  'rotation': {
    type: 'number',
    label: 'Rotation',
    min: 0,
    max: 360,
    unit: '°',
    section: 'position',
    priority: 30,
    getValue: (data) => {
      const rotation = (data.transform && data.transform.rotation) || 0;
      return Math.round(rotation * (180/Math.PI));
    },
    render: (el, value) => { el.textContent = `${value}°`; }
  },
  
  // Style properties
  'fill': {
    type: 'text',
    label: 'Fill',
    section: 'style',
    priority: 10,
    getValue: (data) => {
      if (!data.visual || !data.visual.fills || data.visual.fills.length === 0) {
        return { preview: null, text: 'None', opacity: 100 };
      }
      
      const fill = data.visual.fills[0];
      if (fill.type !== 'SOLID' || !fill.color) {
        return { preview: null, text: 'Complex', opacity: 100 };
      }
      
      return {
        preview: fill.color,
        text: PropertyInterpreter.rgbToHex(fill.color.r, fill.color.g, fill.color.b),
        opacity: Math.round((fill.opacity || 1) * 100)
      };
    },
    render: (el, value) => {
      const colorPreview = el.querySelector('.property-color-preview');
      const colorValue = el.querySelector('.property-color-value');
      const opacityValue = el.querySelector('.property-opacity-value');
      
      if (value.preview) {
        const color = value.preview;
        const opacity = value.opacity / 100;
        if (colorPreview) {
          colorPreview.style.backgroundColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`;
        }
      } else if (colorPreview) {
        colorPreview.style.backgroundColor = 'transparent';
      }
      
      if (colorValue) colorValue.textContent = value.text;
      if (opacityValue) opacityValue.textContent = `${value.opacity}%`;
    }
  },
  'stroke': {
    type: 'text',
    label: 'Stroke',
    section: 'style',
    priority: 20,
    getValue: (data) => {
      if (!data.visual || !data.visual.strokes || data.visual.strokes.length === 0) {
        return { preview: null, text: 'None', opacity: 100 };
      }
      
      const stroke = data.visual.strokes[0];
      if (stroke.type !== 'SOLID' || !stroke.color) {
        return { preview: null, text: 'Complex', opacity: 100 };
      }
      
      return {
        preview: stroke.color,
        text: PropertyInterpreter.rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b),
        opacity: Math.round((stroke.opacity || 1) * 100),
        weight: stroke.weight || 1
      };
    },
    render: (el, value) => {
      const colorPreview = el.querySelector('.property-color-preview');
      const colorValue = el.querySelector('.property-color-value');
      
      if (value.preview) {
        const color = value.preview;
        if (colorPreview) {
          colorPreview.style.backgroundColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
        }
      } else if (colorPreview) {
        colorPreview.style.backgroundColor = 'transparent';
      }
      
      if (colorValue) colorValue.textContent = value.text;
    }
  },
  'radius': {
    type: 'number',
    label: 'Radius',
    min: 0,
    max: 100,
    section: 'style',
    priority: 30,
    getValue: (data) => {
      if (!data.visual || !data.visual.cornerRadius) return 0;
      return data.visual.cornerRadius;
    },
    render: (el, value) => { el.textContent = value; }
  },
  'opacity': {
    type: 'number',
    label: 'Opacity',
    min: 0,
    max: 100,
    unit: '%',
    section: 'style',
    priority: 40,
    getValue: (data) => {
      if (!data.visual || data.visual.opacity === undefined) return 100;
      return Math.round(data.visual.opacity * 100);
    },
    render: (el, value) => { el.textContent = `${value}%`; }
  },
  'blend': {
    type: 'dropdown',
    label: 'Blend',
    options: ['Normal', 'Multiply', 'Screen', 'Overlay'],
    section: 'style',
    priority: 50,
    getValue: (data) => {
      if (!data.visual || !data.visual.blendMode) return 'Normal';
      const mode = data.visual.blendMode;
      return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
    },
    render: (el, value) => { el.textContent = value; }
  },
  
  // Text properties
  'font-size': {
    type: 'number',
    label: 'Font Size',
    min: 1,
    max: 288,
    section: 'text',
    priority: 10,
    getValue: (data) => {
      if (!data.text || !data.text.fontSize) return 16;
      return data.text.fontSize;
    },
    render: (el, value) => { el.textContent = value; }
  },
  'color': {
    type: 'text',
    label: 'Color',
    section: 'text',
    priority: 20,
    getValue: (data) => {
      if (!data.text || !data.text.color) {
        return { preview: null, text: 'None' };
      }
      
      return {
        preview: data.text.color,
        text: PropertyInterpreter.rgbToHex(data.text.color.r, data.text.color.g, data.text.color.b)
      };
    },
    render: (el, value) => {
      const colorPreview = el.querySelector('.property-color-preview');
      const colorValue = el.querySelector('.property-color-value');
      
      if (value.preview) {
        const color = value.preview;
        if (colorPreview) {
          colorPreview.style.backgroundColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
        }
      } else if (colorPreview) {
        colorPreview.style.backgroundColor = 'transparent';
      }
      
      if (colorValue) colorValue.textContent = value.text;
    }
  },
  'font-weight': {
    type: 'dropdown',
    label: 'Weight',
    options: ['Regular', 'Medium', 'Bold'],
    section: 'text',
    priority: 30,
    getValue: (data) => {
      if (!data.text || !data.text.fontWeight) return 'Regular';
      const weight = data.text.fontWeight;
      if (weight < 500) return 'Regular';
      if (weight < 700) return 'Medium';
      return 'Bold';
    },
    render: (el, value) => { el.textContent = value; }
  },
  'align': {
    type: 'dropdown',
    label: 'Align',
    options: ['Left', 'Center', 'Right'],
    section: 'text',
    priority: 40,
    getValue: (data) => {
      if (!data.text || !data.text.textAlignHorizontal) return 'Left';
      const align = data.text.textAlignHorizontal;
      return align.charAt(0).toUpperCase() + align.slice(1).toLowerCase();
    },
    render: (el, value) => { el.textContent = value; }
  },
  'line-height': {
    type: 'number',
    label: 'Line Height',
    unit: 'px',
    section: 'text',
    priority: 50,
    getValue: (data) => {
      if (!data.text || !data.text.lineHeight) return 'Auto';
      return data.text.lineHeight.value || 'Auto';
    },
    render: (el, value) => { 
      if (value === 'Auto') {
        el.textContent = 'Auto';
      } else {
        el.textContent = `${value}px`; 
      }
    }
  },
  'letter-spacing': {
    type: 'number',
    label: 'Spacing',
    unit: 'px',
    section: 'text',
    priority: 60,
    getValue: (data) => {
      if (!data.text || data.text.letterSpacing === undefined) return 0;
      return data.text.letterSpacing;
    },
    render: (el, value) => { el.textContent = `${value}px`; }
  }
};

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.PropertyRegistry = PropertyRegistry;
} 