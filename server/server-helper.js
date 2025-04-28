import { exec } from 'child_process';
import http from 'http';

// Function to check if the server is running
function checkServer(callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/ping',  // This route is used to check if the server is alive
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      callback(null);  // Server is running
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
function startServer(callback) {
  // Using spawn to allow real-time logging from server.js
  const server = exec('node server.js', { cwd: './server' });

  // Listen to stdout (standard output) from server.js
  server.stdout.on('data', (data) => {
    console.log(`Server Output: ${data}`);
  });

  // Listen to stderr (error output) from server.js
  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  // Handle the exit status
  server.on('close', (code) => {
    if (code === 0) {
      console.log('Server started successfully');
      callback(null);  // Server started successfully
    } else {
      console.error(`Server exited with code ${code}`);
      callback(new Error('Failed to start server'));
    }
  });
}

// Main function to check and start server
function handleServerStart(callback) {
  checkServer((err) => {
    if (err) {
      console.log('Server not running. Starting server...');
      startServer(callback);  // Start the server if it's not running
    } else {
      console.log('Server is already running');
      callback(null);
    }
  });
}

// Export logic: Check and start the server before proceeding
handleServerStart((err) => {
  if (err) {
    console.error('Could not start the server:', err);
    return;
  }

  // Proceed with the export after the server has started
  console.log('Exporting...');
  // Your export logic here
});