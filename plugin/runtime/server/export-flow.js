export function exportTreeToServer(tree) {
  const payload = { name: 'tree.json', contents: tree };
  console.log('🌳 [EXPORT] Sending tree to server:', payload);

  fetch('http://localhost:3001/save-tree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('Tree save failed');
      return res.text(); // ⬅️ log body if there is one
    })
    .then(response => {
      console.log('🌳 Server response (tree):', response);
    })
    .catch(err => {
      console.error('❌ Server tree.json export failed:', err);
    });
}

export function exportImageToServer(name, bytes) {
  const payload = { name: name || 'image.png', bytes };
  console.log(`🖼 [EXPORT] Sending image to server: ${name} (bytes: ${bytes?.length})`);

  fetch('http://localhost:3001/save-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('Image save failed');
      return res.text();
    })
    .then(response => {
      console.log(`🖼 Server response (image ${name}):`, response);
    })
    .catch(err => {
      console.error(`❌ Server image export failed (${name}):`, err);
    });
}

export function triggerFontResolution() {
  console.log('🧩 [EXPORT] Triggering font resolution...');

  fetch('http://localhost:3001/resolve-fonts', {
    method: 'POST'
  })
    .then(res => {
      if (!res.ok) throw new Error('Font resolution failed');
      return res.text();
    })
    .then(response => {
      console.log('🧩 Server response (fonts):', response);
    })
    .catch(err => {
      console.error('❌ Font resolution error:', err);
    });
}
