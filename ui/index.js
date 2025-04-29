import { pluginHeaderUI } from './main/plugin-header-layout.js';
import './main/theme-tokens.css';
import './main/plugin-container-styles.css';
import './property-sections/property-sections-styles.css';
import './property-blocks/property-blocks-styles.css';
import { propertiesUI } from './property-sections/property-sections-layout.js';

import { setupSelectionChangeHandler } from './selection/selection-change.js';

console.log("🔥 plugin-ui.bundle.js has loaded");

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plugin-ui');
  if (container) {
    container.innerHTML = `
      ${pluginHeaderUI}
      ${propertiesUI}
    `;
    console.log("✅ Real UI injected");
  } else {
    console.error("❌ #plugin-ui not found");
  }

  setupSelectionChangeHandler(); // 🔁 This will hook into plugin messages
});

// 🔁 Required to receive data from plugin and forward it back (for server export)
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;

  console.log('📨 UI received plugin message:', msg);

  // 🔁 Forward to plugin
  parent.postMessage({ pluginMessage: msg }, '*');
};
