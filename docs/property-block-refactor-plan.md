# Property Block Refactor Plan

## Table of Contents
1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Proposed Changes](#proposed-changes)
4. [Implementation Plan](#implementation-plan)
5. [Testing Strategy](#testing-strategy)
6. [Related Documentation](#related-documentation)

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

## Implementation Strategy

### 1. Cleanup Phase
**Keep:**
1. Core Data Flow
```javascript
window.onmessage = async (event) => {
    const msg = event.data.pluginMessage;
    if (!msg) {
        console.error('Invalid message received');
        return;
    }
    // Core message handling
}
```

2. Section Management
```javascript
function updateSectionVisibility(data) {
    // Section visibility logic
}
```

3. Data Detection Functions
```javascript
function isActuallyInAutoLayoutDespiteBeingAbsolute(data) {
    // Auto layout detection logic
}
```

4. Core Plugin Structure
- `.section` containers
- Section headers
- Selection name/type display
- Plugin status display

**Remove:**
1. All Property Block Related Functions
```javascript
initPropertyBlocks()
moveToDefinedProperties()
moveToUndefinedProperties()
```

2. All Property Block HTML
```html
<div class="property-block">...</div>
```

3. All Property Block CSS
```css
.property-block { ... }
.property-value { ... }
.property-label { ... }
```

4. All Property Block Event Handlers
```javascript
block.addEventListener('click', ...)
resetButton.addEventListener('click', ...)
```

5. All UI Update Logic in update functions
```javascript
document.querySelector('[data-property="..."]')
```

### 2. Implementation Order

1. **Single Number Input Blocks** (z-index, rotation, gap, radius)
   - Basic display
   - Value storage
   - Edit functionality
   - Validation

2. **Dropdown Blocks** (overflow, positioning, blend)
   - Option selection
   - Value validation
   - Data storage

3. **Multi-Input Blocks** (position, size, padding)
   - Multiple value handling
   - CSS labels
   - Complex validation

### 3. Block Types and Data Structure

```javascript
// Single Number Inputs
{
    type: "number",
    properties: ["z-index", "rotation", "gap", "radius"],
    dataFormat: "number",
    validation: "numeric"
}

// Multi-Number Inputs
{
    type: "multi-number",
    properties: ["position", "size", "constraints", "sizing", "padding"],
    dataFormat: "array",
    labels: {
        position: ["X:", "Y:"],
        size: ["X:", "Y:"],
        constraints: ["H:", "V:"],
        sizing: ["H:", "V:"],
        padding: ["T:", "R:", "B:", "L:"]
    }
}

// Dropdowns
{
    type: "select",
    properties: ["type", "direction", "align", "justify", "overflow", "positioning", "blend"],
    options: {
        type: ["Flex", "Block"],
        direction: ["Row", "Column"],
        align: ["Flex Start", "Center", "Flex End", "Space Between"]
    }
}
```

### 3.1 Multi-Input Block Behavior

1. **State Management**
   - States (normal, edit, modified) apply to entire multi-input block
   - State changes affect whole block, not individual value sections
   - Undo functionality resets all values in block

2. **Dropdown Interaction**
   - Each value section (e.g., "H: Left", "V: Stretch") has clickable area for dropdown
   - Only one dropdown can be open at a time within a block
   - Clicking another value section:
     - Closes current dropdown
     - Opens new dropdown
     - Maintains block's edit state
   - Clicking outside block:
     - Closes any open dropdown
     - Checks for value changes
     - Updates block state accordingly

3. **Visual Structure**
   - One cohesive block with main property label
   - Individual value sections with their own labels
   - Each value section shows current value and dropdown indicator

### 4. Data Flow and State Management

1. **Data Storage**
   - Values stored in `dataset.originalContent` as JSON arrays
   - Format optimized for Cursor to read and implement
   - Example formats:
     ```javascript
     // Single value
     element.dataset.originalContent = "100";
     
     // Multi-value (position, size, etc.)
     element.dataset.originalContent = JSON.stringify([100, 200]);
     
     // String value (overflow, blend, etc.)
     element.dataset.originalContent = "HIDDEN";
     ```

2. **Block States**
   - Default: Displaying detected value
     - Shows property label and value
     - No user interaction active
   - Editing: User can modify value
     - Type-specific variations:
       - Number inputs: Numeric keyboard
       - String inputs: Text input
       - Multi-inputs: Multiple fields
   - Modified: Value has been manually changed
     - Can reset to original detected value
     - Can enter edit state again
   - Locked: Cannot be edited
     - Permanent: Always locked (property-specific)
     - Conditional: Locked based on other properties

3. **State Implementation**
   ```javascript
   // Data attributes
   data-state="default" | "editing" | "modified" | "locked"
   data-lock-type="permanent" | "conditional"
   
   // CSS classes
   .property-block
   .property-block.editing
   .property-block.modified
   .property-block.locked
   ```

4. **Concurrent Updates**
   - Plugin runs in dev mode
   - No automatic updates from Figma during editing
   - Edge case of multiple users editing same file:
     - Not a concern for current implementation
     - Will be addressed in future public release
     - No special handling needed now

### 5. Validation Rules and Format Requirements

1. **Number Input Patterns**
   - Each number property will have defined min/max ranges
   - Some properties may support wrap-around behavior
   - All number inputs:
     - Prevent non-numeric input
     - Enforce property-specific ranges
     - May support decimal values if needed
   ```javascript
   // Pattern for number properties
   {
       min: number,
       max: number,
       wrapAround: boolean,
       allowDecimals: boolean
   }

   // Examples
   {
       "z-index": {
           min: -9999,
           max: 9999,
           wrapAround: false,
           allowDecimals: false
       },
       "rotation": {
           min: 0,
           max: 360,
           wrapAround: true,  // 380° = 20°, -20° = 340°
           allowDecimals: false
       }
   }
   ```

2. **Dropdown Patterns**
   - Options defined in semantic CSS format for Cursor
   - Each dropdown property will have its complete set of valid options
   - Options will be consistent with Figma's available values
   ```javascript
   // Pattern for dropdown properties
   {
       options: string[],
       format: "semantic-css"
   }

   // Examples
   {
       "align": {
           options: ["flex-start", "flex-end", "center", "space-between"],
           format: "semantic-css"
       }
   }
   ```

3. **Multi-Input Patterns**
   - Value labels use first letter of each dimension
   - Consistent structure across all multi-input properties
   - Labels positioned next to their respective inputs
   ```javascript
   // Pattern for multi-input properties
   {
       labels: string[],
       format: "first-letter-labels"
   }

   // Examples
   {
       "position": ["X:", "Y:"],
       "constraints": ["H:", "V:"],
       "padding": ["T:", "R:", "B:", "L:"]
   }
   ```

4. **Input Validation**
   - Prevent invalid input at the source
   - Visual feedback for invalid values:
     ```css
     .property-block.editing.invalid {
         border-color: red;
     }
     ```
   - No submission of invalid values
   - Clear error states

5. **Unit Handling Patterns**
   - Default: pixels (implied, not displayed)
   - Special cases handled consistently
   - Three possible display approaches:
     1. Label next to value
     2. Non-editable suffix
     3. Auto-appended after submission
   - Auto values: No units required
   ```javascript
   // Pattern for unit handling
   {
       default: "px",
       specialCases: {
           [property]: string
       },
       display: "label" | "suffix" | "auto"
   }

   // Examples
   {
       default: "px",
       specialCases: {
           "rotation": "degrees",
           "opacity": "percentage"
       },
       display: "label"
   }
   ```

### 6. Event Handling and State Transitions

1. **State Entry/Exit Rules**
   ```javascript
   // Default State -> Edit State
   - Trigger: Click on block
   - Action: Show input with current value
   
   // Edit State -> Default State
   - Trigger: Click outside block
   - Trigger: Press ESC
   - Trigger: Submit empty input
   - Trigger: Submit original value
   - Action: Display original detected value
   
   // Edit State -> Modified State
   - Trigger: Submit valid new value
   - Action: Save new value, show undo button
   
   // Modified State -> Default State
   - Trigger: Click undo button
   - Action: Reset to original detected value
   
   // Modified State -> Edit State
   - Trigger: Click on block
   - Action: Show input with current modified value
   ```

2. **Input Handling**
   - Empty input on submit:
     - If from Default state: Show original value
     - If from Modified state: Show last modified value
   - Original value on submit:
     - Always return to Default state
   - Valid new value on submit:
     - Save new value
     - Enter Modified state
     - Show undo button

3. **Keyboard Events**
   - Enter: Submit current input value
   - ESC: Cancel edit, return to previous state
   - Other keys: Standard text input behavior

4. **Visual Feedback**
   ```css
   /* Default State */
   .property-block {
       background-color: rgba(255, 255, 255, 0.06);
       border-radius: 4px;
       padding: 4px 8px;
       height: 28px;
       display: flex;
       align-items: center;
       border: 1px solid transparent;
   }
   
   /* Edit State */
   .property-block.editing {
       border-color: #4C8BFF;
       background-color: var(--section-hover);
   }
   
   /* Modified State */
   .property-block.modified {
       /* Standard block styling with undo button */
   }
   
   /* Undo Button */
   .property-block .undo-button {
       /* Small button styling */
   }
   ```

### 7. Color Values
```css
/* Core Colors */
--background: #2c2c2c;
--text: #e0e0e0;
--border: #444444;
--active: #4C8BFF;
--text-secondary: #888888;
--error: #f44336;
```

### 8. Data Flow and Future Features

1. **Current Data Flow**
   - Figma sends raw data via `pluginMessage`
   - Plugin processes data through update functions:
     - `updateSectionVisibility`
     - `updateLayoutProperties`
     - `updateTextProperties`
     - `updateVisualProperties`
   - Values stored in `dataset.originalContent` as JSON arrays
   - Changes saved locally in plugin

2. **Send to Cursor Button**
   - Will be added to UI
   - Behavior to be determined:
     - Always visible vs. appears after changes
     - Always active vs. enabled after changes
   - Will send complete layer data when clicked

3. **Future Layer Tree View**
   - Will be implemented after basic property functionality
   - Will use:
     - Cursor data for hierarchy structure
     - Raw data for property detection
   - Will allow:
     - Selection of any layer in hierarchy
     - Property editing for selected layer
     - Navigation between layers

4. **Data Validation Approach**
   - Focus on detection and editing
   - No strict validation requirements
   - Allow submission with missing properties
   - Context-dependent validation to be determined

### 9. Testing and Debugging

1. **Console Logging**
   - Log key state changes
   - Log data flow between Figma and plugin
   - Log validation results
   - Log error conditions
   - Error logs should be distinctly marked compared to regular state changes
   - Log every state transition for thorough testing

2. **Visual Testing**
   - Test in Figma plugin window
   - Verify property detection
   - Verify state transitions
   - Verify data persistence

3. **Error Handling**
   - Console logs for debugging
   - Visual indicators for user-facing errors
   - Graceful recovery from errors

4. **Incremental Testing Process**
   - Start with simplest block implementation (single input or dropdown)
   - Test each state thoroughly before moving to next:
     a. Default State
        - Verify base block component styling
        - Confirm property detection and value display
        - Ensure consistent behavior from base block component
     b. Edit State
        - Verify edit mode entry
        - Test styling and interaction behavior
     c. Modified State
        - Test value submission process
        - Verify modified state styling
        - Test reset functionality
        - Confirm return to default state
   - Only proceed to more complex blocks after simple block is fully functional
   - Each implementation step must verify:
     - Correct property detection
     - Proper value population
     - Expected state transitions
     - Consistent styling
   - More complex blocks should follow same testing sequence
   - Even if implementation handles all states automatically, each state must be verified independently

### 10. Implementation Details

1. **Class Structure**
   - To be determined based on codebase review
   - Will focus on minimizing errors and testing time
   - Will follow existing patterns where possible

2. **Code Organization**
   - Separate concerns clearly
   - Maintain consistent patterns
   - Document key decisions

3. **Performance Considerations**
   - Optimize DOM operations
   - Minimize event listeners
   - Efficient state management

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