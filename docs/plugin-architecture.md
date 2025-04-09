# Plugin Architecture

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [Data Flow](#data-flow)
3. [Value Management](#value-management)
4. [Layer Tree Integration](#layer-tree-integration)
5. [State Management](#state-management)
6. [Related Documentation](#related-documentation)

## Core Architecture

### Plugin Components
1. **Layer Tree**
   - Displays selected Figma element and descendants
   - Manages layer selection within plugin
   - Updates property display based on selection

2. **Property Sections**
   - Organized by property type (Layout, Text, Visual)
   - Visibility controlled by layer type
   - Contains individual property blocks

3. **Property Blocks**
   - Handle individual property editing
   - Manage visual states and feedback
   - Implement type-specific input methods

4. **Send to Cursor**
   - Collects and validates all property data
   - Implements two-step confirmation
   - Manages data transmission to Cursor

## Data Flow

### Figma → Plugin
1. **Initial Selection**
   - Receives selected element data
   - Detects all properties for element and descendants
   - Populates layer tree
   - Updates property display

2. **Property Updates**
   - Receives property changes from Figma
   - Updates stored values
   - Refreshes UI if affected layer is selected

### Plugin → Cursor
1. **Data Collection**
   - Gathers all properties for selected layers
   - Prioritizes edited values over original values
   - Validates data format

2. **Transmission**
   - Implements two-step confirmation
   - Sends complete data structure
   - Handles success/failure states

## Value Management

### Data Storage
1. **Two-Tier Storage System**
   ```javascript
   {
       originalValues: { /* Figma's current values */ },
       editedValues: { /* User's manual changes */ }
   }
   ```

2. **Value Priority**
   - Edited values take precedence in UI and Cursor communication
   - Original values serve as baseline for comparison
   - Changes in Figma update original values and clear related edits

### Update Rules
1. **On Layer Selection**
   - Compare new Figma values with original values
   - If value changed in Figma:
     - Update original value
     - Clear any existing edit for that property
   - If value unchanged:
     - Keep existing edit if present
     - Use original value if no edit exists

2. **On Property Edit**
   - Store new value in editedValues
   - Maintain original value for comparison
   - Update UI to show edited state

3. **On Reset**
   - Clear value from editedValues
   - Revert to original value
   - Update UI to show normal state

### Implementation Example
```javascript
class PropertyManager {
    constructor() {
        this.originalValues = new Map(); // layerId -> {property: value}
        this.editedValues = new Map();   // layerId -> {property: value}
    }

    updateLayer(layerId, newValues) {
        const original = this.originalValues.get(layerId) || {};
        const edited = this.editedValues.get(layerId) || {};

        // Compare new values with original
        Object.entries(newValues).forEach(([property, value]) => {
            if (original[property] !== value) {
                // Figma changed this property
                original[property] = value;
                delete edited[property]; // Clear any edits
            }
        });

        this.originalValues.set(layerId, original);
        this.editedValues.set(layerId, edited);
    }

    getValue(layerId, property) {
        const edited = this.editedValues.get(layerId);
        if (edited && property in edited) {
            return edited[property]; // Return edit if exists
        }
        return this.originalValues.get(layerId)?.[property]; // Otherwise return original
    }
}
```

## Layer Tree Integration

### Selection Management
1. **Initial Population**
   - Detect selected element in Figma
   - Build layer tree with all descendants
   - Store properties for all layers

2. **Layer Selection**
   - Update selected layer name display
   - Show/hide relevant property sections
   - Update property block values

3. **Property Updates**
   - Detect changes in Figma
   - Update stored values
   - Refresh UI if affected layer is selected

### Section Visibility
1. **Type-Based Display**
   - Text layers: Show text properties
   - Non-text layers: Hide text properties
   - Update on layer selection changes

2. **Property Detection**
   - Immediate detection on selection
   - Store all properties for later use
   - Update values when layer selected

## State Management

### Global States
1. **Selection State**
   - Currently selected layer
   - Layer tree structure
   - Property visibility

2. **Edit State**
   - Modified properties
   - Original values
   - UI feedback

3. **Send State**
   - Data validation
   - Confirmation status
   - Transmission state

### State Transitions
1. **Selection Changes**
   - Update layer tree
   - Refresh property display
   - Maintain edit states

2. **Property Edits**
   - Update stored values
   - Modify UI state
   - Track changes

3. **Send to Cursor**
   - Validate data
   - Show confirmation
   - Handle transmission

## Related Documentation

### Internal References
- [Property Detection](../docs/property-detection.md) - Property processing and detection logic
- [Property Block Refactor Plan](../docs/property-block-refactor-plan.md) - UI implementation details
- [Plugin Documentation](../docs/plugin-documentation.md) - High-level plugin concepts

### External References
- [Figma Plugin API](https://www.figma.com/plugin-docs/) - Official Figma plugin documentation
- [Figma Plugin Architecture](https://www.figma.com/plugin-docs/api/architecture/) - Figma plugin architecture reference 