/**
 * UI Factory for creating elements with standard patterns
 */

/**
 * UI Factory for creating elements with common patterns
 */
export const UIFactory = {
  /**
   * Create an element with common attributes
   * @param {string} tagName - HTML tag name
   * @param {Object} options - Element options
   * @param {string} [options.className] - CSS class name
   * @param {string} [options.id] - Element ID
   * @param {string} [options.textContent] - Text content
   * @returns {HTMLElement} The created element
   */
  createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.textContent) element.textContent = options.textContent;
    
    // Add attributes if specified
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([attr, value]) => {
        element.setAttribute(attr, value);
      });
    }
    
    // Add dataset values if specified
    if (options.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        element.dataset[key] = value;
      });
    }
    
    // Add styles if specified
    if (options.style) {
      Object.entries(options.style).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
    }
    
    return element;
  },
  
  /**
   * Create a button with standard properties
   * @param {string} text - Button text
   * @param {Function} onClick - Click handler
   * @param {string} [className] - Additional CSS class
   * @returns {HTMLButtonElement} The created button
   */
  createButton(text, onClick, className = '') {
    const button = this.createElement('button', { 
      textContent: text,
      className: `button ${className}`.trim()
    });
    
    if (onClick) button.addEventListener('click', onClick);
    
    return button;
  },
  
  /**
   * Create a section container
   * @param {string} title - Section title
   * @param {string} className - Additional CSS class
   * @returns {HTMLDivElement} The created section
   */
  createSection(title, className = '') {
    const section = this.createElement('div', {
      className: `section ${className}`.trim()
    });
    
    const header = this.createElement('h3', {
      textContent: title,
      className: 'section-header'
    });
    
    section.appendChild(header);
    
    // Add properties grid
    const grid = this.createElement('div', {
      className: 'properties-grid'
    });
    
    section.appendChild(grid);
    
    return section;
  },
  
  /**
   * Create a divider element
   * @returns {HTMLDivElement} The created divider
   */
  createDivider() {
    return this.createElement('div', {
      className: 'divider'
    });
  },
  
  /**
   * Create a label element
   * @param {string} text - Label text
   * @param {string} [forId] - ID of the element this label is for
   * @returns {HTMLLabelElement} The created label
   */
  createLabel(text, forId = '') {
    const label = this.createElement('label', {
      textContent: text,
      className: 'property-label'
    });
    
    if (forId) label.htmlFor = forId;
    
    return label;
  },
  
  /**
   * Create an input element
   * @param {string} type - Input type
   * @param {Object} options - Input options
   * @returns {HTMLInputElement} The created input
   */
  createInput(type, options = {}) {
    const input = this.createElement('input', {
      className: `input input-${type} ${options.className || ''}`.trim(),
      attributes: { type }
    });
    
    if (options.value !== undefined) input.value = options.value;
    if (options.placeholder) input.placeholder = options.placeholder;
    if (options.id) input.id = options.id;
    if (options.name) input.name = options.name;
    if (options.min !== undefined) input.min = options.min;
    if (options.max !== undefined) input.max = options.max;
    if (options.step !== undefined) input.step = options.step;
    
    return input;
  }
};

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.UIFactory = UIFactory;
}

export default UIFactory; 