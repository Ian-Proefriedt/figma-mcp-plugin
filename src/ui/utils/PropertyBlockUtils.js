/**
 * PropertyBlockUtils - Utilities for working with property blocks
 */

// Importing dependencies
import { PropertyBlock, NumberInputBehavior, DropdownBehavior, TextBehavior, ResetButtonBehavior } from '../components/PropertyBlock.js';
import { Logger } from './Logger.js';
import { PropertyRegistry } from '../properties/PropertyRegistry.js';

/**
 * Factory function to create a property block with specific behavior
 * @param {string} type - Type of property block (dropdown, color, number, text)
 * @param {string} name - Property name
 * @param {object} options - Additional options for the property block
 * @returns {object} - Property block API with methods to interact with the block
 */
export function createPropertyBlock(type, name, options = {}) {
  Logger.debug('PropertyBlock', `Creating property block: ${name} (${type})`, options);
  
  // Create the DOM element
  const block = document.createElement('div');
  block.classList.add('property-block');
  block.dataset.property = name;
  
  // Special handling for color-related properties
  if (['fill', 'stroke', 'color'].includes(name)) {
    type = 'text';
    if (!options.render) {
      options.render = (value) => {
        const colorPreview = document.createElement('div');
        colorPreview.classList.add('color-preview');
        
        if (value && value !== 'none' && value !== 'transparent') {
          try {
            colorPreview.style.backgroundColor = value;
          } catch (e) {
            console.error('Invalid color value', value);
          }
        } else {
          colorPreview.classList.add('no-color');
        }
        
        return colorPreview;
      };
    }
  }
  
  // Validate options based on type
  if (type === 'dropdown' && (!options.options || !Array.isArray(options.options))) {
    options.options = [];
    Logger.error('PropertyBlock', `Dropdown property ${name} has no valid options`);
  }
  
  // Format dropdown options if they're in simple format
  if (type === 'dropdown' && options.options && options.options.length > 0) {
    if (typeof options.options[0] === 'string') {
      options.options = options.options.map(opt => ({ value: opt, label: opt }));
    }
  }
  
  // Create the PropertyBlock instance
  const propertyBlock = new PropertyBlock(type, name, options, block);
  
  // Store any getValue function for PropertyHandler to use
  if (options.getValue) {
    propertyBlock.getValue = options.getValue;
  }
  
  // Store any custom render function
  if (options.render) {
    propertyBlock.render = options.render;
  }
  
  return {
    // DOM element
    element: block,
    
    // Set value in the property block
    setValue: (value) => propertyBlock.setValue(value),
    
    // Get the DOM element for the block
    getElement: () => block,
    
    // Append to a container
    appendTo: (container) => {
      if (typeof container === 'string') {
        const containerElement = document.getElementById(container);
        if (containerElement) {
          containerElement.appendChild(block);
        } else {
          Logger.error('PropertyBlock', `Container not found: ${container}`);
        }
      } else if (container && container.appendChild) {
        container.appendChild(block);
      }
      return propertyBlock;
    },
    
    // Hide the property block
    hide: () => {
      block.style.display = 'none';
      return propertyBlock;
    },
    
    // Show the property block
    show: () => {
      block.style.display = '';
      return propertyBlock;
    },
    
    // Set the state of the property block
    setState: (state) => propertyBlock.setState(state),
    
    // Get the current value
    getValue: () => propertyBlock.getValue ? 
      propertyBlock.getValue() : 
      block.querySelector('input, select')?.value
  };
}

/**
 * Function to initialize property blocks from registry
 */
export function initPropertyBlocks() {
  Logger.info('Init', 'Initializing property blocks with registry system');
  
  // Clear existing property containers
  document.querySelectorAll('.properties-grid').forEach(grid => {
    grid.innerHTML = '';
  });
  
  // Get property containers
  const layoutProperties = document.getElementById('layout-properties');
  const positionSizeProperties = document.getElementById('position-size-properties');
  const styleProperties = document.getElementById('style-properties');
  const textProperties = document.getElementById('text-properties');
  
  if (!layoutProperties || !positionSizeProperties || !styleProperties || !textProperties) {
    Logger.error('Init', 'Could not find property containers', {
      layoutProperties,
      positionSizeProperties,
      styleProperties,
      textProperties
    });
    return;
  }
  
  Logger.debug('Init', 'Found property containers, creating blocks from registry');
  
  // Group properties by section
  const sections = {
    'layout': [],
    'position-size': [],
    'style': [],
    'text': []
  };
  
  // Sort properties into sections
  Object.entries(PropertyRegistry).forEach(([propName, definition]) => {
    if (definition.section && sections[definition.section]) {
      sections[definition.section].push({
        name: propName,
        ...definition,
        priority: definition.priority || 100
      });
    }
  });
  
  // Create blocks for each section, sorted by priority
  Object.entries(sections).forEach(([sectionName, props]) => {
    // Sort by priority
    props.sort((a, b) => a.priority - b.priority);
    
    // Create blocks
    props.forEach(prop => {
      // Pass all relevant options from the registry to create blocks
      createPropertyBlock(prop.type, prop.name, {
        label: prop.label,
        options: prop.options,
        min: prop.min,
        max: prop.max,
        step: prop.step,
        unit: prop.unit,
        multiline: prop.multiline,
        defaultValue: prop.defaultValue,
        // Add getValue function reference for PropertyHandler to use later
        getValue: prop.getValue,
        render: prop.render
      }).appendTo(`${sectionName}-properties`);
    });
  });
  
  Logger.info('Init', 'Property blocks created successfully', { 
    blockCount: Object.values(sections).reduce((total, items) => total + items.length, 0) 
  });
}

/**
 * Creates property blocks from registry definitions and adds them to a section
 * @param {string} section - The section name ('layout', 'position', etc.)
 * @return {Array} - Array of created property blocks
 */
export function createPropertyBlocksForSection(section) {
  const blocks = [];
  
  // Map section names to HTML class names
  const sectionClassMap = {
    'layout': 'layout',
    'position': 'position-size',
    'style': 'style',
    'text': 'text'
  };
  
  const sectionClass = sectionClassMap[section] || section;
  
  // Find section element
  const sectionEl = document.querySelector(`.section.${sectionClass}`);
  if (!sectionEl) {
    Logger.warn('PropertyBlockUtils', `Section "${section}" not found`);
    return blocks;
  }
  
  // Find properties grid
  const propertiesGrid = sectionEl.querySelector('.properties-grid');
  if (!propertiesGrid) {
    Logger.warn('PropertyBlockUtils', `Properties grid not found in section "${section}"`);
    return blocks;
  }
  
  // Get properties for this section
  const properties = Object.entries(PropertyRegistry)
    .filter(([_, def]) => def.section === section)
    .sort((a, b) => (a[1].priority || 99) - (b[1].priority || 99));
    
  // Create property blocks
  properties.forEach(([name, definition]) => {
    try {
      const block = new PropertyBlock(name, {
        type: definition.type,
        label: definition.label,
        options: definition.options
      });
      
      // Add the block to the container
      block.appendTo(propertiesGrid.id || propertiesGrid);
      blocks.push(block);
    } catch (error) {
      Logger.error('PropertyBlockUtils', `Error creating property block: ${error.message}`);
    }
  });
  
  return blocks;
}

/**
 * Finds a property block by name
 * @param {string} name - The property name to look for
 * @return {PropertyBlock|null} - The property block or null if not found
 */
export function findPropertyBlock(name) {
  const element = document.querySelector(`[data-property="${name}"]`);
  if (!element) {
    Logger.warn('PropertyBlockUtils', `Property block "${name}" not found`);
    return null;
  }
  return new PropertyBlock(element);
}

/**
 * Update a single property value
 * @param {string} name - The property name
 * @param {any} value - The value to set
 * @param {boolean} isOriginal - Whether this is the original value
 * @return {boolean} - Success or failure
 */
export function updatePropertyValue(name, value, isOriginal = true) {
  const block = findPropertyBlock(name);
  if (block) {
    block.setValue(value, { isOriginal });
    return true;
  }
  return false;
}

/**
 * Set a property state
 * @param {string} name - The property name
 * @param {string} state - The state to set ('default', 'editing', 'modified', 'locked')
 * @return {boolean} - Success or failure
 */
export function setPropertyState(name, state) {
  const block = findPropertyBlock(name);
  if (block) {
    block.setState(state);
    return true;
  }
  return false;
}

/**
 * Update visibility of property blocks based on node type
 * @param {string} nodeType - The node type (e.g., 'FRAME', 'TEXT')
 */
export function updateVisibilityByType(nodeType) {
  if (!nodeType) return;
  
  // Show/hide property blocks based on element type
  const visibilityMap = {
    'fill': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT'],
    'stroke': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR'],
    'radius': ['FRAME', 'RECTANGLE'],
    'opacity': true, // Always show
    'blend': true,   // Always show
    'shadow': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT']
  };
  
  // Update visibility for property blocks
  Object.entries(visibilityMap).forEach(([property, types]) => {
    const block = document.querySelector(`[data-property="${property}"]`);
    if (!block) return;
    
    const isVisible = types === true || 
      (Array.isArray(types) && types.includes(nodeType));
    
    block.style.display = isVisible ? 'block' : 'none';
  });
}

/**
 * Update property values based on node data
 * @param {Object} data - The node data
 * @param {Object} propertyMap - Map of property blocks
 */
export function updatePropertyValues(data, propertyMap) {
  if (!data || !propertyMap) return;
  
  // Helper to safely update a property value
  const updatePropertySafely = (section, prop, value) => {
    if (propertyMap[section] && propertyMap[section][prop]) {
      propertyMap[section][prop].setValue(value, true);
    }
  };
  
  // Update layout properties
  if (data.layout) {
    const layoutMode = data.layout.layoutMode || 'NONE';
    updatePropertySafely('layout', 'type', layoutMode);
    
    // Only show direction if in auto layout
    const isAutoLayout = layoutMode !== 'NONE';
    if (propertyMap.layout.direction && typeof propertyMap.layout.direction.setVisible === 'function') {
      propertyMap.layout.direction.setVisible(isAutoLayout);
    }
    
    if (isAutoLayout) {
      updatePropertySafely('layout', 'direction', layoutMode);
      updatePropertySafely('layout', 'align', data.layout.primaryAxisAlignItems || 'START');
      updatePropertySafely('layout', 'justify', data.layout.counterAxisAlignItems || 'START');
      updatePropertySafely('layout', 'gap', data.layout.itemSpacing || 0);
    }
  }
  
  // Update position properties
  updatePropertySafely('position', 'z-index', data.zIndex || 0);
  updatePropertySafely('position', 'positioning', data.positioning || 'AUTO');
  
  if (data.transform) {
    const rotation = data.transform.rotation || 0;
    updatePropertySafely('position', 'rotation', Math.round(rotation * (180/Math.PI)));
  }
  
  // Update style properties
  if (data.fills && data.fills.length > 0) {
    const fill = data.fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      updatePropertySafely('style', 'fill', fill.color);
    }
  }
  
  if (data.strokes && data.strokes.length > 0) {
    const stroke = data.strokes[0];
    if (stroke.type === 'SOLID' && stroke.color) {
      updatePropertySafely('style', 'stroke', stroke.color);
    }
  }
  
  updatePropertySafely('style', 'radius', data.cornerRadius || 0);
  updatePropertySafely('style', 'opacity', (data.opacity || 1) * 100);
  updatePropertySafely('style', 'blend', data.blendMode || 'NORMAL');
  
  // Update text properties if this is a text node
  if (data.type === 'TEXT') {
    updatePropertySafely('text', 'font-size', data.fontSize || 14);
    
    if (data.fontName) {
      updatePropertySafely('text', 'font-family', data.fontName.family);
    }
    
    if (data.fills && data.fills.length > 0 && data.fills[0].color) {
      updatePropertySafely('text', 'color', data.fills[0].color);
    }
    
    updatePropertySafely('text', 'text-align', data.textAlignHorizontal || 'LEFT');
    
    if (data.lineHeight) {
      updatePropertySafely('text', 'line-height', 
        data.lineHeight.unit === 'AUTO' 
          ? 'AUTO' 
          : data.lineHeight.value
      );
    }
    
    if (data.letterSpacing) {
      updatePropertySafely('text', 'letter-spacing', data.letterSpacing.value);
    }
  }
}

/**
 * Set property states for all properties
 * @param {string} state - The state to set ('default', 'editing', 'modified', 'locked')
 * @param {Object} propertyMap - Map of property blocks
 */
export function setPropertyStates(state, propertyMap) {
  if (!propertyMap) return;
  
  Object.keys(propertyMap).forEach(section => {
    Object.values(propertyMap[section]).forEach(block => {
      if (block && typeof block.setState === 'function') {
        block.setState(state);
      }
    });
  });
}

/**
 * Reset all properties to default values
 * @param {Object} propertyMap - Map of property blocks
 */
export function resetProperties(propertyMap) {
  if (!propertyMap) return;
  
  Object.keys(propertyMap).forEach(section => {
    Object.values(propertyMap[section]).forEach(block => {
      if (block) {
        if (typeof block.setValue === 'function') {
          // Get default value from block's options or use empty string
          const defaultValue = block.options && block.options.defaultValue !== undefined
            ? block.options.defaultValue
            : '';
          block.setValue(defaultValue, true);
        }
        
        if (typeof block.setState === 'function') {
          block.setState('default');
        }
      }
    });
  });
}

/**
 * Get all property blocks as an array
 * @return {Array<PropertyBlock>} - Array of all property blocks
 */
export function getAllPropertyBlocks() {
  const elements = document.querySelectorAll('.property-block');
  return Array.from(elements).map(el => new PropertyBlock(el));
}

// Create default export for backward compatibility
const PropertyBlockUtils = {
  createPropertyBlock,
  initPropertyBlocks,
  createPropertyBlocksForSection,
  findPropertyBlock,
  updatePropertyValue,
  setPropertyState,
  updateVisibilityByType
};

export default PropertyBlockUtils; 