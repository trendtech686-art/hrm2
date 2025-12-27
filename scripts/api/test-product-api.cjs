const fetch = require('node-fetch');

async function testApi() {
  // Test với PROD000002
  const url = 'http://localhost:3001/api/files/PROD000002/products';
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log('Response:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testApi();
