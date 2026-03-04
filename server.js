import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the simple admin panel
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'admin-simple.html'));
});

// Handle all other routes by serving the simple admin panel
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), 'admin-simple.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
