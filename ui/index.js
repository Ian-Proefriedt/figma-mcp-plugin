import { pluginHeaderUI } from './main/plugin-header-layout.js';
import './main/theme-tokens.css';
import './main/plugin-container-styles.css';
import './property-sections/property-sections-styles.css';
import './property-blocks/property-blocks-styles.css';
import './export-button/export-button-styles.css';
import { propertiesUI } from './property-sections/property-sections-layout.js';
import { exportButtonUI } from './export-button/export-button-layout.js';
// import { feedbackLogUI } from './feedback-log/feedback-log-layout.js';
import { setupSelectionChangeHandler } from './selection/selection-change.js';
//import { setupExportButtonHandler } from './export-button/export-button-logic.js';
import { setupExportHandlers } from './utils/export-handlers.js';

console.log("🔥 plugin-ui.bundle.js has loaded");

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plugin-ui');
  if (container) {
    container.innerHTML = `
      ${pluginHeaderUI}
      ${propertiesUI}
      ${exportButtonUI}
    `;
    // ${feedbackLogUI} (will need to be inserted back into DOM later)
    console.log("✅ Real UI injected");
  } else {
    console.error("❌ #plugin-ui not found");
  }

  setupSelectionChangeHandler();
  //setupExportButtonHandler();
  setupExportHandlers();
});
