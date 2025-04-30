import { pluginHeaderUI } from './main/plugin-header-layout.js';
import './main/theme-tokens.css';
import './main/plugin-container-styles.css';
import './property-sections/property-sections-styles.css';
import './property-blocks/property-blocks-styles.css';
import { propertiesUI } from './property-sections/property-sections-layout.js';

import { exportButtonUI } from './export-button/export-button-layout.js';
import { setupExportButtonHandler } from './export-button/export-button-logic.js';

import { setupSelectionChangeHandler } from './selection/selection-change.js';

console.log("🔥 plugin-ui.bundle.js has loaded");

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plugin-ui');
  if (container) {
    container.innerHTML = `
      ${pluginHeaderUI}
      ${propertiesUI}
      ${exportButtonUI}
    `;
    console.log("✅ Real UI injected");
  } else {
    console.error("❌ #plugin-ui not found");
  }

  setupSelectionChangeHandler();    // 👁️ Handles selection-change message from plugin
  setupExportButtonHandler();       // 🚀 Triggers 'trigger-manual-export' message to plugin
});

// ✅ Guarded listener: UI only responds to safe messages
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (!msg || msg.type !== 'selection-change') return;

  console.log('📨 UI received selection-change:', msg);
  // setupSelectionChangeHandler handles it
};