import { exec } from 'child_process';
import http from 'http';

// Function to check if the server is running
export function checkServer(callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/ping',
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      callback(null);
    } else {
      callback(new Error('Server not running'));
    }
  });

  req.on('error', () => {
    callback(new Error('Server not running'));
  });

  req.end();
}

// Function to start the server if it's not running
export function startServer(callback) {
  const server = exec('node server.js', { cwd: './' });

  server.stdout.on('data', (data) => {
    console.log(`Server Output: ${data}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  server.on('close', (code) => {
    if (code === 0) {
      console.log('Server started successfully');
      callback(null);
    } else {
      console.error(`Server exited with code ${code}`);
      callback(new Error('Failed to start server'));
    }
  });
}

// Main function to check and start server
export function handleServerStart(callback) {
  checkServer((err) => {
    if (err) {
      console.log('Server not running. Starting server...');
      startServer(callback);
    } else {
      console.log('Server is already running');
      callback(null);
    }
  });
}

// 🚨 REMOVE this old auto-run block:
// handleServerStart((err) => {
//   if (err) {
//     console.error('Could not start the server:', err);
//     return;
//   }
//   console.log('Exporting...');
// });
