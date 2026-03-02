import 'dotenv/config';

async function main() {
  // 1. Get PKGX product
  console.log('1. Fetching PKGX product...');
  const pkgxRes = await fetch('https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=get_products&page=1&limit=1', {
    headers: { 'X-API-KEY': 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6' },
  });
  const pkgxData = await pkgxRes.json();
  const pkgxProd = pkgxData.data[0];
  
  console.log('PKGX Product:');
  console.log('  goods_id:', pkgxProd.goods_id);
  console.log('  goods_name:', pkgxProd.goods_name);
  console.log('  goods_number:', pkgxProd.goods_number, '- type:', typeof pkgxProd.goods_number);
  
  // 2. Build request body similar to frontend
  const body = {
    name: pkgxProd.goods_name,
    sku: `TEST-INV-${Date.now()}`,
    pkgxId: Number(pkgxProd.goods_id),
    status: 'ACTIVE',
    type: 'PHYSICAL',
    unit: 'Cái',
    sellingPrice: 0,
    costPrice: 0,
    reorderLevel: Number(pkgxProd.warn_number) || 10,
    // Inventory - this is what we're testing
    inventory: {
      onHand: Number(pkgxProd.goods_number) || 0,
    },
    // PKGX prices
    pkgxPrices: {
      shop_price: Number(pkgxProd.shop_price) || 0,
      market_price: Number(pkgxProd.market_price) || 0,
      ace_price: Number(pkgxProd.ace_price) || 0,
    },
  };
  
  console.log('\n2. Request body:');
  console.log('  inventory:', JSON.stringify(body.inventory));
  console.log('  pkgxPrices:', JSON.stringify(body.pkgxPrices));
  
  // 3. Call HRM API
  console.log('\n3. Calling HRM API...');
  const hrmRes = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const hrmData = await hrmRes.json();
  console.log('Response:', JSON.stringify(hrmData, null, 2).slice(0, 500));
  
  if (hrmData.data?.systemId) {
    console.log('\n4. Checking created product inventory...');
    const { prisma } = await import('./lib/prisma');
    
    const inventory = await prisma.productInventory.findMany({
      where: { productId: hrmData.data.systemId },
    });
    console.log('ProductInventory records:', inventory.length);
    inventory.forEach((inv: any) => console.log('  onHand:', inv.onHand, 'branchId:', inv.branchId));
    
    // Cleanup - delete test product
    console.log('\n5. Cleaning up...');
    await prisma.productInventory.deleteMany({ where: { productId: hrmData.data.systemId } });
    await prisma.productPrice.deleteMany({ where: { productId: hrmData.data.systemId } });
    await prisma.product.delete({ where: { systemId: hrmData.data.systemId } });
    console.log('Deleted test product');
    
    await prisma.$disconnect();
  }
}
main();
