const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files with correct MIME types
app.use(express.static('dist', {
  setHeaders: (res, filePath) => {
    // Set correct MIME types
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Handle routes
app.get('/reveal', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'reveal.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin.html'));
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
}); 