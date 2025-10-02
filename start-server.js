#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildServer } from './backend/dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Create Fastify app for API
const fastifyApp = await buildServer();
// Mount Fastify on Express at /api
app.use('/api', (req, res, next) => {
  // Convert Express req/res to Fastify format
  fastifyApp.inject({
    method: req.method,
    url: req.url,
    payload: req.body,
    cookies: req.headers.cookie,
  }, (err, reply) => {
    if (err) {
      next(err);
      return;
    }
    res.status(reply.statusCode);
    Object.assign(res.getHeaders(), Object.fromEntries(reply.headers || []));
    res.end(reply.payload);
  });
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Optima Fullstack server listening on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});
