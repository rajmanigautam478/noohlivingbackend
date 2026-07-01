const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

const endpoints = [
  { name: 'Root Test API', path: '/', method: 'GET' },
  { name: 'Get Categories', path: '/api/categories', method: 'GET' },
  { name: 'Get Blogs', path: '/api/blogs', method: 'GET' },
  { name: 'Get Collections', path: '/api/collections', method: 'GET' },
  { name: 'Get Contacts', path: '/api/contact', method: 'GET' },
  { name: 'Get Gallery', path: '/api/gallery', method: 'GET' },
  { name: 'Get Home Detail', path: '/api/home', method: 'GET' },
  { name: 'Get Products', path: '/api/products', method: 'GET' },
  { name: 'Get Projects', path: '/api/projects', method: 'GET' },
  { name: 'Get Services', path: '/api/services', method: 'GET' },
  { name: 'Get Testimonials', path: '/api/testimonials', method: 'GET' }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint.path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          name: endpoint.name,
          path: endpoint.path,
          status: res.statusCode,
          success: res.statusCode === 200,
          error: null
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'Offline',
        success: false,
        error: err.message
      });
    });
  });
}

async function runTests() {
  console.log('\x1b[36m%s\x1b[0m', '==============================================');
  console.log('\x1b[36m%s\x1b[0m', '        NOOH LIVING API AUTO-TESTER           ');
  console.log('\x1b[36m%s\x1b[0m', '==============================================');
  console.log(`Checking endpoints on ${BASE_URL}...\n`);

  let allPassed = true;
  let offline = false;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.status === 'Offline') {
      offline = true;
    }
    
    if (result.success) {
      console.log(`\x1b[32m✔ [PASS] [Status: 200] ${result.name} (${result.path})\x1b[0m`);
    } else {
      allPassed = false;
      console.log(`\x1b[31m✘ [FAIL] [Status: ${result.status}] ${result.name} (${result.path}) - ${result.error || 'Non-200 status'}\x1b[0m`);
    }
  }

  console.log('\n\x1b[36m%s\x1b[0m', '==============================================');
  if (offline) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  Warning: Server offline. Please start the server using "npm run dev" first!');
  } else if (allPassed) {
    console.log('\x1b[32m%s\x1b[0m', '🎉 All GET APIs are working fine!');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ Some APIs failed. Please check the errors above.');
  }
  console.log('\x1b[36m%s\x1b[0m', '==============================================');
}

runTests();
