export function renderPropertyBlock(containerId, label, value) {
    const container = document.getElementById(containerId);
    if (!container || value === undefined || value === null) return;
  
    const block = document.createElement('div');
    block.className = 'property-block';
    block.innerHTML = `
      <div class="property-label">${label}</div>
      <div class="property-value">${value}</div>
    `;
    container.appendChild(block);
  }
  