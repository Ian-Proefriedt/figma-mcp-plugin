import PropertyBlockUtils from '../utils/PropertyBlockUtils.js';

/**
 * Main class for managing the property panel UI
 */
export class PropertyPanel {
  /**
   * Create a new PropertyPanel
   * @param {HTMLElement} container - The container element for the panel
   */
  constructor(container) {
    this.container = container;
    this.propertyMap = {
      layout: {},
      position: {},
      style: {},
      text: {}
    };
    this.currentNodeType = null;
    this.currentSelection = null;
    
    // Find the panel structure
    this.findPanelElements();
    
    // Create property blocks
    this.initializePropertyBlocks();
    
    // Listen for messages from the plugin
    this.setupMessageListeners();
  }
  
  /**
   * Find panel elements in the existing HTML structure
   */
  findPanelElements() {
    // Find sections container
    this.sectionsContainer = this.container.querySelector('.plugin-container');
    
    // Find each properties grid
    this.layoutGrid = document.getElementById('layout-properties');
    this.positionGrid = document.getElementById('position-size-properties');
    this.styleGrid = document.getElementById('style-properties');
    this.textGrid = document.getElementById('text-properties');
    this.undefinedGrid = document.querySelector('.undefined-properties .properties-grid');
    
    // Setup section toggles if not already set up
    document.querySelectorAll('.section-header').forEach(header => {
      if (!header.hasClickListener) {
        header.addEventListener('click', () => {
          const section = header.closest('.section');
          section.classList.toggle('collapsed');
          header.hasClickListener = true;
        });
      }
    });
  }
  
  /**
   * Initialize all property blocks in their respective sections
   */
  async initializePropertyBlocks() {
    // Layout properties
    await this.createLayoutProperties();
    
    // Position properties
    await this.createPositionProperties();
    
    // Style properties
    await this.createStyleProperties();
    
    // Text properties
    await this.createTextProperties();
  }
  
  /**
   * Create layout property blocks
   */
  async createLayoutProperties() {
    // Auto Layout Type
    this.propertyMap.layout.type = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'type',
      {
        label: 'Auto Layout',
        options: [
          { value: 'NONE', label: 'None' },
          { value: 'HORIZONTAL', label: 'Horizontal' },
          { value: 'VERTICAL', label: 'Vertical' }
        ],
        defaultValue: 'NONE',
        onChange: (value) => this.handlePropertyChange('layoutMode', value)
      },
      this.layoutGrid
    );
    
    // Direction (only visible when auto layout is enabled)
    this.propertyMap.layout.direction = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'direction',
      {
        label: 'Direction',
        options: [
          { value: 'HORIZONTAL', label: 'Horizontal' },
          { value: 'VERTICAL', label: 'Vertical' }
        ],
        defaultValue: 'HORIZONTAL',
        onChange: (value) => this.handlePropertyChange('layoutMode', value)
      },
      this.layoutGrid
    );
    
    // Align
    this.propertyMap.layout.align = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'align',
      {
        label: 'Align',
        options: [
          { value: 'START', label: 'Start' },
          { value: 'CENTER', label: 'Center' },
          { value: 'END', label: 'End' },
          { value: 'SPACE_BETWEEN', label: 'Space Between' }
        ],
        defaultValue: 'START',
        onChange: (value) => this.handlePropertyChange('primaryAxisAlignItems', value)
      },
      this.layoutGrid
    );
    
    // Justify
    this.propertyMap.layout.justify = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'justify',
      {
        label: 'Justify',
        options: [
          { value: 'START', label: 'Start' },
          { value: 'CENTER', label: 'Center' },
          { value: 'END', label: 'End' }
        ],
        defaultValue: 'START',
        onChange: (value) => this.handlePropertyChange('counterAxisAlignItems', value)
      },
      this.layoutGrid
    );
    
    // Gap
    this.propertyMap.layout.gap = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'gap',
      {
        label: 'Gap',
        min: 0,
        max: 500,
        defaultValue: 0,
        onChange: (value) => this.handlePropertyChange('itemSpacing', value)
      },
      this.layoutGrid
    );
  }
  
  /**
   * Create position & size property blocks
   */
  async createPositionProperties() {
    // Z-index
    this.propertyMap.position['z-index'] = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'z-index',
      {
        label: 'Z-Index',
        min: 0,
        max: 9999,
        defaultValue: 0,
        onChange: (value) => this.handlePropertyChange('zIndex', value)
      },
      this.positionGrid
    );
    
    // Positioning
    this.propertyMap.position.positioning = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'positioning',
      {
        label: 'Position',
        options: [
          { value: 'AUTO', label: 'Auto' },
          { value: 'ABSOLUTE', label: 'Absolute' }
        ],
        defaultValue: 'AUTO',
        onChange: (value) => this.handlePropertyChange('positioning', value)
      },
      this.positionGrid
    );
    
    // Rotation
    this.propertyMap.position.rotation = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'rotation',
      {
        label: 'Rotation',
        min: -360,
        max: 360,
        defaultValue: 0,
        onChange: (value) => this.handlePropertyChange('rotation', value)
      },
      this.positionGrid
    );
  }
  
  /**
   * Create style property blocks
   */
  async createStyleProperties() {
    // Fill color
    this.propertyMap.style.fill = await PropertyBlockUtils.createPropertyBlock(
      'color',
      'fill',
      {
        label: 'Fill',
        defaultValue: '#FFFFFF',
        onChange: (value) => this.handlePropertyChange('fills', [
          { type: 'SOLID', color: value, opacity: 1 }
        ])
      },
      this.styleGrid
    );
    
    // Stroke color
    this.propertyMap.style.stroke = await PropertyBlockUtils.createPropertyBlock(
      'color',
      'stroke',
      {
        label: 'Stroke',
        defaultValue: 'transparent',
        onChange: (value) => this.handlePropertyChange('strokes', [
          { type: 'SOLID', color: value, opacity: 1 }
        ])
      },
      this.styleGrid
    );
    
    // Corner radius
    this.propertyMap.style.radius = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'radius',
      {
        label: 'Radius',
        min: 0,
        max: 500,
        defaultValue: 0,
        onChange: (value) => this.handlePropertyChange('cornerRadius', value)
      },
      this.styleGrid
    );
    
    // Opacity
    this.propertyMap.style.opacity = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'opacity',
      {
        label: 'Opacity',
        min: 0,
        max: 100,
        defaultValue: 100,
        onChange: (value) => this.handlePropertyChange('opacity', value / 100)
      },
      this.styleGrid
    );
    
    // Blend mode
    this.propertyMap.style.blend = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'blend',
      {
        label: 'Blend',
        options: [
          { value: 'NORMAL', label: 'Normal' },
          { value: 'MULTIPLY', label: 'Multiply' },
          { value: 'SCREEN', label: 'Screen' },
          { value: 'OVERLAY', label: 'Overlay' }
        ],
        defaultValue: 'NORMAL',
        onChange: (value) => this.handlePropertyChange('blendMode', value)
      },
      this.styleGrid
    );
  }
  
  /**
   * Create text property blocks
   */
  async createTextProperties() {
    // Font size
    this.propertyMap.text['font-size'] = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'font-size',
      {
        label: 'Size',
        min: 1,
        max: 500,
        defaultValue: 14,
        onChange: (value) => this.handlePropertyChange('fontSize', value)
      },
      this.textGrid
    );
    
    // Font family
    this.propertyMap.text['font-family'] = await PropertyBlockUtils.createPropertyBlock(
      'text',
      'font-family',
      {
        label: 'Font',
        defaultValue: 'Inter',
        onChange: (value) => this.handlePropertyChange('fontName', { 
          family: value, 
          style: this.currentSelection?.fontName?.style || 'Regular' 
        })
      },
      this.textGrid
    );
    
    // Text color
    this.propertyMap.text.color = await PropertyBlockUtils.createPropertyBlock(
      'color',
      'color',
      {
        label: 'Color',
        defaultValue: '#000000',
        onChange: (value) => this.handlePropertyChange('fills', [
          { type: 'SOLID', color: value, opacity: 1 }
        ])
      },
      this.textGrid
    );
    
    // Text alignment
    this.propertyMap.text['text-align'] = await PropertyBlockUtils.createPropertyBlock(
      'dropdown',
      'text-align',
      {
        label: 'Align',
        options: [
          { value: 'LEFT', label: 'Left' },
          { value: 'CENTER', label: 'Center' },
          { value: 'RIGHT', label: 'Right' },
          { value: 'JUSTIFIED', label: 'Justified' }
        ],
        defaultValue: 'LEFT',
        onChange: (value) => this.handlePropertyChange('textAlignHorizontal', value)
      },
      this.textGrid
    );
    
    // Line height
    this.propertyMap.text['line-height'] = await PropertyBlockUtils.createPropertyBlock(
      'text',
      'line-height',
      {
        label: 'Line Height',
        defaultValue: 'AUTO',
        onChange: (value) => {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            this.handlePropertyChange('lineHeight', { 
              value: numValue, 
              unit: 'PIXELS' 
            });
          } else if (value.toLowerCase() === 'auto') {
            this.handlePropertyChange('lineHeight', { 
              value: 'AUTO', 
              unit: 'AUTO' 
            });
          }
        }
      },
      this.textGrid
    );
    
    // Letter spacing
    this.propertyMap.text['letter-spacing'] = await PropertyBlockUtils.createPropertyBlock(
      'number',
      'letter-spacing',
      {
        label: 'Letter Spacing',
        min: -20,
        max: 100,
        defaultValue: 0,
        onChange: (value) => this.handlePropertyChange('letterSpacing', { 
          value: value, 
          unit: 'PIXELS' 
        })
      },
      this.textGrid
    );
  }
  
  /**
   * Handle property changes
   * @param {string} property - The property name to change
   * @param {any} value - The new value
   */
  handlePropertyChange(property, value) {
    // Send message to plugin with the property change
    parent.postMessage({
      pluginMessage: {
        type: 'property-change',
        property: property,
        value: value
      }
    }, '*');
  }
  
  /**
   * Set up message listeners for plugin communication
   */
  setupMessageListeners() {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (!message) return;
      
      switch (message.type) {
        case 'selection-changed':
          this.updateUI(message.data);
          break;
        case 'property-update':
          this.updateProperty(message.property, message.value);
          break;
        case 'reset-panel':
          this.resetPanel();
          break;
      }
    };
  }
  
  /**
   * Update the UI with selection data
   * @param {Object} data - The selection data
   */
  updateUI(data) {
    // Store current selection data
    this.currentSelection = data;
    this.currentNodeType = data?.type || null;
    
    if (!data || !data.type) {
      // No selection, reset panel
      this.resetPanel();
      return;
    }
    
    // Update property visibility based on node type
    PropertyBlockUtils.updateVisibilityByType(data.type, this.propertyMap);
    
    // Update property values
    PropertyBlockUtils.updatePropertyValues(data, this.propertyMap);
    
    // Set property states
    PropertyBlockUtils.setPropertyStates('default', this.propertyMap);
  }
  
  /**
   * Update a specific property
   * @param {string} property - The property name
   * @param {any} value - The new value
   */
  updateProperty(property, value) {
    // Map the property name to the corresponding property block
    const propertyMappings = {
      'layoutMode': { section: 'layout', prop: 'type' },
      'primaryAxisAlignItems': { section: 'layout', prop: 'align' },
      'counterAxisAlignItems': { section: 'layout', prop: 'justify' },
      'itemSpacing': { section: 'layout', prop: 'gap' },
      'zIndex': { section: 'position', prop: 'z-index' },
      'positioning': { section: 'position', prop: 'positioning' },
      'rotation': { section: 'position', prop: 'rotation' },
      'cornerRadius': { section: 'style', prop: 'radius' },
      'opacity': { section: 'style', prop: 'opacity' },
      'blendMode': { section: 'style', prop: 'blend' },
      'fontSize': { section: 'text', prop: 'font-size' },
      'textAlignHorizontal': { section: 'text', prop: 'text-align' }
    };
    
    // Special cases for compound properties
    if (property === 'fills' && value && value.length > 0) {
      // Handle fill color for both text and non-text elements
      if (this.currentNodeType === 'TEXT') {
        const block = this.propertyMap.text.color;
        if (block) block.setValue(value[0].color, true);
      } else {
        const block = this.propertyMap.style.fill;
        if (block) block.setValue(value[0].color, true);
      }
    } else if (property === 'strokes' && value && value.length > 0) {
      const block = this.propertyMap.style.stroke;
      if (block) block.setValue(value[0].color, true);
    } else if (property === 'fontName') {
      const familyBlock = this.propertyMap.text['font-family'];
      if (familyBlock && value) familyBlock.setValue(value.family, true);
    } else if (property === 'lineHeight') {
      const block = this.propertyMap.text['line-height'];
      if (block && value) {
        if (value.unit === 'AUTO') {
          block.setValue('AUTO', true);
        } else {
          block.setValue(value.value.toString(), true);
        }
      }
    } else if (property === 'letterSpacing') {
      const block = this.propertyMap.text['letter-spacing'];
      if (block && value) block.setValue(value.value, true);
    } else {
      // Handle simple properties
      const mapping = propertyMappings[property];
      if (mapping) {
        const section = mapping.section;
        const prop = mapping.prop;
        const block = this.propertyMap[section][prop];
        
        if (block) {
          // Special case for opacity that comes as 0-1
          if (prop === 'opacity' && typeof value === 'number') {
            block.setValue(value * 100, true);
          } else {
            block.setValue(value, true);
          }
        }
      }
    }
  }
  
  /**
   * Reset the panel to default state
   */
  resetPanel() {
    // Hide all property blocks for TEXT sections when no TEXT is selected
    if (this.currentNodeType !== 'TEXT') {
      Object.keys(this.propertyMap.text).forEach(prop => {
        const block = this.propertyMap.text[prop];
        if (block) block.setVisible(false);
      });
    }
    
    // Reset current selection
    this.currentSelection = null;
    this.currentNodeType = null;
    
    // Reset all properties to default values
    PropertyBlockUtils.resetProperties(this.propertyMap);
  }
} 