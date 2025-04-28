import { renderAllProperties } from '../property-blocks/render-all-properties.js';

export function setupSelectionChangeHandler() {
  window.addEventListener('message', (event) => {
    const msg = event.data.pluginMessage;
    if (msg?.type === 'selection-change' && msg.data) {
      renderAllProperties(msg.data);
    }
  });
}
