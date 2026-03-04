const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Set proper MIME types
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve the admin panel as the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// Handle all other routes by serving admin-panel.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
