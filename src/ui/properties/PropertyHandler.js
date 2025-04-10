/**
 * Property Handler for managing property updates and UI interaction
 */

import { PropertyRegistry } from './PropertyRegistry.js';

// Export the handler as a module
export const PropertyHandler = {
  // Update a single property by name
  updateProperty: function(propertyName, data) {
    const definition = PropertyRegistry[propertyName];
    if (!definition) {
      window.Logger.warn('Properties', `No definition found for property: ${propertyName}`);
      return false;
    }
    
    const valueEl = document.querySelector(`[data-property="${propertyName}"] .property-value`);
    if (!valueEl) {
      window.Logger.debug('Properties', `Element not found for property: ${propertyName}`);
      return false;
    }
    
    try {
      const value = definition.getValue(data);
      definition.render(valueEl, value);
      
      window.Logger.debug('Properties', `Updated ${propertyName}`, {
        property: propertyName,
        value: typeof value === 'object' ? '[complex]' : value
      });
      
      // Also update AppState for backward compatibility
      if (typeof value === 'object') {
        // For complex properties like fill, we don't update AppState
      } else {
        window.AppState.updatePropertyValue(propertyName, value);
      }
      
      return true;
    } catch (error) {
      window.Logger.error('Properties', `Error updating property ${propertyName}`, error);
      return false;
    }
  },
  
  // Update multiple properties at once
  updateProperties: function(propertyNames, data) {
    window.Logger.debug('Properties', `Updating multiple properties: ${propertyNames.join(', ')}`);
    propertyNames.forEach(name => this.updateProperty(name, data));
  },
  
  // Update all properties
  updateAllProperties: function(data) {
    window.Logger.info('Properties', 'Updating all properties', { 
      dataType: data && data.type, 
      properties: Object.keys(PropertyRegistry).length 
    });
    
    window.Logger.debug('Properties', 'PropertyHandler.updateAllProperties - Data', data);
    window.Logger.debug('Properties', 'PropertyHandler.updateAllProperties - PropertyRegistry', Object.keys(PropertyRegistry));
    
    // Generate debug information before updating
    this.debugPropertyValues(data);
    
    // Create a collection of all property values for a summary
    const propertyValues = {};
    
    Object.keys(PropertyRegistry).forEach(name => {
      try {
        const definition = PropertyRegistry[name];
        // Store the interpreted value for summary
        propertyValues[name] = definition.getValue(data);
      } catch (error) {
        propertyValues[name] = `ERROR: ${error.message}`;
      }
      
      // Update the UI with the value
      this.updateProperty(name, data);
    });
    
    // Log a scannable summary of all properties
    this.logPropertySummary(propertyValues, data);
  },
  
  // Log a scannable summary table of all properties
  logPropertySummary: function(propertyValues, data) {
    // Make sure there's data and debug level
    if (!data || !window.Logger || !window.Logger.LEVELS || window.Logger.level > window.Logger.LEVELS.DEBUG) return;
    
    // Group properties by category
    const layout = {};
    const position = {};
    const style = {};
    const text = {};
    
    // Sort properties into categories
    Object.entries(propertyValues).forEach(([name, value]) => {
      const definition = PropertyRegistry[name];
      if (!definition) return;
      
      // Skip nullish/empty values
      if (value === undefined || value === null || value === '') return;
      
      // Format value for logging
      const logValue = typeof value === 'object' ? '[object]' : String(value);
      
      switch (definition.section) {
        case 'layout':
          layout[name] = logValue;
          break;
        case 'position-size':
          position[name] = logValue;
          break;
        case 'style':
          style[name] = logValue;
          break;
        case 'text':
          text[name] = logValue;
          break;
      }
    });
    
    // Log properties by section
    window.Logger.debug('Properties', `Node ${data.name} (${data.type}) summary:`);
    
    if (Object.keys(layout).length > 0) {
      window.Logger.debug('Properties', 'Layout', layout);
    }
    
    if (Object.keys(position).length > 0) {
      window.Logger.debug('Properties', 'Position & Size', position);
    }
    
    if (Object.keys(style).length > 0) {
      window.Logger.debug('Properties', 'Style', style);
    }
    
    if (Object.keys(text).length > 0) {
      window.Logger.debug('Properties', 'Text', text);
    }
  },
  
  // Debug property values - generate a detailed comparison of raw vs interpreted values
  debugPropertyValues: function(data) {
    if (!data) return;
    
    // Only log in DEBUG level
    if (!window.Logger || !window.Logger.LEVELS || window.Logger.level > window.Logger.LEVELS.DEBUG) return;
    
    console.group(`=== Property Values for Node: ${data.name} (${data.id}) ===`);
    
    // For each property in the registry
    Object.entries(PropertyRegistry).forEach(([propName, definition]) => {
      try {
        // Get the raw property path from the definition
        let rawValue = '[No path info]';
        let rawValueString = '';
        
        // Get raw value based on property name and typical paths
        if (propName === 'type' || propName === 'direction') {
          rawValue = data.layout && data.layout.autoLayout && data.layout.autoLayout.mode;
          rawValueString = `data.layout.autoLayout.mode = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'align') {
          rawValue = data.layout && data.layout.autoLayout && data.layout.autoLayout.counterAxis && data.layout.autoLayout.counterAxis.alignItems;
          rawValueString = `data.layout.autoLayout.counterAxis.alignItems = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'justify') {
          rawValue = data.layout && data.layout.autoLayout && data.layout.autoLayout.primaryAxis && data.layout.autoLayout.primaryAxis.alignItems;
          rawValueString = `data.layout.autoLayout.primaryAxis.alignItems = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'gap') {
          rawValue = data.layout && data.layout.autoLayout && data.layout.autoLayout.spacing && data.layout.autoLayout.spacing.items;
          rawValueString = `data.layout.autoLayout.spacing.items = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'overflow') {
          rawValue = data.clipsContent;
          rawValueString = `data.clipsContent = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'z-index') {
          rawValue = data.zIndex;
          rawValueString = `data.zIndex = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'positioning') {
          rawValue = {
            layout: data.layout && data.layout.type,
            parent: data.layout && data.layout.parent && data.layout.parent.type,
            parentLayoutMode: data.layout && data.layout.parent && data.layout.parent.layoutMode,
            positioning: data.layout && data.layout.positioning,
            ignoresAutoLayout: data.layout && data.layout.isIgnoringAutoLayout
          };
          rawValueString = `data.layout.[multiple] = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'rotation') {
          rawValue = data.rotation;
          rawValueString = `data.rotation = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'fill') {
          rawValue = data.visual && data.visual.fills;
          rawValueString = `data.visual.fills = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'stroke') {
          rawValue = data.visual && data.visual.strokes;
          rawValueString = `data.visual.strokes = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'radius') {
          rawValue = data.visual && data.visual.cornerRadius;
          rawValueString = `data.visual.cornerRadius = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'blend') {
          rawValue = data.visual && data.visual.blendMode;
          rawValueString = `data.visual.blendMode = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'shadow') {
          rawValue = data.visual && data.visual.shadows;
          rawValueString = `data.visual.shadows = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'font-size') {
          rawValue = data.text && data.text.style && data.text.style.fontSize;
          rawValueString = `data.text.style.fontSize = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'color') {
          rawValue = data.text && data.text.style && data.text.style.color;
          rawValueString = `data.text.style.color = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'alignment') {
          rawValue = data.text && data.text.style && data.text.style.alignment && data.text.style.alignment.horizontal;
          rawValueString = `data.text.style.alignment.horizontal = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'line-height') {
          rawValue = data.text && data.text.style && data.text.style.spacing && data.text.style.spacing.line;
          rawValueString = `data.text.style.spacing.line = ${JSON.stringify(rawValue)}`;
        } else if (propName === 'letter-spacing') {
          rawValue = data.text && data.text.style && data.text.style.spacing && data.text.style.spacing.letter;
          rawValueString = `data.text.style.spacing.letter = ${JSON.stringify(rawValue)}`;
        }
        
        // Get the interpreted value
        let interpretedValue;
        try {
          interpretedValue = definition.getValue ? definition.getValue(data) : '[No getValue function]';
        } catch (error) {
          interpretedValue = `ERROR: ${error.message}`;
          window.Logger.error('Properties', `Error getting interpreted value for ${propName}`, error);
        }
        
        console.log(`Property: ${propName}`);
        console.log(`  Raw: ${rawValueString}`);
        console.log(`  Interpreted: ${JSON.stringify(interpretedValue)}`);
        
      } catch (error) {
        window.Logger.error('Properties', `Error in debugPropertyValues for ${propName}`, error);
      }
    });
    
    console.groupEnd();
  },
  
  // Update properties by category
  updateCategory: function(category, data) {
    // Find all properties in the given category
    const propertiesToUpdate = Object.entries(PropertyRegistry)
      .filter(([_, def]) => def.section === category)
      .map(([name, _]) => name);
      
    window.Logger.debug('Properties', `Updating ${category} properties`, { count: propertiesToUpdate.length });
    this.updateProperties(propertiesToUpdate, data);
  }
};

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.PropertyHandler = PropertyHandler;
} 