export function setupExportHandlers() {
  const handledExportIds = new Set();
  const exportStates = new Map();
  const VERBOSE = false;

  function generateExportId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function checkExportCompletion(exportId) {
    const state = exportStates.get(exportId);
    if (VERBOSE) {
      console.log('[✅ checkExportCompletion()]');
      console.log('   exportId:', exportId);
      console.log('   state:', state);
    }

    if (!state) return;
    if (!state.tree || !state.fonts || !state.imageExportComplete || state.completionSent) return;

    state.completionSent = true;

    const summary = {
      exportId,
      trees: ['(1 tree - see server for full details)'],
      fonts: state.fonts || [],
      images: Array.from(state.images)
    };

    setTimeout(() => {
      fetch('http://localhost:3001/signal-export-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
      })
        .then(() => {
          console.log(`🚀 Export complete [exportId=${exportId}]`);
          const exportButton = document.querySelector('.export-button');
          if (exportButton) exportButton.disabled = false;
        });
    }, 300);
  }

  const exportButton = document.querySelector('.export-button');
  if (exportButton && !exportButton.dataset.bound) {
    exportButton.dataset.bound = 'true';
    exportButton.addEventListener('click', () => {
      if (exportButton.disabled) return;
      exportButton.disabled = true;

      const exportId = generateExportId();
      console.log(`🚀 Export started [exportId=${exportId}]`);

      parent.postMessage({ pluginMessage: { type: 'start-export', exportId } }, '*');
    });
  }

  window.addEventListener('message', (event) => {
    const msg = event.data.pluginMessage;
    if (!msg) return;

    const exportId = msg.exportId;
    const requiresExportId = ['export-tree-to-server', 'trigger-font-resolution', 'export-image'];

    if (requiresExportId.includes(msg.type) && !exportId) {
      console.warn('❗ Ignoring export message without exportId:', msg);
      return;
    }

    if (exportId && !exportStates.has(exportId)) {
      exportStates.set(exportId, {
        tree: false,
        fonts: false,
        images: new Set(),
        imageExportComplete: false,
        completionSent: false,
        expectedImages: 0,
        savedImages: 0
      });
    }

    const state = exportStates.get(exportId);
    if (!state) return;

    switch (msg.type) {
      case 'sanitize-warnings':
        if (Array.isArray(msg.warnings) && msg.warnings.length > 0) {
          console.log(
            `%c⚠️ [${msg.warnings.length}] Unsafe Symbols Stripped:`,
            'color: #fdf3ad; background:#413c27; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
            { paths: msg.warnings }
          );
        }
        break;

      case 'image-export-count':
        state.expectedImages = msg.count;
        state.savedImages = 0;
        break;

      case 'export-tree-to-server':
        if (handledExportIds.has(exportId)) return;
        handledExportIds.add(exportId);

        fetch('http://localhost:3001/save-tree', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...msg.tree, exportId })
        })
          .then(res => res.ok ? res.text() : Promise.reject('Tree save failed'))
          .then(() => {
            console.log(`🌳 Tree saved [${exportId}]`);
            state.tree = true;

            return fetch('http://localhost:3001/resolve-fonts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ exportId })
            });
          })
          .then(res => res.ok ? res.json() : Promise.reject('Font resolution failed'))
          .then(response => {
            state.fonts = response.fonts || [];
            state.fonts.forEach(font => {
              console.log(`🔤 Font saved: ${font} [${exportId}]`);
            });
            console.log(`📦 Font export complete [${exportId}]`);
          })
          .catch(err => {
            console.error('❌ Font resolution failed:', err);
          })
          .then(() => {
            console.log(`📦 Triggering image export [${exportId}]`);
            parent.postMessage({
              pluginMessage: {
                type: 'begin-image-export',
                exportId
              }
            }, '*');
          });          
        break;

      case 'export-image':
        fetch('http://localhost:3001/save-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: msg.name,
            bytes: msg.bytes,
            exportId
          })
        })
          .then(res => res.ok ? res.text() : Promise.reject('Image save failed'))
          .then(() => {
            console.log(`🖼️ Image saved: ${msg.name} [${exportId}]`);
            state.images.add(msg.name);
            state.savedImages += 1;

            if (state.savedImages === state.expectedImages) {
              console.log(`📦 Image export complete [${exportId}]`);
              state.imageExportComplete = true;
            }

            checkExportCompletion(exportId);
          })
          .catch(err => {
            console.error(`❌ Image export failed (${msg.name}):`, err);
          });
        break;
    }
  });
}
