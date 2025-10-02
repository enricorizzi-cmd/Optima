#!/usr/bin/env node

/**
 * Build Frontend with Backend URL
 * Updates the build environment with the correct backend URL
 */

if (process.argv.length < 3) {
  console.log('Usage: node scripts/build-with-backend-url.js <BACKEND_URL>');
  console.log('Example: node scripts/build-with-backend-url.js https://optima-backend-h0z2.onrender.com');
  process.exit(1);
}

const backendUrl = process.argv[2];
console.log(`🔄 Building frontend with backend URL: ${backendUrl}`);

// Set environment variable for the build
process.env.VITE_BACKEND_URL = backendUrl;

// Execute npm build
const { spawn } = require('child_process');

console.log('📦 Starting frontend build...');

const build = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_BACKEND_URL: backendUrl
  },
  shell: true
});

build.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Frontend build completed successfully!');
    console.log(`🌐 Backend URL configured: ${backendUrl}`);
    console.log('🚀 Ready for deployment');
  } else {
    console.log(`❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});
