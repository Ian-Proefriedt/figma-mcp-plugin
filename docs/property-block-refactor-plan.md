# Property Block Refactor Plan

## Table of Contents
1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Property Block Types](#property-block-types)
4. [Proposed Changes](#proposed-changes)
5. [Implementation Plan](#implementation-plan)
6. [Testing Strategy](#testing-strategy)
7. [Related Documentation](#related-documentation)

## Core Philosophy
- Focus on accurate data detection and passing to Cursor
- UI exists to show detected data and allow manual edits
- Clean, maintainable code structure
- Incremental implementation with thorough testing

## Current State
- Branch: `refactor/property-blocks`
- Backup created: `mcp/mcp-ui.html.backup`
- Main file: `mcp/mcp-ui.html`
- Plugin logic: `mcp/plugin.js`

## Critical Code Locations
1. Message Handler: `mcp/mcp-ui.html:2255-2270`
   - Handles communication with Figma
   - Processes selection and raw node data
   - Updates UI based on received data

2. Section Visibility: `mcp/mcp-ui.html:1550-1570`
   - Manages which sections are shown/hidden
   - Based on selected layer type

3. Data Detection: `mcp/mcp-ui.html:1600-1650`
   - Detects properties from Figma data
   - Updates property blocks with detected values

## Property Block Types

The plugin features four distinct types of property blocks:

1. **Single-Input Blocks**
   - One value per property (e.g., Z-Index, Gap, Rotation)
   - Basic text/number input fields

2. **Multi-Input Blocks**
   - Single property with multiple related values
   - Examples: Padding (T,R,B,L), Size (X,Y), Position (X,Y)

3. **Dropdown Blocks**
   - Properties with predefined value sets
   - Examples: Type, Direction, Overflow, Constraints

4. **Specialized Multi-Input Blocks**
   - Color: Hex code string + opacity percentage
   - Stroke: Type dropdown + thickness value

Each block type requires specific behaviors for property detection, display, validation, and potential editing.

## Proposed Changes

The refactored property block implementation will focus on:

1. **Component-Based Architecture**
   - Create modular, reusable property block components
   - Use composition with behaviors for flexibility
   - Improve code maintainability and testability

2. **Enhanced User Experience**
   - Consistent interaction patterns across all block types
   - Clear visual states (default, editing, modified)
   - Improved validation and error feedback

3. **Optimized Performance**
   - Minimize DOM operations
   - Use event delegation
   - Efficient state management

## Implementation Plan

The implementation of the property block refactor will follow a phased approach with clear milestones and deliverables. This plan ensures that we can incrementally build and test each component while maintaining the existing functionality.

### Phase 1: Foundation (Week 1)

1. **Setup & Cleanup**
   - Create branch for refactor work
   - Remove existing property block code
   - Establish basic CSS variables and design tokens
   - Create empty behavior classes

2. **Core Component Architecture**
   - Implement base `PropertyBlock` class
   - Create behavior system architecture
   - Build basic state management
   - Setup event delegation system

3. **Deliverables**
   - Working base component with state transitions
   - Unit tests for core functionality
   - Documentation of architecture decisions

### Phase 2: Basic Block Types (Week 2)

1. **Single-Input Blocks**
   - Implement `NumberInputBehavior`
   - Create basic number input components
   - Add validation logic
   - Test with z-index, rotation, and gap properties

2. **Dropdown Blocks**
   - Implement `DropdownBehavior`
   - Create dropdown component with options
   - Add selection logic
   - Test with type, overflow, and positioning properties

3. **Deliverables**
   - Functional single-input blocks with all states
   - Functional dropdown blocks with all states
   - Integration tests for property detection and display

### Phase 3: Advanced Block Types (Week 3)

1. **Multi-Input Blocks**
   - Implement `MultiInputBehavior`
   - Create containers for multiple inputs
   - Add coordinated state management
   - Test with position, size, and padding properties

2. **Specialized Multi-Input Blocks**
   - Implement specialized behaviors for color and stroke
   - Add property-specific validation
   - Integrate with existing data structures

3. **Deliverables**
   - Complete set of working property blocks
   - All state transitions and validations functional
   - Full test coverage for all block types

### Phase 4: Integration & Optimization (Week 4)

1. **Layer Tree Integration**
   - Connect property blocks to layer selection
   - Implement property detection for all layer types
   - Add efficient update mechanism

2. **Send to Cursor Feature**
   - Implement the send to Cursor button
   - Create confirmation dialog
   - Add data transformation for Cursor format

3. **Performance Optimization**
   - Conduct performance testing
   - Optimize render cycles
   - Minimize DOM operations

4. **Deliverables**
   - Fully functional plugin with refactored property blocks
   - Performance metrics showing improvements
   - Complete documentation of the implementation

### Success Criteria

The implementation will be considered successful when:

1. All property block types render correctly and maintain state
2. Property detection works reliably for all Figma layer types
3. Editing and validation functions work as expected
4. Send to Cursor functionality correctly transmits data
5. Performance is equal to or better than the previous implementation
6. Code is well-documented and maintainable

### Dependencies and Risks

1. **Dependencies**
   - Figma Plugin API constraints
   - Existing data detection logic
   - Cursor integration requirements

2. **Risk Mitigation**
   - Create detailed fallback mechanisms
   - Implement feature flags for gradual rollout
   - Maintain backward compatibility where possible

## Testing Strategy

The testing approach for the property block refactor will be practical and focused on direct verification in the Figma plugin environment.

### 1. Manual Testing in Figma Plugin

1. **Block Type Testing**
   - Test each property block type with real Figma data
   - Verify values display correctly for all property types
   - Check appearance and layout match design requirements

2. **State Transition Testing**
   - Default state: Verify correct value display
   - Editing state: Test input interaction
   - Modified state: Verify changes persist correctly
   - Locked state: Confirm editing is disabled

3. **Interaction Testing**
   - Click behaviors work as expected
   - Keyboard navigation functions properly
   - Dropdowns open and close correctly
   - Reset button restores original values

### 2. Console Logging

1. **Strategic Logging Points**
   - Log state transitions: `console.log("Block entering edit state:", propertyName)`
   - Log data changes: `console.log("Value changed from:", oldValue, "to:", newValue)`
   - Log errors: `console.error("Validation failed:", reason)`

2. **Debugging Flags**
   - Add debug mode toggle: `const DEBUG = true;`
   - Conditional logging: `if(DEBUG) console.log("Debug info:", data);`
   - Performance markers: `console.time("render")` and `console.timeEnd("render")`

### 3. Test Checklist

**Basic Functionality**
- [ ] All property block types render correctly
- [ ] Property values display accurately 
- [ ] Editing works for all property types
- [ ] Changes persist after editing
- [ ] Reset functionality restores original values

**Block-Specific Tests**
- [ ] Number inputs enforce min/max constraints
- [ ] Dropdowns show all valid options
- [ ] Multi-input blocks handle all values correctly
- [ ] Specialized blocks (color, stroke) work as expected

**Integration Tests**
- [ ] Property detection works for all Figma node types
- [ ] Layer selection updates property blocks correctly
- [ ] Send to Cursor collects and formats data properly
- [ ] Error states are handled gracefully

This streamlined testing approach focuses on practical verification of functionality directly in the Figma plugin environment, using console logging for debugging and issue resolution.

### 10. Implementation Details

#### Class Structure and Component Architecture
The implementation will use a Composition with Behaviors approach for maximum flexibility. This approach offers several advantages:

1. **Core Structure**
   - Base `PropertyBlock` class provides common functionality
   - Specialized behaviors are added through composition
   - Each block type only includes behaviors it needs
   - Clean separation of concerns

2. **Behavior System**
   - Behaviors are small, focused classes
   - Each behavior handles one aspect of functionality
   - Behaviors can be combined as needed
   - Examples: `EditBehavior`, `ValidationBehavior`, `DropdownBehavior`

3. **Implementation Examples**

   ```javascript
   // Base property block class
   class PropertyBlock {
       constructor(element, options = {}) {
           this.element = element;
           this.options = options;
           this.behaviors = [];
           this.state = 'default';
       }
       
       addBehavior(behavior) {
           this.behaviors.push(behavior);
           behavior.initialize(this);
           return this;
       }
       
       setState(newState) {
           this.state = newState;
           this.element.dataset.state = newState;
           this.behaviors.forEach(b => b.onStateChange(newState));
       }
       
       // Additional core methods...
   }
   
   // Example: Number input behavior
   class NumberInputBehavior {
       initialize(block) {
           this.block = block;
           this.setupListeners();
       }
       
       setupListeners() {
           this.block.element.querySelector('.property-value')
               .addEventListener('click', () => this.onValueClick());
       }
       
       onValueClick() {
           if (this.block.state === 'default' || this.block.state === 'modified') {
               this.block.setState('editing');
               this.renderInput();
           }
       }
       
       renderInput() {
           // Render number input field
       }
       
       onStateChange(newState) {
           // Handle state changes
       }
   }
   
   // Example: Dropdown behavior
   class DropdownBehavior {
       initialize(block) {
           this.block = block;
           this.options = block.options.dropdownOptions || [];
           this.setupListeners();
       }
       
       setupListeners() {
           // Setup dropdown-specific listeners
       }
       
       // Dropdown-specific methods...
   }
   
   // Example: Creating a property block
   function createZIndexBlock(value) {
       const block = new PropertyBlock(
           document.querySelector('[data-property="z-index"]'),
           { min: -9999, max: 9999 }
       );
       
       return block
           .addBehavior(new NumberInputBehavior())
           .addBehavior(new ValidationBehavior());
   }
   ```

4. **Benefits of this Approach**

   - **Flexibility**: Each property block can have exactly the behaviors it needs
   - **Maintainability**: Single responsibility principle for each behavior
   - **Testability**: Behaviors can be tested in isolation
   - **Scalability**: New behaviors can be added without changing existing code
   - **Code Reuse**: Behaviors can be shared across different block types

#### Code Organization

1. **File Structure**
   ```
   /src
     /behaviors
       - base-behavior.js
       - number-input-behavior.js
       - dropdown-behavior.js
       - validation-behavior.js
     /blocks
       - property-block.js
       - single-input-block.js
       - multi-input-block.js
     /utils
       - state-manager.js
       - event-manager.js
   ```

2. **Initialization Flow**
   ```javascript
   // Main initialization
   function initPropertyBlocks() {
       // Create blocks with appropriate behaviors
       const zIndexBlock = createBlock('z-index', [
           new NumberInputBehavior(),
           new ValidationBehavior({ min: -9999, max: 9999 })
       ]);
       
       const typeBlock = createBlock('type', [
           new DropdownBehavior({
               options: ['Flex', 'Block']
           })
       ]);
       
       // And so on for other blocks...
   }
   
   function createBlock(property, behaviors) {
       const element = document.querySelector(`[data-property="${property}"]`);
       const block = new PropertyBlock(element);
       
       behaviors.forEach(behavior => block.addBehavior(behavior));
       return block;
   }
   ```

3. **Performance Considerations**
   - Event delegation for efficiency
   - Minimal DOM manipulation
   - Lazy initialization of complex behaviors
   - Efficient state transitions

### 11. Migration Checklist

1. **Cleanup Phase**
   - [ ] Remove old property block code
   - [ ] Verify data detection still works
   - [ ] Check section management
   - [ ] Validate logging

2. **Implementation Phase**
   - [ ] Create base PropertyBlock class
   - [ ] Implement single number inputs
   - [ ] Test thoroughly
   - [ ] Implement dropdowns
   - [ ] Test thoroughly
   - [ ] Implement multi-input blocks
   - [ ] Test thoroughly

3. **Verification Phase**
   - [ ] Check all property types
   - [ ] Verify data flow
   - [ ] Test edit functionality
   - [ ] Validate Cursor integration

### 12. Button Implementation Plan

1. **Button Types and States**
   ```javascript
   // Button Types
   {
       "edit": {
           state: "default" | "editing" | "modified",
           action: "toggleEdit"
       },
       "reset": {
           state: "modified",
           action: "resetToOriginal"
       },
       "sendToCursor": {
           state: "alwaysVisible" | "visibleAfterChanges",
           action: "sendDataToCursor"
       }
   }

   // Button States
   {
       "default": {
           visible: true,
           enabled: true,
           style: "normal"
       },
       "editing": {
           visible: true,
           enabled: true,
           style: "active"
       },
       "modified": {
           visible: true,
           enabled: true,
           style: "modified"
       },
       "locked": {
           visible: true,
           enabled: false,
           style: "disabled"
       }
   }
   ```

2. **Button Implementation Strategy**

   A. **Edit Button**
   ```javascript
   class PropertyBlock {
       constructor(element) {
           this.element = element;
           this.originalValue = element.dataset.originalContent;
           this.currentValue = this.originalValue;
           this.state = 'default';
       }

       toggleEdit() {
           switch(this.state) {
               case 'default':
                   this.enterEditMode();
                   break;
               case 'editing':
                   this.exitEditMode();
                   break;
               case 'modified':
                   this.enterEditMode();
                   break;
           }
       }

       enterEditMode() {
           this.state = 'editing';
           this.renderEditInput();
       }

       exitEditMode() {
           if (this.validateInput()) {
               this.saveValue();
               this.state = 'modified';
           } else {
               this.state = 'default';
           }
           this.renderValue();
       }
   }
   ```

   B. **Reset Button**
   ```javascript
   class PropertyBlock {
       resetToOriginal() {
           this.currentValue = this.originalValue;
           this.state = 'default';
           this.renderValue();
       }
   }
   ```

   C. **Send to Cursor Button**
   ```javascript
   class PropertyManager {
       constructor() {
           this.modifiedProperties = new Set();
       }

       markPropertyModified(property) {
           this.modifiedProperties.add(property);
           this.updateSendButton();
       }

       updateSendButton() {
           const sendButton = document.querySelector('[data-action="sendToCursor"]');
           if (this.modifiedProperties.size > 0) {
               sendButton.classList.add('active');
           } else {
               sendButton.classList.remove('active');
           }
       }

       sendToCursor() {
           const data = {
               type: 'PROPERTY_UPDATE',
               properties: Array.from(this.modifiedProperties).map(prop => ({
                   name: prop,
                   value: document.querySelector(`[data-property="${prop}"]`).dataset.originalContent
               }))
           };
           // Send to Cursor
           this.modifiedProperties.clear();
           this.updateSendButton();
       }
   }
   ```

3. **CSS Structure**
   ```css
   /* Button Base */
   .property-button {
       background: transparent;
       border: none;
       padding: 4px;
       cursor: pointer;
       opacity: 0.6;
       transition: opacity 0.2s;
   }

   .property-button:hover {
       opacity: 1;
   }

   /* Edit Button */
   .property-button.edit {
       /* Icon styling */
   }

   .property-button.edit.active {
       color: #4C8BFF;
   }

   /* Reset Button */
   .property-button.reset {
       /* Icon styling */
       display: none;
   }

   .property-block.modified .property-button.reset {
       display: block;
   }

   /* Send Button */
   .property-button.send {
       /* Icon styling */
       opacity: 0.6;
   }

   .property-button.send.active {
       opacity: 1;
       color: #4C8BFF;
   }

   /* Locked State */
   .property-block.locked .property-button {
       opacity: 0.3;
       cursor: not-allowed;
   }
   ```

4. **Event Handling**
   ```javascript
   class EventManager {
       constructor() {
           this.propertyManager = new PropertyManager();
           this.setupEventListeners();
       }

       setupEventListeners() {
           // Edit button click
           document.addEventListener('click', (e) => {
               if (e.target.matches('[data-action="edit"]')) {
                   const block = e.target.closest('.property-block');
                   const propertyBlock = new PropertyBlock(block);
                   propertyBlock.toggleEdit();
               }
           });

           // Reset button click
           document.addEventListener('click', (e) => {
               if (e.target.matches('[data-action="reset"]')) {
                   const block = e.target.closest('.property-block');
                   const propertyBlock = new PropertyBlock(block);
                   propertyBlock.resetToOriginal();
                   this.propertyManager.modifiedProperties.delete(block.dataset.property);
                   this.propertyManager.updateSendButton();
               }
           });

           // Send button click
           document.addEventListener('click', (e) => {
               if (e.target.matches('[data-action="sendToCursor"]')) {
                   this.propertyManager.sendToCursor();
               }
           });

           // Keyboard events
           document.addEventListener('keydown', (e) => {
               if (e.key === 'Escape') {
                   const editingBlock = document.querySelector('.property-block.editing');
                   if (editingBlock) {
                       const propertyBlock = new PropertyBlock(editingBlock);
                       propertyBlock.exitEditMode();
                   }
               }
           });
       }
   }
   ```

5. **Implementation Order**

   1. **Phase 1: Core Structure**
      - Create base `PropertyBlock` class
      - Implement state management
      - Set up basic CSS structure

   2. **Phase 2: Edit Functionality**
      - Implement edit button
      - Add input handling
      - Set up validation

   3. **Phase 3: Reset Functionality**
      - Add reset button
      - Implement value restoration
      - Update state management

   4. **Phase 4: Send to Cursor**
      - Create `PropertyManager` class
      - Implement modified property tracking
      - Add send button functionality

   5. **Phase 5: Integration**
      - Connect with existing property detection
      - Integrate with data storage
      - Add error handling

   6. **Phase 6: Button Integration**
      - Connect with existing property blocks
      - Integrate with state management
      - Add button functionality

   7. **Phase 7: CSS Integration**
      - Set up button styles
      - Connect with existing CSS structure
      - Add button styles

   8. **Phase 8: Event Handling**
      - Set up event listeners
      - Connect with existing event handling
      - Add button event handling

   9. **Phase 9: Testing**
      - Test button functionality
      - Verify button integration
      - Validate button implementation

   10. **Phase 10: Documentation**
       - Document button implementation
       - Add button implementation details to documentation
       - Update existing documentation

   11. **Phase 11: Final Review**
       - Review button implementation
       - Verify button functionality
       - Validate button integration
       - Finalize button implementation

   12. **Phase 12: Deployment**
       - Deploy button implementation
       - Verify deployment
       - Validate button functionality
       - Finalize deployment

### 13. Value-Container Implementation

1. **HTML Structure**
   ```html
   <!-- Value-Container Based Selection -->
   <div class="property-block" data-property="property-name">
       <div class="property-label">Label</div>
       <div class="property-value" data-editable="true">
           <!-- Value content -->
       </div>
   </div>

   <!-- Multi-Input with Dropdowns -->
   <div class="property-block" data-property="constraints">
       <div class="property-label">Constraints</div>
       <div class="property-value">
           <div class="value-container" data-editable="true" data-type="dropdown">
               <div class="value">MIN</div>
               <div class="dropdown-options">...</div>
           </div>
           <div class="value-container" data-editable="true" data-type="dropdown">
               <div class="value">STRETCH</div>
               <div class="dropdown-options">...</div>
           </div>
       </div>
   </div>

   <!-- Element Type (Special Case) -->
   <div class="property-block" data-property="elementType">
       <div class="property-value" data-editable="true" data-type="dropdown">
           <div class="value">div</div>
           <div class="dropdown-options">...</div>
       </div>
   </div>
   ```

2. **CSS Implementation**
   ```css
   /* Value Container Base */
   .property-value {
       position: relative;
       cursor: pointer;
   }

   .property-value[data-editable="true"]:hover {
       background-color: var(--section-hover);
   }

   /* Dropdown Options */
   .dropdown-options {
       position: absolute;
       display: none;
       /* Dropdown styling */
   }

   .value-container:hover .dropdown-options {
       display: block;
   }

   /* Special Case: No Label */
   .property-block[data-property="elementType"] {
       /* Special styling for element type block */
   }
   ```

3. **Class Implementation**
   ```javascript
   class PropertyBlock {
       constructor(element) {
           this.element = element;
           this.valueContainer = element.querySelector('.property-value');
           this.setupValueContainerListeners();
       }

       setupValueContainerListeners() {
           this.valueContainer.addEventListener('click', () => {
               if (this.type === 'dropdown') {
                   this.toggleDropdown();
               } else {
                   this.enterEditMode();
               }
           });
       }

       toggleDropdown() {
           // Dropdown specific behavior
       }
   }

   class MultiInputBlock extends PropertyBlock {
       setupValueContainerListeners() {
           this.valueContainers = this.element.querySelectorAll('.value-container');
           this.valueContainers.forEach(container => {
               container.addEventListener('click', () => {
                   if (container.dataset.type === 'dropdown') {
                       this.toggleDropdown(container);
                   } else {
                       this.enterEditMode(container);
                   }
               });
           });
       }
   }
   ```

4. **Element Type Inference**
   ```javascript
   class ElementTypeInference {
       static inferFromProperties(node) {
           // Inference logic based on node properties
           if (node.type === 'TEXT') {
               return this.inferTextElementType(node);
           } else if (node.type === 'FRAME') {
               return this.inferFrameElementType(node);
           }
           // ... other type inferences
       }

       static inferTextElementType(node) {
           // Text-specific inference logic
           if (node.textAutoResize === 'WIDTH_AND_HEIGHT') {
               return 'span';
           }
           return 'div';
       }

       static inferFrameElementType(node) {
           // Frame-specific inference logic
           if (node.layoutMode) {
               return 'div';
           }
           return 'section';
       }
   }
   ```

5. **Implementation Order**
   1. Create base value-container structure
   2. Implement dropdown functionality
   3. Add multi-input support
   4. Implement element type inference
   5. Add special case handling
   6. Test and validate

## Layer Tree and Property Block Integration

### Layer Selection and Property Detection
1. **Initial Selection**
   - When an element is selected in Figma UI:
     - Element and all descendants populate the layer tree
     - Properties are detected for all layers immediately
     - Properties are stored but not displayed until layer is selected

2. **Layer Tree Structure**
   - Selected layer name displayed at top of plugin window
   - Property sections displayed below layer name
   - Sections visibility controlled by layer type:
     - Text layers: Show text properties section
     - Non-text layers: Hide text properties section

3. **Property Display**
   - Properties update when selecting different layers in tree
   - Values pulled from pre-detected properties
   - All property blocks maintain their state
   - Changes saved as they are made

### Data Collection and Storage
1. **Property Detection**
   - Properties detected for all layers on initial selection
   - Detection includes:
     - Direct properties of selected layer
     - Properties of all descendant layers
     - Type-specific properties (text vs non-text)

2. **Value Storage**
   - Values stored per layer
   - Changes saved immediately when made
   - All changes preserved until sent to Cursor
   - No need to send layers individually

### Send to Cursor Button
1. **Visibility and Behavior**
   - Button always visible
   - Two-step confirmation process:
     - First click: Show confirmation dialog
     - Second click: Send all data to Cursor

2. **Data Collection**
   - Collects all properties for:
     - Selected parent layer
     - All descendant layers
     - All modified values
   - Sends complete data structure to Cursor

3. **Confirmation Dialog**
   - Shows summary of:
     - Number of layers being sent
     - Number of modified properties
     - Any potential issues
   - Requires explicit confirmation 

## Related Documentation

### Internal References
- [Property Detection](../docs/property-detection.md) - Property processing and detection logic
- [Plugin Architecture](../docs/plugin-architecture.md) - System architecture and data flow
- [Plugin Documentation](../docs/plugin-documentation.md) - High-level plugin concepts

### External References
- [Figma Plugin API](https://www.figma.com/plugin-docs/) - Official Figma plugin documentation
- [Figma UI Components](https://www.figma.com/plugin-docs/api/ui-components/) - Figma UI component reference
- [Figma Node Types](https://www.figma.com/plugin-docs/api/nodes/) - Figma node type reference