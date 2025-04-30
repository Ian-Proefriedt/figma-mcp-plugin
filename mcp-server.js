import express from 'express';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import http from 'http';

const app = express();
const port = 3001;

app.use(express.json({ limit: '50mb' }));

// Create a shared HTTP + WS server on port 3001
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`🚀 MCP server running at http://localhost:${port}`);
  console.log(`🔌 WebSocket also listening at ws://localhost:${port}`);
});

// Attach WebSocket to the same HTTP server
const wss = new WebSocketServer({ server });
let connectedClients = [];

wss.on('connection', (ws) => {
  console.log('✅ Cursor connected via WebSocket');
  connectedClients.push(ws);

  ws.on('close', () => {
    connectedClients = connectedClients.filter(client => client !== ws);
  });
});

// Broadcast message to Cursor (if connected)
function notifyCursor(message) {
  const json = JSON.stringify(message);
  connectedClients.forEach(client => {
    if (client.readyState === 1) {
      client.send(json);
    }
  });
}

// Ensure /data/images directory exists
const imageDir = path.resolve('data/images');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

// === Save Tree ===
app.post('/save-tree', (req, res) => {
  const { name, contents } = req.body;
  if (!name || !contents) {
    console.warn('❌ Missing name or contents in tree payload');
    return res.status(400).send('Missing name or contents');
  }

  const filePath = path.resolve('data', name);
  fs.writeFile(filePath, JSON.stringify(contents, null, 2), (err) => {
    if (err) {
      console.error(`❌ Failed to save ${name}:`, err);
      return res.status(500).send('Tree write failed');
    }

    console.log(`🌳 Saved tree to ${filePath}`);
    notifyCursor({ type: 'tree-saved', path: filePath });
    res.sendStatus(200);
  });
});

// === Save Image ===
app.post('/save-image', (req, res) => {
  const { name, bytes } = req.body;
  if (!name || !bytes) return res.status(400).send('Missing image name or bytes');

  const filePath = path.join(imageDir, name);
  fs.writeFile(filePath, Buffer.from(bytes), (err) => {
    if (err) {
      console.error(`❌ Failed to save image ${name}:`, err);
      return res.status(500).send('Image write failed');
    }

    console.log(`🖼️ Saved image: ${name}`);
    notifyCursor({ type: 'image-saved', name, path: filePath });
    res.sendStatus(200);
  });
});

// === Resolve Fonts ===
app.post('/resolve-fonts', (req, res) => {
  console.log('🔠 Font resolution triggered...');
  exec('node scripts/generate-fonts.js && node scripts/resolve-local-fonts.js && node scripts/resolve-google-fonts.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Font resolution failed:', err);
      return res.status(500).send('Font resolution error');
    }

    console.log('✅ Fonts resolved:\n', stdout);
    notifyCursor({ type: 'fonts-resolved' });
    res.sendStatus(200);
  });
});