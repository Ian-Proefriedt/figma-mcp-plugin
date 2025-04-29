import express from 'express';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
const port = 3001;
const wsPort = 3002;

// Enable JSON parsing
app.use(express.json({ limit: '50mb' }));

// Set up WebSocket server for AI agent (Cursor) communication
const wss = new WebSocketServer({ port: wsPort });
let connectedClients = [];

wss.on('connection', (ws) => {
  console.log('✅ Cursor connected via WebSocket');
  connectedClients.push(ws);

  ws.on('close', () => {
    connectedClients = connectedClients.filter(client => client !== ws);
  });
});

// Broadcast message to all connected WebSocket clients
function notifyCursor(message) {
  for (const client of connectedClients) {
    client.send(JSON.stringify(message));
  }
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
    res.sendStatus(200);
  });
});

// Start HTTP server
app.listen(port, () => {
  console.log(`🚀 MCP HTTP server running at http://localhost:${port}`);
  console.log(`🔌 MCP WebSocket server running at ws://localhost:${wsPort}`);
});
