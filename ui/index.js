// /ui/index.js

// Import layout and UI components
import { pluginHeaderUI } from './main/plugin-header-layout.js';
import './main/plugin-container-styles.css';  // Global container styles
import './main/theme-tokens.css';              // Global theme tokens
import { propertiesUI } from './property-sections/property-sections-layout.js'; // Property sections layout
import { exportButtonUI } from './export-button/export-button-layout.js';  // Export button layout

// Import frontend logic to handle incoming messages
import { setupSelectionChangeHandler } from './selection/selection-change.js'; // Frontend UI listener

// Insert the HTML into the UI container
document.getElementById('plugin-ui').innerHTML = `
  ${pluginHeaderUI}
  ${propertiesUI}
  ${exportButtonUI}
`;

// Setup frontend listeners (listen for selection changes, etc.)
setupSelectionChangeHandler();

// Additional UI logic can be added here if needed
