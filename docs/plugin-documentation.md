# MCP Plugin Documentation

## Table of Contents
1. [Core Purpose](#core-purpose)
2. [Property Types](#property-types)
3. [User Interaction](#user-interaction)
4. [Technical Requirements](#technical-requirements)
5. [Implementation Details](#implementation-details)
6. [Testing Requirements](#testing-requirements)
7. [Related Documentation](#related-documentation)

## Core Purpose

### Plugin Function
The MCP (Material Component Plugin) serves as a bridge between Figma and Cursor, enabling real-time property editing and synchronization. Its primary functions are:

1. **Property Detection and Display**
   - Scans selected Figma elements for editable properties
   - Organizes properties into logical sections (Layout, Text, Visual)
   - Displays current values in an intuitive UI
   - Updates in real-time as selections change

2. **Property Editing and Synchronization**
   - Allows direct editing of property values
   - Validates changes against Cursor's format requirements
   - Sends updates to Cursor only
   - Maintains synchronization with Cursor's expectations

3. **State Management**
   - Tracks property states (normal, editing, error)
   - Manages value history and reset capabilities
   - Handles error states and validation feedback
   - Preserves original values for comparison

### Data Flow
The plugin manages data flow in three directions:

1. **Figma → Plugin**
   - Receives raw property data from Figma
   - Processes and organizes properties
   - Updates UI to reflect current values

2. **Plugin → Cursor**
   - Sends validated property updates
   - Maintains data format consistency
   - Tracks modification history

3. **Cursor → Plugin**
   - Receives update confirmations
   - Handles success/failure states
   - Updates UI accordingly

### UI Role
The UI serves three primary functions:
1. Display detected properties from Figma
   - Shows current values for all detected properties
   - Organizes properties into logical sections (Layout, Text, Visual)
   - Provides visual feedback for property states
   - Uses console logging for debugging and verification

2. Allow manual editing of properties
   - Click to edit functionality
   - Type-specific input methods
   - Validation during editing
   - Clear state management for buttons and inputs

3. Provide user feedback
   - Visual state changes (normal, editing, error)
   - Button state management
   - Property modification tracking
   - Send to Cursor functionality

### Implementation Priorities
1. **Core Functionality**
   - Property detection from Figma
   - Data storage in dataset.originalContent
   - Console logging for verification
   - Basic UI structure

2. **Button Implementation**
   - Clear state management
   - Event handling
   - Visual feedback
   - Integration with property blocks

3. **Future Features**
   - Layer tree view
   - Advanced validation
   - Error handling
   - Performance optimization

### Data Flow Updates
1. **Property Detection**
   - Focus on accurate detection
   - Extensive console logging
   - Clear data structure
   - Type-specific handling

2. **Data Storage**
   - Use dataset.originalContent
   - JSON array format
   - Type-specific formats
   - Easy reset capability

3. **UI Updates**
   - Separate from core logic
   - Clear state management
   - Button integration
   - Visual feedback

### Special Cases
Properties requiring unique handling:

1. **Multi-Input with Dropdowns**
   - Each value independently selectable
   - Dropdown options tied to value container
   - No edit mode required for dropdowns
   - Example: Constraints ["MIN", "STRETCH"]

2. **Element Type Property**
   - Special case: dropdown without label
   - Not directly detectable from Figma
   - Requires inference from other properties
   - Essential for Cursor implementation

### Interaction Patterns
1. **Value-Container Based Selection**
   - Click on value area to edit/select
   - Consistent across all property types
   - Special handling for multi-input dropdowns
   - Allows for dropdowns without labels

2. **Edit State Exits**
   - Enter key to save
   - Escape key to cancel
   - Click outside to save
   - Dropdown selection to save

3. **State Transitions**
   - Normal → Edit: Click value
   - Edit → Normal: Save/Cancel
   - Normal → Modified: Value change
   - Modified → Normal: Reset

## Property Types

### Single Number Inputs
Properties that accept a single numeric value:
- z-index
- rotation
- gap
- radius

### Multi-Number Inputs
Properties that require multiple numeric values:
- position [x, y]
- size [width, height]
- constraints [horizontal, vertical]
- sizing [width, height]
- padding [top, right, bottom, left]

### Dropdowns
Properties with predefined options:
- type (Flex, Block)
- direction (Row, Column)
- align (Flex Start, Center, Flex End, Space Between)
- justify (Flex Start, Center, Flex End, Space Between)
- overflow (Visible, Hidden)
- positioning (Absolute, Relative)
- blend (Normal, Multiply)

### Special Cases
Properties requiring unique handling:
- fill (color and opacity)
- stroke (color and weight)
- color (text color)
- alignment (text alignment)
- line-height
- letter-spacing
- shadow (enabled and properties)
- elementType (inferred from Figma data)

## User Interaction

### Edit Capabilities
All property values can be edited with type-specific input methods:

1. Single Number Inputs:
   - Click to edit
   - Number input field
   - Enter to save
   - Escape to cancel
   - Click outside to save

2. Multi-Number Inputs:
   - Click to edit
   - Multiple number input fields
   - Labels via CSS ::before
   - Enter to save
   - Escape to cancel
   - Click outside to save

3. Dropdowns:
   - Click to edit
   - Select dropdown
   - Predefined options
   - Enter to save
   - Escape to cancel
   - Click outside to save
   - Click on option to save (exits edit state)

### State Management
Four primary states with specific behaviors:

1. Normal State:
   - Display current value
   - Hover effects
   - Click to edit

2. Edit State:
   - Show input field(s)
   - Focus first input
   - Validate input
   - Save on:
     - Enter key
     - Click outside block
     - Dropdown option selection
   - Cancel on escape

3. Error State:
   - Show validation error
   - Prevent saving
   - Allow cancel
   - Visual error indication

4. Success State:
   - Show updated value
   - Visual confirmation
   - Reset button if changed

## Technical Requirements

### Data Structures
Values stored in dataset.originalContent with type-specific formats:
- Single Number: "100"
- Multi-Number: "[100, 200]"
- Dropdown: "HIDDEN"

### Event Flow
Unified event handling with type-specific behavior:
- Click events for edit mode
- Keyboard events for save/cancel
- Focus events for validation
- Change events for updates

### Error Handling
1. **Validation Errors**
   - Console logging for debugging
   - Visual indicators for user-facing errors
   - Property-specific validation rules
   - Graceful recovery from errors

2. **State Management**
   - Clear error states
   - Reset capabilities
   - Error message display
   - State transition handling

3. **Data Flow**
   - Error logging for data processing
   - Validation during transmission
   - Error recovery procedures
   - State preservation during errors

## Implementation Details

### Block Structure
Base class with specialized implementations:
- PropertyBlock (base class)
- SingleNumberBlock
- MultiNumberBlock
- DropdownBlock

### State Management
State transitions handled through CSS classes and data attributes:
- Normal state
- Edit state
- Error state
- Success state

### Data Flow
Data transformation and validation:
- Type-specific transformation
- Property-specific validation
- Error handling
- State updates

## Testing Requirements

1. **Console Logging**
   - Property detection verification
   - State transition tracking
   - Error condition logging
   - Data flow validation

2. **Visual Testing**
   - Property display verification
   - State transition validation
   - Error state visualization
   - UI feedback testing

3. **Integration Testing**
   - Figma selection handling
   - Property update processing
   - Data transmission validation
   - Error recovery verification

4. **Performance Testing**
   - Large layer tree handling
   - Property update responsiveness
   - UI state management
   - Data processing efficiency

## Related Documentation

### Internal References
- [Plugin Architecture](../docs/plugin-architecture.md) - System architecture and data flow
- [Property Detection](../docs/property-detection.md) - Property processing and detection logic
- [Property Block Refactor Plan](../docs/property-block-refactor-plan.md) - UI implementation details

### External References
- [Figma Plugin API](https://www.figma.com/plugin-docs/) - Official Figma plugin documentation
- [Figma Plugin Guidelines](https://www.figma.com/plugin-docs/plugin-guidelines/) - Figma plugin best practices

## Notes
- Add implementation details as they are developed
- Document any decisions made
- Track any issues found
- Record any changes needed 