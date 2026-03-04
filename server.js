import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

// Custom middleware to set proper MIME types
app.use((req, res, next) => {
  const filePath = path.join(process.cwd(), req.path);
  
  // Set MIME types based on file extension
  if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json');
  } else if (req.path.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  } else if (req.path.endsWith('.jpg') || req.path.endsWith('.jpeg')) {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (req.path.endsWith('.svg')) {
    res.setHeader('Content-Type', 'image/svg+xml');
  } else if (req.path.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html');
  }
  
  next();
});

// Serve static files with proper MIME types
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    switch (ext) {
      case '.js':
      case '.mjs':
        res.setHeader('Content-Type', 'application/javascript');
        break;
      case '.css':
        res.setHeader('Content-Type', 'text/css');
        break;
      case '.json':
        res.setHeader('Content-Type', 'application/json');
        break;
      case '.html':
        res.setHeader('Content-Type', 'text/html');
        break;
    }
  }
}));

// Serve the admin panel as the main page
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(process.cwd(), 'admin-panel.html'));
});

// Handle SPA routing - catch all other routes
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(process.cwd(), 'admin-panel.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
