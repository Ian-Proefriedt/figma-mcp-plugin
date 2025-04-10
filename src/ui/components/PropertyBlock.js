import { Logger } from '../index.js';

/**
 * PropertyBlock component for rendering property UI elements
 */

/**
 * PropertyBlock class - core class for property blocks
 */
export class PropertyBlock {
  /**
   * Create a new PropertyBlock
   * @param {string} type - Type of property (dropdown, number, text, etc)
   * @param {string} name - Property name
   * @param {object} options - Configuration options
   * @param {HTMLElement} element - Container element
   */
  constructor(type, name, options = {}, element) {
    this.type = type;
    this.name = name;
    this.options = options;
    this.element = element || this.createBlockElement();
    this.valueContainer = null;
    this.input = null;
    this.isInitialized = false;
    
    // Initialize the block UI
    this.initialize();
  }
  
  /**
   * Create the DOM structure for this property block
   * @private
   */
  createBlockElement() {
    const block = document.createElement('div');
    block.className = 'property-block';
    block.dataset.property = this.name;
    block.dataset.propertyType = this.type;
    
    return block;
  }
  
  /**
   * Initialize the property block UI
   * @private
   */
  initialize() {
    if (this.isInitialized) return;
    
    // Create the label
    const label = document.createElement('div');
    label.className = 'property-label';
    label.textContent = this.options.label || this.name;
    this.element.appendChild(label);
    
    // Create the value container
    this.valueContainer = document.createElement('div');
    this.valueContainer.className = 'property-value';
    this.element.appendChild(this.valueContainer);
    
    // Initialize based on property type
    switch (this.type) {
      case 'dropdown':
        this.initDropdown();
        break;
      case 'number':
        this.initNumber();
        break;
      case 'text':
        this.initText();
        break;
      default:
        Logger.warn('PropertyBlock', `Unknown property type: ${this.type}`);
        this.initText(); // Default to text
    }
    
    // Add reset button
    this.addResetButton();
    
    this.isInitialized = true;
  }
  
  /**
   * Initialize dropdown property type
   * @private
   */
  initDropdown() {
    const select = document.createElement('select');
    select.className = 'property-input';
    
    // Add options
    if (this.options.options && Array.isArray(this.options.options)) {
      this.options.options.forEach(option => {
        const optElement = document.createElement('option');
        
        if (typeof option === 'object') {
          optElement.value = option.value;
          optElement.textContent = option.label || option.value;
        } else {
          optElement.value = option;
          optElement.textContent = option;
        }
        
        select.appendChild(optElement);
      });
    }
    
    // Handle change events
    select.addEventListener('change', () => {
      this.element.dataset.state = 'modified';
      
      // Trigger onchange if available
      if (typeof this.options.onChange === 'function') {
        this.options.onChange(select.value, this);
      }
      
      // Dispatch custom event
      const event = new CustomEvent('property:change', {
        detail: {
          property: this.name,
          value: select.value
        },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    });
    
    this.valueContainer.appendChild(select);
    this.input = select;
  }
  
  /**
   * Initialize number property type
   * @private
   */
  initNumber() {
    const container = document.createElement('div');
    container.className = 'number-input-container';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'property-input number-input';
    
    // Set attributes from options
    if (this.options.min !== undefined) input.min = this.options.min;
    if (this.options.max !== undefined) input.max = this.options.max;
    if (this.options.step !== undefined) input.step = this.options.step;
    
    // Handle change events
    input.addEventListener('change', () => {
      this.element.dataset.state = 'modified';
      
      // Trigger onchange if available
      if (typeof this.options.onChange === 'function') {
        this.options.onChange(input.value, this);
      }
      
      // Dispatch custom event
      const event = new CustomEvent('property:change', {
        detail: {
          property: this.name,
          value: parseFloat(input.value)
        },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    });
    
    container.appendChild(input);
    
    // Add unit label if provided
    if (this.options.unit) {
      const unitLabel = document.createElement('span');
      unitLabel.className = 'unit-label';
      unitLabel.textContent = this.options.unit;
      container.appendChild(unitLabel);
    }
    
    this.valueContainer.appendChild(container);
    this.input = input;
  }
  
  /**
   * Initialize text property type
   * @private
   */
  initText() {
    let input;
    
    if (this.options.multiline) {
      input = document.createElement('textarea');
      input.rows = this.options.rows || 3;
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }
    
    input.className = 'property-input text-input';
    
    // Handle change events
    input.addEventListener('change', () => {
      this.element.dataset.state = 'modified';
      
      // Trigger onchange if available
      if (typeof this.options.onChange === 'function') {
        this.options.onChange(input.value, this);
      }
      
      // Dispatch custom event
      const event = new CustomEvent('property:change', {
        detail: {
          property: this.name,
          value: input.value
        },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    });
    
    this.valueContainer.appendChild(input);
    this.input = input;
  }
  
  /**
   * Add reset button to the property block
   * @private
   */
  addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.title = 'Reset to default';
    resetButton.innerHTML = '&#10226;'; // ↺ symbol
    
    resetButton.addEventListener('click', () => {
      this.setState('default');
      
      // Set default value if available
      if (this.options.defaultValue !== undefined) {
        this.setValue(this.options.defaultValue);
      } else {
        // Clear the input
        this.setValue('');
      }
      
      // Trigger onreset if available
      if (typeof this.options.onReset === 'function') {
        this.options.onReset(this);
      }
      
      // Dispatch custom event
      const event = new CustomEvent('property:reset', {
        detail: {
          property: this.name
        },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    });
    
    this.element.appendChild(resetButton);
  }
  
  /**
   * Set the value of the property
   * @param {*} value - The value to set
   * @returns {PropertyBlock} - This instance for chaining
   */
  setValue(value) {
    // Skip if not initialized
    if (!this.input) return this;
    
    // Check if we have a custom render function
    if (this.render && this.valueContainer) {
      // Clear existing rendered content
      const existingPreview = this.valueContainer.querySelector('.custom-preview');
      if (existingPreview) {
        existingPreview.remove();
      }
      
      // Render new preview
      const preview = this.render(value);
      if (preview) {
        preview.classList.add('custom-preview');
        this.valueContainer.appendChild(preview);
      }
    }
    
    // Set value in the input
    switch (this.type) {
      case 'dropdown':
        // Find matching option
        if (this.input.tagName === 'SELECT') {
          const options = Array.from(this.input.options);
          const option = options.find(opt => opt.value === String(value));
          
          if (option) {
            this.input.value = option.value;
          } else if (options.length > 0) {
            // If no match, set to first option
            this.input.value = options[0].value;
          }
        }
        break;
        
      case 'number':
        this.input.value = value !== undefined && value !== null ? value : '';
        break;
        
      case 'text':
      default:
        this.input.value = value !== undefined && value !== null ? value : '';
        break;
    }
    
    return this;
  }
  
  /**
   * Set the state of the property block
   * @param {string} state - The state to set ('default', 'modified', 'locked', 'editing')
   * @returns {PropertyBlock} - This instance for chaining
   */
  setState(state) {
    if (['default', 'modified', 'locked', 'editing'].includes(state)) {
      this.element.dataset.state = state;
    }
    return this;
  }
  
  /**
   * Get the current state of the property block
   * @returns {string} - The current state
   */
  getState() {
    return this.element.dataset.state || 'default';
  }
  
  /**
   * Set the visibility of the property block
   * @param {boolean} isVisible - Whether the block should be visible
   * @returns {PropertyBlock} - This instance for chaining
   */
  setVisible(isVisible) {
    this.element.style.display = isVisible ? 'flex' : 'none';
    return this;
  }
}

/**
 * Base behavior class for property blocks
 */
export class Behavior {
  constructor() {
    this.block = null;
  }
  
  initialize(block) {
    this.block = block;
  }
  
  renderValue(value, container) {
    container.textContent = value;
  }
  
  onValueChange(value, container) {
    this.renderValue(value, container);
  }
  
  onStateChange(state) {
    // Handle state change
  }
}

/**
 * Base class for behaviors that handle editing
 */
export class EditBehavior extends Behavior {
  constructor(options = {}) {
    super();
    this.options = options;
    this.isEditing = false;
  }
  
  initialize(block) {
    super.initialize(block);
    
    // Add click handler to start editing
    this.block.element.addEventListener('click', (e) => {
      if (this.block.getState() !== 'locked') {
        this.startEditing();
      }
    });
  }
  
  startEditing() {
    if (this.isEditing) return;
    
    this.isEditing = true;
    this.block.setState('editing');
    this.renderEditableValue();
    
    // Add click outside handler to stop editing
    document.addEventListener('click', this.handleClickOutside = (e) => {
      if (!this.block.element.contains(e.target)) {
        this.stopEditing();
      }
    });
  }
  
  stopEditing() {
    if (!this.isEditing) return;
    
    this.isEditing = false;
    this.block.setState(this.block.element.classList.contains('manually-edited') ? 'modified' : 'default');
    
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside);
  }
  
  renderEditableValue() {
    // To be implemented by subclasses
  }
}

/**
 * Behavior for number inputs
 */
export class NumberInputBehavior extends EditBehavior {
  constructor(options = {}) {
    super(options);
    this.min = options.min !== undefined ? options.min : -Infinity;
    this.max = options.max !== undefined ? options.max : Infinity;
    this.step = options.step || 1;
    this.unit = options.unit || '';
  }
  
  renderValue(value, container) {
    // Clear existing content
    container.innerHTML = '';
    
    // Format value with unit if provided
    const formattedValue = `${value}${this.unit}`;
    container.textContent = formattedValue;
  }
  
  renderEditableValue() {
    const valueContainer = this.block.element.querySelector('.property-value');
    if (!valueContainer) return;
    
    // Clear existing content
    valueContainer.innerHTML = '';
    
    // Create input
    const input = document.createElement('input');
    input.type = 'number';
    input.min = this.min;
    input.max = this.max;
    input.step = this.step;
    
    // Remove unit for editing
    const currentValue = this.block.getValue();
    const numericValue = parseFloat(currentValue);
    input.value = isNaN(numericValue) ? 0 : numericValue;
    
    // Handle input
    input.addEventListener('input', () => {
      const newValue = parseFloat(input.value);
      if (!isNaN(newValue)) {
        // Use setValue to update the value with the unit
        this.block.setValue(newValue);
        this.block.element.classList.add('manually-edited');
      }
    });
    
    // Add to container and focus
    valueContainer.appendChild(input);
    input.focus();
    input.select();
  }
}

/**
 * Behavior for reset button
 */
export class ResetButtonBehavior extends Behavior {
  constructor() {
    super();
    this.resetButton = null;
  }
  
  initialize(block) {
    super.initialize(block);
    
    // Create reset button
    this.resetButton = document.createElement('button');
    this.resetButton.className = 'reset-button';
    this.resetButton.title = 'Reset to original value';
    
    // Add click handler
    this.resetButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetToOriginal();
    });
    
    // Add button to the block
    this.block.element.appendChild(this.resetButton);
    
    // Initially hide the button
    this.resetButton.style.display = 'none';
    
    // Monitor for manually-edited class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.updateButtonVisibility();
        }
      });
    });
    
    observer.observe(this.block.element, { attributes: true });
  }
  
  updateButtonVisibility() {
    const isManuallyEdited = this.block.element.classList.contains('manually-edited');
    this.resetButton.style.display = isManuallyEdited ? 'flex' : 'none';
  }
  
  onValueChange(value, container) {
    const originalValue = container.dataset.originalContent;
    
    // Mark as manually edited if value differs from original
    if (originalValue !== undefined && String(value) !== originalValue) {
      this.block.element.classList.add('manually-edited');
    } else {
      this.block.element.classList.remove('manually-edited');
    }
    
    this.updateButtonVisibility();
  }
  
  resetToOriginal() {
    const valueContainer = this.block.element.querySelector('.property-value');
    if (!valueContainer || !valueContainer.dataset.originalContent) return;
    
    // Reset value to original
    this.block.setValue(valueContainer.dataset.originalContent);
    this.block.element.classList.remove('manually-edited');
    this.block.setState('default');
    
    // Hide the reset button
    this.updateButtonVisibility();
  }
}

/**
 * Behavior for dropdown selection
 */
export class DropdownBehavior extends EditBehavior {
  constructor(options = {}) {
    super(options);
    this.dropdownOptions = options.options || [];
  }
  
  renderValue(value, container) {
    // Clear existing content
    container.innerHTML = '';
    
    // Format display value
    let displayValue = value;
    
    // Handle object options with label/value 
    if (typeof value === 'string') {
      const matchingOption = this.dropdownOptions.find(option => 
        (typeof option === 'string' && option === value) ||
        (typeof option === 'object' && option.value === value)
      );
      
      if (matchingOption && typeof matchingOption === 'object' && matchingOption.label) {
        displayValue = matchingOption.label;
      }
    }
    
    // Display the value
    container.textContent = displayValue || this.dropdownOptions[0] || 'Select...';
    
    // Add dropdown indicator (arrow)
    if (!container.classList.contains('has-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'dropdown-indicator';
      indicator.innerHTML = '▼';
      indicator.style.fontSize = '8px';
      indicator.style.marginLeft = '4px';
      indicator.style.color = 'var(--property-label)';
      container.appendChild(indicator);
      container.classList.add('has-indicator');
    }
  }
  
  renderEditableValue() {
    const valueContainer = this.block.element.querySelector('.property-value');
    if (!valueContainer) {
      return;
    }
    
    // Clear existing content
    valueContainer.innerHTML = '';
    
    // Create select
    const select = document.createElement('select');
    
    // Add options
    this.dropdownOptions.forEach(option => {
      const optionElement = document.createElement('option');
      if (typeof option === 'object' && option.value !== undefined) {
        optionElement.value = option.value;
        optionElement.textContent = option.label || option.value;
      } else {
        optionElement.value = option;
        optionElement.textContent = option;
      }
      select.appendChild(optionElement);
    });
    
    // Set current value
    const currentValue = this.block.getValue();
    if (currentValue) {
      select.value = currentValue;
    }
    
    // Handle selection
    select.addEventListener('change', () => {
      const newValue = select.value;
      this.block.setValue(newValue);
      this.block.element.classList.add('manually-edited');
      
      // Auto-close dropdown after selection
      setTimeout(() => this.stopEditing(), 0);
    });
    
    // Add to container and focus
    valueContainer.appendChild(select);
    select.focus();
  }
}

/**
 * Behavior for text input
 */
export class TextBehavior extends EditBehavior {
  constructor(options = {}) {
    super(options);
    this.multiline = options.multiline || false;
  }
  
  renderValue(value, container) {
    // Special handling for complex values like color
    if (value && typeof value === 'object') {
      // Handle color display
      if (value.preview && value.text) {
        const colorPreview = container.querySelector('.property-color-preview');
        const colorValue = container.querySelector('.property-color-value');
        const opacityValue = container.querySelector('.property-opacity-value');
        
        if (colorPreview && value.preview) {
          const color = value.preview;
          colorPreview.style.backgroundColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
        }
        
        if (colorValue) {
          colorValue.textContent = value.text;
        }
        
        if (opacityValue && value.opacity !== undefined) {
          opacityValue.textContent = `${value.opacity}%`;
        }
        
        return;
      }
    } else {
      // Clear existing content for simple values
      container.innerHTML = '';
      
      // Display the value
      container.textContent = value || '';
    }
  }
  
  renderEditableValue() {
    const valueContainer = this.block.element.querySelector('.property-value');
    if (!valueContainer) return;
    
    // Store current HTML before clearing
    const originalHTML = valueContainer.innerHTML;
    
    // Clear existing content
    valueContainer.innerHTML = '';
    
    // Create input based on multiline option
    const input = this.multiline ? 
      document.createElement('textarea') : 
      document.createElement('input');
    
    if (!this.multiline) {
      input.type = 'text';
    }
    
    // Set current value 
    const currentValue = this.block.getValue();
    if (typeof currentValue === 'object' && currentValue.text) {
      input.value = currentValue.text;
    } else {
      input.value = currentValue || '';
    }
    
    // Handle input
    input.addEventListener('input', () => {
      const newValue = input.value;
      this.block.setValue(newValue);
      this.block.element.classList.add('manually-edited');
    });
    
    // Handle exit editing - restore original structure for complex properties
    input.addEventListener('blur', () => {
      if (typeof currentValue === 'object') {
        valueContainer.innerHTML = originalHTML;
        if (typeof currentValue.text !== 'undefined') {
          const colorValue = valueContainer.querySelector('.property-color-value');
          if (colorValue) {
            colorValue.textContent = input.value;
          }
        }
      }
    });
    
    // Add to container and focus
    valueContainer.appendChild(input);
    input.focus();
    input.select();
  }
}

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.PropertyBlock = PropertyBlock;
  window.Behavior = Behavior;
  window.EditBehavior = EditBehavior;
  window.NumberInputBehavior = NumberInputBehavior;
  window.ResetButtonBehavior = ResetButtonBehavior;
  window.DropdownBehavior = DropdownBehavior;
  window.TextBehavior = TextBehavior;
} 