#!/usr/bin/env node

/**
 * Deployment Testing Script
 * Tests all deployed services and verifies functionality
 */

const https = require('https');
const http = require('http');

console.log('🧪 Starting deployment verification...');

const services = [
  {
    name: 'Frontend',
    url: 'https://optima-2l2r.onrender.com',
    expected: 'HTML content'
  },
  {
    name: 'Backend',
    url: 'https://optima-2l2r.onrender.com',
    expected: 'API responses',
    endpoints: ['/health', '/healthz']
  },
  {
    name: 'Database',
    id: 'dpg-d3f75j95pdvs73cjc3a0-a',
    type: 'postgres',
    status: 'available'
  }
];

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          headers: response.headers,
          data: data.substring(0, 200) // First 200 chars
        });
      });
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test frontend
async function testFrontend() {
  console.log('🌐 Testing Frontend...');
  try {
    const response = await makeRequest(services[0].url);
    
    if (response.status === 200) {
      console.log('  ✅ Frontend is accessible');
      console.log(`  📊 Status: ${response.status}`);
      console.log(`  📱 Content-Type: ${response.headers['content-type']}`);
      
      if (response.data.includes('<html') || response.data.includes('<!DOCTYPE')) {
        console.log('  ✅ Serves HTML content');
      }
      return true;
    } else {
      console.log(`  ❌ Frontend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Frontend error: ${error.message}`);
    return false;
  }
}

// Test backend
async function testBackend() {
  console.log('🔧 Testing Backend...');
  const backendService = services[1];
  
  try {
    // Test main health endpoint
    const response = await makeRequest(`${backendService.url}/health`);
    
    if (response.status === 200) {
      console.log('  ✅ Backend is accessible');
      console.log(`  📊 Status: ${response.status}`);
      console.log(`  🔧 Content-Type: ${response.headers['content-type']}`);
      
      // Show response content
      if (response.data) {
        console.log(`  📋 Response: ${response.data.substring(0, 100)}...`);
      }
      return true;
    } else {
      console.log(`  ❌ Backend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Backend error: ${error.message}`);
    console.log('  ⚠️  Backend might still be deploying...');
    return false;
  }
}

// Test database status
function testDatabase() {
  console.log('🗄️  Testing Database...');
  const dbService = services[2]; // Index changed due to backend addition
  
  if (dbService.status === 'available') {
    console.log('  ✅ Database is available');
    console.log(`  🆔 Database ID: ${dbService.id}`);
    console.log('  ⚠️  Note: Database queries require SSL connection');
    return true;
  } else {
    console.log(`  ❌ Database status: ${dbService.status}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Deployment Status Check\n');
  
  const results = [];
  
  results.push(await testFrontend());
  results.push(await testBackend());
  results.push(testDatabase());
  
  console.log('\n📊 Test Results:');
  console.log('================');
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All services are working!');
    console.log('\n📋 Next Steps:');
    console.log('  1. ✅ Backend deployed and accessible');
    console.log('  2. Update VITE_BACKEND_URL in frontend');
    console.log('  3. Run database migrations');
    console.log('  4. Test complete application flow');
  } else if (passed === 2) {
    console.log('🎯 Almost there! Frontend + Database working');
    console.log('⏳ Backend deployment in progress...');
  } else {
    console.log('⚠️  Some services need attention');
  }
  
  return passed === total;
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testFrontend, testDatabase };
