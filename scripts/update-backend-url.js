#!/usr/bin/env node

/**
 * Update Backend URL Script
 * Updates frontend environment with backend URL once it's deployed
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating backend URL in frontend...');

// This would be called after backend deployment
// For now, we'll show what needs to be updated
const backendUrl = process.argv[2] || 'https://optima-backend.onrender.com';

console.log(`📡 Backend URL: ${backendUrl}`);

// Files to update
const envFile = path.join(__dirname, '../app/.env');
const envExample = path.join(__dirname, '../app/.env.example');

// Update environment files
const updates = [
  {
    file: envFile,
    updates: {
      'VITE_BACKEND_URL': backendUrl
    }
  }
];

updates.forEach(({ file, updates }) => {
  console.log(`📝 Updating ${file}...`);
  
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
        console.log(`  ✅ Updated ${key}`);
      } else {
        content += `\n${key}=${value}`;
        console.log(`  ➕ Added ${key}`);
      }
    });
    
    fs.writeFileSync(file, content);
  } else {
    console.log(`  ⚠️  File ${file} not found - creating template`);
    const template = Object.entries(updates)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';
    fs.writeFileSync(file, template);
  }
});

console.log('✨ Frontend URL update completed!');
console.log('🔄 Make sure to commit and push changes to trigger frontend redeploy');
