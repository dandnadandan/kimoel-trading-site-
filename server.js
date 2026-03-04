import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the basic admin panel for debugging
app.get('/', (req, res) => {
  console.log('Serving admin-basic.html');
  res.sendFile(path.join(process.cwd(), 'admin-basic.html'));
});

// Test route
app.get('/test', (req, res) => {
  console.log('Serving test.html');
  res.sendFile(path.join(process.cwd(), 'test.html'));
});

// Handle all other routes by serving the basic admin panel
app.use((req, res) => {
  console.log('Fallback: serving admin-basic.html');
  res.sendFile(path.join(process.cwd(), 'admin-basic.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
