import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { pathname } = req.url;
  
  // Set headers to allow iframe embedding
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://app.kontent.ai https://*.kontent.ai https://manage.kontent.ai");
  res.setHeader('Access-Control-Allow-Origin', 'https://app.kontent.ai');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Explicitly remove X-Frame-Options if it exists
  res.removeHeader('X-Frame-Options');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Serve static files
  let filePath;
  let contentType = 'text/html';
  
  if (pathname === '/' || pathname === '/index.html') {
    filePath = join(process.cwd(), 'dist', 'index.html');
  } else if (pathname.startsWith('/assets/')) {
    filePath = join(process.cwd(), 'dist', pathname);
    
    // Set content type based on file extension
    if (pathname.endsWith('.js')) {
      contentType = 'application/javascript';
    } else if (pathname.endsWith('.css')) {
      contentType = 'text/css';
    } else if (pathname.endsWith('.json')) {
      contentType = 'application/json';
    }
  } else {
    // For SPA routing, serve index.html
    filePath = join(process.cwd(), 'dist', 'index.html');
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', contentType);
    res.status(200).send(content);
  } catch (error) {
    // If file not found, serve index.html for SPA routing
    try {
      const indexContent = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(indexContent);
    } catch (indexError) {
      res.status(404).send('File not found');
    }
  }
} 