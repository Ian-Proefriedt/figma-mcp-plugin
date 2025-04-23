// server.js
// A simple local image receiver that listens for streamed image data
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure image directory exists
const imageDir = path.resolve(__dirname, 'data/images');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

app.post('/save-image', (req, res) => {
  const { name, bytes } = req.body;
  if (!name || !bytes) return res.status(400).send('Missing name or bytes');

  const filePath = path.resolve(__dirname, 'data/images', name);
  console.log('🧾 Writing to:', filePath);

  fs.writeFile(filePath, Buffer.from(bytes), err => {
    if (err) {
      console.error(`❌ Failed to save ${name}:`, err);
      return res.status(500).send('Write failed');
    }
    console.log(`✅ Saved ${filePath}`);
    res.sendStatus(200);
  });
});

app.post('/save-tree', (req, res) => {
  const { name, contents } = req.body;
  if (!name || !contents) return res.status(400).send('Missing name or contents');

  const filePath = path.resolve(__dirname, 'data', name);
  console.log('🌳 __dirname:', __dirname);
  console.log('🌳 Incoming name:', name);
  console.log('🌳 Resolved path:', filePath);
  console.log('🧾 Writing to:', filePath);

  fs.writeFile(filePath, JSON.stringify(contents, null, 2), err => {
    if (err) {
      console.error(`❌ Failed to save tree:`, err);
      return res.status(500).send('Write failed');
    }
    console.log(`🌳 Saved tree to ${filePath}`);
    res.sendStatus(200);
  });
});

app.post('/resolve-fonts', (req, res) => {
  console.log('🔁 Received font resolution request');
  exec('node scripts/generate-fonts.js && node scripts/resolve-local-fonts.js && node scripts/resolve-google-fonts.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Font resolution failed:', err);
      return res.status(500).send('Font resolution failed');
    }
    console.log('🔠 Font resolution output:\n', stdout);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log('🧭 __dirname:', __dirname);
  console.log('📂 process.cwd():', process.cwd());
  console.log(`🖼 Data Transfer Automation Active at http://localhost:${PORT}`);
});
