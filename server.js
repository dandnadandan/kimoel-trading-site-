import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the original beautiful admin panel
app.get('/', (req, res) => {
  console.log('Request received for /');
  try {
    const filePath = path.join(process.cwd(), 'admin-panel.html');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Admin route
app.get('/admin', (req, res) => {
  console.log('Request received for /admin');
  try {
    const filePath = path.join(process.cwd(), 'admin-panel.html');
    console.log('Admin file path:', filePath);
    console.log('Admin file exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving admin file:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Test route
app.get('/test', (req, res) => {
  console.log('Request received for /test');
  res.send('Test route is working!');
});

// Handle all other routes
app.use((req, res) => {
  console.log('Fallback route:', req.path);
  res.sendFile(path.join(process.cwd(), 'admin-panel.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
  console.log('Current working directory:', process.cwd());
  console.log('Files in directory:', fs.readdirSync(process.cwd()));
});
