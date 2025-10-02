#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { buildServer } from './backend/dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create Fastify app for API
const fastifyApp = await buildServer();

// Mount Fastify on Express at /api
app.use('/api', async (req, res, next) => {
  try {
    // Convert Express req/res to Fastify format
    const result = await fastifyApp.inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers,
      cookies: req.headers.cookie ? { cookie: req.headers.cookie } : undefined,
    });

    // Copy response
    res.status(result.statusCode);
    
    // Copy headers (excluding content-length which will be set automatically)
    Object.entries(result.headers || {}).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'content-length') {
        res.set(key, value);
      }
    });
    
    res.end(result.payload);
  } catch (error) {
    next(error);
  }
});

// Serve static frontend files
const frontendPath = path.join(__dirname, 'app/dist');
app.use(express.static(frontendPath));

// Fallback: serve index.html for SPA routes
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return;
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Optima Fullstack server listening on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});
