export function exportTreeToServer(tree) {
    fetch('http://localhost:3001/save-tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'tree.json', contents: tree })
    })
    .then(res => {
      if (!res.ok) throw new Error('Tree save failed');
      console.log('🌳 Streamed tree.json to server');
    })
    .catch(err => console.error('❌ Server tree.json export failed:', err));
  }
  
  export function exportImageToServer(name, bytes) {
    fetch('http://localhost:3001/save-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || 'image.png', bytes })
    })
    .then(res => {
      if (!res.ok) throw new Error('Image save failed');
      console.log(`📡 Streamed image to server: ${name}`);
    })
    .catch(err => console.error('❌ Server image export failed:', err));
  }
  
  export function triggerFontResolution() {
    fetch('http://localhost:3001/resolve-fonts', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Font resolution failed');
        console.log('🧩 Fonts resolved.');
      })
      .catch(err => console.error('❌ Font resolution error:', err));
  }
  