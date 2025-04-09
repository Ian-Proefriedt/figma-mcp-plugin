# Reference Utilities

This directory contains reference implementations of utility functions that were originally part of the MCP plugin. These files are preserved for documentation and reference purposes, as their functionality has been integrated into the main plugin files due to Figma plugin API limitations.

## Files

### layoutUtils.js
Contains functions for detecting and analyzing layout properties of Figma nodes:
- `isIgnoringAutoLayout`: Determines if a node ignores its parent's auto layout
- `getLayoutType`: Gets the layout type of a node (AUTO, ABSOLUTE, or NONE)
- `extractLayoutProperties`: Extracts all relevant layout properties from a node
- `logLayoutProperties`: Debugging utility for logging layout-related fields

### processUtils.js
Contains functions for processing Figma node properties:
- `processNodeProperties`: Main function for processing all node properties
- `processPosition`: Processes position-related properties
- `processSize`: Processes size-related properties
- `processTransform`: Processes transform-related properties
- `processVisualProperties`: Processes visual properties (opacity, effects, etc.)
- `processLayoutProperties`: Processes layout-specific properties
- `processTextProperties`: Processes text-specific properties
- `processComponentProperties`: Processes component-specific properties
- `processSectionProperties`: Processes section-specific properties
- `processGroupProperties`: Processes group-specific properties
- `processVectorProperties`: Processes vector-specific properties

### propertyInterpreters.js
Contains functions for interpreting Figma property values into standard CSS/React values:
- `interpretLayoutType`: Determines the layout type based on node properties
- `interpretDirection`: Interprets Figma's layout mode into CSS flex direction
- `interpretAlignItems`: Interprets Figma's counter axis alignment into CSS align-items
- `interpretJustifyContent`: Interprets Figma's primary axis alignment into CSS justify-content
- `interpretPadding`: Interprets Figma's padding values into CSS padding
- `interpretGap`: Interprets Figma's spacing values into CSS gap
- `interpretLayoutProperties`: Main function to interpret all layout properties

## Note
These files are not currently in use in the main plugin. Their functionality has been integrated into:
- `mcp/mcp-ui.html`
- `mcp/plugin.js`

This was done due to limitations in the Figma plugin API regarding module imports. These files are maintained as reference implementations and documentation of the original utility functions. 