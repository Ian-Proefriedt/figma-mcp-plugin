import { renderPropertyBlock } from './render-property-blocks.js';
import { PropertyMap } from './property-blocks-map.js';

export function renderAllProperties(data) {
  for (const section in PropertyMap) {
    const containerId = `${section}-properties`;
    const values = section === 'layout' ? { ...data.layout, type: data.type } : data[section] || {};
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';

    PropertyMap[section].forEach(({ key, label, transform }) => {
      const value = values?.[key];
      const finalValue = transform ? transform(value) : value;
      renderPropertyBlock(containerId, label, finalValue);
    });
  }
}
