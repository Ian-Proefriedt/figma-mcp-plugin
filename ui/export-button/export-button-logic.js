export function setupExportButtonHandler() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'export-to-server') {
        console.log('🚀 Export button clicked');
        parent.postMessage({ pluginMessage: { type: 'start-export' } }, '*');
      }
    });
  }