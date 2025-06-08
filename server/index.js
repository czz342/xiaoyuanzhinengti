const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 3000;

// -- HTTP Server for Webhooks --
const app = express();
// Use express.json() to parse JSON bodies
app.use(express.json());

const server = http.createServer(app);

// -- WebSocket Server --
const wss = new WebSocket.Server({ server });

let clientSocket = null; // We only expect one client (the mini-program)

wss.on('connection', (ws) => {
  console.log('✅ WebSocket Client connected');
  clientSocket = ws;

  ws.on('message', (message) => {
    console.log('WS received message from client: %s', message);
    // Echo back for testing
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket Client disconnected');
    clientSocket = null;
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
    clientSocket = null;
  });
});

// -- Webhook Endpoint --
app.post('/webhook', (req, res) => {
  const webhookData = req.body;
  console.log('➡️  Received webhook data:', JSON.stringify(webhookData, null, 2));

  // Forward data to the connected WebSocket client
  if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
    clientSocket.send(JSON.stringify(webhookData));
    console.log('🚀 Forwarded data to WebSocket client.');
    res.status(200).send('OK');
  } else {
    console.warn('⚠️  No WebSocket client connected. Could not forward data.');
    res.status(503).send('No client connected');
  }
});

// Default route for checking if the server is up
app.get('/', (req, res) => {
  res.send('Webhook server is running. Ready for WebSocket connections.');
});

// -- Start Server --
server.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
  console.log('   - Webhook endpoint: http://localhost:${port}/webhook');
  console.log('   - WebSocket is running on the same port.');
}); 