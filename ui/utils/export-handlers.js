export function setupExportHandlers() {
  const handledExportIds = new Set();
  const exportStates = new Map(); // exportId → { tree, fonts, images: Set, completionSent }

  function generateExportId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function checkExportCompletion(exportId) {
    const state = exportStates.get(exportId);
    if (!state || !state.tree || !state.fonts || !state.images || state.completionSent) return;

    // Mark completion as sent
    state.completionSent = true;

    const summary = {
      exportId,
      trees: ['(1 tree - see server for full details)'],
      fonts: [], // optional, can be added later
      images: Array.from(state.images)
    };

    setTimeout(() => {
      fetch('http://localhost:3001/signal-export-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
      }).then(() => {
        console.log(`🚀 Signal sent: export complete for exportId=${exportId}`);
        
        // Re-enable the export button after completion
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
      exportButton.disabled = true; // optional: debounce safeguard

      const exportId = generateExportId();
      console.log('🚀 Export button clicked → starting export with exportId:', exportId);

      parent.postMessage({ pluginMessage: { type: 'start-export', exportId } }, '*');
    });
  }

  window.addEventListener('message', (event) => {
    const msg = event.data.pluginMessage;
    if (!msg) return;

    const requiresExportId = ['export-tree-to-server', 'trigger-font-resolution', 'export-image'];
    if (requiresExportId.includes(msg.type) && !msg.exportId) {
      console.warn('❗ Ignoring plugin export message: missing exportId', msg);
      return;
    }

    const exportId = msg.exportId;

    if (exportId && !exportStates.has(exportId)) {
      exportStates.set(exportId, {
        tree: false,
        fonts: false,
        images: new Set(),
        completionSent: false // Prevent sending multiple completions
      });
    }

    const state = exportId ? exportStates.get(exportId) : null;

    if (msg.type === 'export-tree-to-server') {
      if (handledExportIds.has(exportId)) {
        console.warn(`⚠️ Skipping duplicate export run for exportId=${exportId}`);
        return;
      }

      handledExportIds.add(exportId);

      fetch('http://localhost:3001/save-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...msg.tree, exportId })
      })
        .then(res => res.ok ? res.text() : Promise.reject('Tree save failed'))
        .then(response => {
          console.log(`🌳 Tree streamed to server [exportId=${exportId}]`, response);
          state.tree = true;

          return fetch('http://localhost:3001/resolve-fonts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exportId })
          });
        })
        .then(res => res.ok ? res.text() : Promise.reject('Font resolution failed'))
        .then(response => {
          console.log(`🧩 Fonts resolved [exportId=${exportId}]`, response);
          state.fonts = true;

          parent.postMessage({
            pluginMessage: {
              type: 'begin-image-export',
              exportId
            }
          }, '*');
        })
        .catch(err => {
          console.error('❌ Export failed:', err);
        });
    }

    else if (msg.type === 'export-image') {
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
        .then(response => {
          console.log(`🖼️ Image streamed to server: ${msg.name} [exportId=${exportId}]`, response);
          state.images.add(msg.name);
          checkExportCompletion(exportId); // Check if all exports are completed
        })
        .catch(err => {
          console.error(`❌ Image export failed (${msg.name}):`, err);
        });
    }

    // 🟢 Phase 4: Image Export Completion
    else if (msg.type === 'image-export-complete') {
      checkExportCompletion(exportId); // Final check to signal completion
    }
  });
}