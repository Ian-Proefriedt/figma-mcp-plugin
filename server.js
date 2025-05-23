// server.js (ESM version)
// Local export server with WebSocket support for smarter feedback

import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Create HTTP + WebSocket server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🧠 Express + WebSocket server running at http://localhost:${PORT}`);
});

// === WebSocket Server ===
const wss = new WebSocketServer({ server });
let connectedClients = [];

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  connectedClients.push(ws);

  ws.on('message', (message) => {
    console.log('📨 Incoming WebSocket message from client:', message.toString());
    try {
      const parsed = JSON.parse(message);
      broadcastToClients(parsed);
    } catch (err) {
      console.warn('⚠️ Failed to parse incoming WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    connectedClients = connectedClients.filter(c => c !== ws);
    console.log('❌ WebSocket client disconnected');
  });
});

function broadcastToClients(message) {
  const data = JSON.stringify(message);
  connectedClients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

// ✅ Ensure image directory exists
const imageDir = path.resolve(__dirname, 'data/images');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

// ✅ Dedicated image-saving route
app.post('/save-image', (req, res) => {
  const { name, bytes } = req.body;
  if (!name || !bytes) return res.status(400).send('Missing name or bytes');

  const filePath = path.resolve(__dirname, 'data/images', name);
  console.log('🖼️ Writing image to:', filePath);

  fs.writeFile(filePath, Buffer.from(bytes), err => {
    if (err) {
      console.error(`❌ Failed to save image ${name}:`, err);
      return res.status(500).send('Write failed');
    }
    console.log(`✅ Saved image to ${filePath}`);
    broadcastToClients({ type: 'image-saved', name });
    res.sendStatus(200);
  });
});

// ✅ General-purpose export route (tree, token map, or other raw data)
app.post('/save-data', (req, res) => {
  const { name, contents } = req.body;
  if (!name || !contents) return res.status(400).send('Missing name or contents');

  const filePath = path.resolve(__dirname, 'data', name);
  const dirPath = path.dirname(filePath);

  console.log('📦 Saving export file...');
  console.log('   🧾 Requested name:', name);
  console.log('   📂 Directory to create:', dirPath);
  console.log('   📄 Full target path:', filePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }

  fs.writeFile(filePath, JSON.stringify(contents, null, 2), err => {
    if (err) {
      console.error(`❌ Failed to save ${name}:`, err);
      return res.status(500).send('Write failed');
    }

    console.log(`✅ Successfully wrote ${name} to ${filePath}`);

    const eventType = name.includes('variable-map') ? 'variable-map-saved' : 'tree-saved';
    broadcastToClients({ type: eventType, name });

    res.sendStatus(200);
  });
});

// ✅ Font resolution route
app.post('/resolve-fonts', (req, res) => {
  console.log('🔁 Received font resolution request');
  exec('node scripts/generate-fonts.js && node scripts/resolve-local-fonts.js && node scripts/resolve-google-fonts.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Font resolution failed:', err);
      return res.status(500).send('Font resolution failed');
    }

    console.log('🔠 Font resolution output:\n', stdout);
    broadcastToClients({ type: 'fonts-resolved', details: stdout });

    const fontsJsonPath = path.resolve(__dirname, 'data/fonts-needed.json');
    let fontList = [];

    try {
      const raw = fs.readFileSync(fontsJsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      fontList = parsed.map(f => `${f.family} – ${f.style}`);
    } catch (err) {
      console.warn('⚠️ Could not read fonts-needed.json:', err);
    }

    res.status(200).json({ fonts: fontList });
  });
});

// ✅ Final export-complete signal route
app.post('/signal-export-complete', (req, res) => {
  const { exportId, trees, fonts, images } = req.body;

  console.log(`✅ Export complete [exportId=${exportId}]`);
  console.log(`🧾 Tree files: ${trees?.length || 0}`);
  console.log(`🧾 Fonts: ${fonts?.length || 0}`);
  console.log(`🧾 Images: ${images?.length || 0}`);

  broadcastToClients({
    type: 'export-complete',
    exportId,
    trees,
    fonts,
    images
  });

  res.sendStatus(200);
});

// 🤖 From AI (Cursor) to Plugin
app.post('/from-ai', (req, res) => {
  const { type, message, payload } = req.body;
  if (!type || !message) {
    return res.status(400).send('Missing type or message');
  }

  console.log(`🤖 Message from AI: [${type}]`, message);

  broadcastToClients({
    type: 'ai-message',
    message,
    payload
  });

  res.sendStatus(200);
});
