import express from 'express';
import path from 'path';
import fs from 'fs';

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
  res.sendFile(path.join(process.cwd(), 'admin-panel.html'));
});

// Handle SPA routing - catch all other routes
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), 'admin-panel.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
