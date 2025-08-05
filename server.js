const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set proper headers for iframe embedding
app.use((req, res, next) => {
  // Remove X-Frame-Options to allow iframe embedding
  res.removeHeader('X-Frame-Options');
  
  // Set Content Security Policy to allow Kontent.ai domains
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://app.kontent.ai https://*.kontent.ai https://manage.kontent.ai"
  );
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://app.kontent.ai');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`App available at: http://localhost:${PORT}`);
  console.log('Ready for Kontent.ai iframe embedding!');
}); 