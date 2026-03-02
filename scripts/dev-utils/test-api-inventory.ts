import 'dotenv/config';

async function main() {
  // Simulate API call như frontend làm
  const testPayload = {
    name: "Test Product Inventory",
    sku: "TEST-INV-001",
    pkgxId: 99999,
    status: 'ACTIVE',
    type: 'PHYSICAL',
    unit: 'Cái',
    sellingPrice: 0,
    costPrice: 0,
    minPrice: 0,
    reorderLevel: 10,
    inventory: {
      onHand: 500,
    },
    pkgxPrices: {
      shop_price: 100000,
      market_price: 120000,
      partner_price: 90000,
      ace_price: 85000,
      deal_price: 110000,
    },
  };
  
  console.log('Sending payload:', JSON.stringify(testPayload, null, 2));
  
  // Get session token from env or hardcode for testing
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Need to add auth cookie here
    },
    body: JSON.stringify(testPayload),
  });
  
  const result = await response.json();
  console.log('Response status:', response.status);
  console.log('Response:', JSON.stringify(result, null, 2));
}

main();
