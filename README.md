# Figma MCP Plugin

A Figma plugin for Material Component Properties management.

## ⚠️ IMPORTANT NOTICE ⚠️

**This project is currently in development and contains known bugs and issues that need to be addressed.**

### Current Limitations and Issues:

- The PropertyBlock implementation is incomplete and may not function as expected
- Some UI elements may not render correctly
- The property panel may not update properly when selecting different elements
- Event handling for property changes may be inconsistent
- The codebase is undergoing significant refactoring

### Project Structure

The project has two main folders:
- `mcp/`: Contains the original implementation with HTML/CSS/JS in a single file
- `src/`: Contains the modular implementation (work in progress)

### Development

To build the project:
```
npm run build
```

To run the development server with hot reloading:
```
npm run dev
```

### Configuration

The plugin can be configured to use either the original implementation or the modular one by editing the `manifest.json` file:

For original implementation:
```json
{
  "main": "mcp/plugin.js",
  "ui": "mcp/mcp-ui.html"
}
```

For modular implementation:
```json
{
  "main": "dist/plugin.js",
  "ui": "dist/ui.html"
}
```

## Contributing

Contributions are welcome, but please be aware of the current instability of the codebase. 