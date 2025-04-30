
export function setupExportHandlers() {
    window.onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (!msg) return;
      
    console.log('📨 UI received plugin message:', msg);
  
    if (msg.type === 'export-tree-to-server') {
      fetch('http://localhost:3001/save-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg.tree)
      })
        .then(res => {
          if (!res.ok) throw new Error('Tree save failed');
          return res.text();
        })
        .then(response => {
          console.log('🌳 Tree streamed to server:', response);
        })
        .catch(err => {
          console.error('❌ Tree export failed:', err);
        });
    }
  
    else if (msg.type === 'export-image') {
      fetch('http://localhost:3001/save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: msg.name, bytes: msg.bytes })
      })
        .then(res => {
          if (!res.ok) throw new Error('Image save failed');
          return res.text();
        })
        .then(response => {
          console.log(`🖼️ Image streamed to server: ${msg.name}`, response);
        })
        .catch(err => {
          console.error(`❌ Image export failed (${msg.name}):`, err);
        });
    }
  
    else if (msg.type === 'trigger-font-resolution') {
      fetch('http://localhost:3001/resolve-fonts', {
        method: 'POST'
      })
        .then(res => {
          if (!res.ok) throw new Error('Font resolution failed');
          return res.text();
        })
        .then(response => {
          console.log('🧩 Fonts resolved:', response);
        })
        .catch(err => {
          console.error('❌ Font resolution failed:', err);
        });
    }
  };
}