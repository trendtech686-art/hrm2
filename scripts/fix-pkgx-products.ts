/**
 * Script để khắc phục dữ liệu sản phẩm PKGX đã import trước đó:
 * 1. Tạo stock history "Khởi tạo sản phẩm" cho các sản phẩm chưa có
 * 2. Cập nhật lại ProductPrice từ PKGX API (ace_price, etc.)
 * 
 * Chạy: npx tsx scripts/fix-pkgx-products.ts
 */

import { prisma } from '../lib/prisma';

const PKGX_API_URL = 'https://phukiengiaxuong.com.vn/admin/api_product_hrm.php';
const PKGX_API_KEY = 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6';

interface PkgxProductResponse {
  goods_id: string;
  goods_name: string;
  shop_price: string;
  market_price: string;
  partner_price: string;
  ace_price: number;
  deal_price: string;
}

async function fetchPkgxProduct(goodsId: number): Promise<PkgxProductResponse | null> {
  try {
    const url = `${PKGX_API_URL}?action=get_products&goods_id=${goodsId}`;
    const response = await fetch(url, {
      headers: { 'X-API-KEY': PKGX_API_KEY },
    });
    
    const data = await response.json();
    if (!data.error && data.data?.[0]) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching PKGX product ${goodsId}:`, error);
    return null;
  }
}

async function fixStockHistory() {
  console.log('\n=== Fix Stock History ===');
  
  // Lấy tất cả sản phẩm PKGX
  const pkgxProducts = await prisma.product.findMany({
    where: { pkgxId: { not: null } },
    select: { systemId: true, id: true, name: true, pkgxId: true },
  });
  
  console.log(`Found ${pkgxProducts.length} PKGX products`);
  
  // Lấy tất cả chi nhánh
  const branches = await prisma.branch.findMany({
    where: { isDeleted: false },
    select: { systemId: true, name: true },
  });
  
  console.log(`Found ${branches.length} branches`);
  
  let fixedCount = 0;
  
  for (const product of pkgxProducts) {
    // Kiểm tra xem đã có stock history chưa
    const existingHistory = await prisma.stockHistory.findFirst({
      where: { productId: product.systemId },
    });
    
    if (!existingHistory) {
      console.log(`  Creating stock history for: ${product.name}`);
      
      // Tạo stock history cho tất cả chi nhánh
      await prisma.stockHistory.createMany({
        data: branches.map(branch => ({
          productId: product.systemId,
          branchId: branch.systemId,
          action: 'Khởi tạo sản phẩm',
          source: 'Import & Mapping từ PKGX',
          quantityChange: 0,
          newStockLevel: 0,
          documentId: product.id,
          documentType: 'pkgx_import',
          note: `Import từ PKGX ID: ${product.pkgxId}. Khởi tạo retroactive.`,
        })),
      });
      
      fixedCount++;
    }
  }
  
  console.log(`Fixed stock history for ${fixedCount} products`);
}

async function fixPrices() {
  console.log('\n=== Fix Product Prices ===');
  
  // Lấy price mappings
  const priceMappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  });
  
  console.log(`Price mappings: ${priceMappings.map(m => `${m.priceType} => ${m.pricingPolicyId}`).join(', ')}`);
  
  // Lấy tất cả sản phẩm PKGX
  const pkgxProducts = await prisma.product.findMany({
    where: { pkgxId: { not: null } },
    select: { systemId: true, name: true, pkgxId: true },
  });
  
  console.log(`Found ${pkgxProducts.length} PKGX products to check`);
  
  let updatedCount = 0;
  
  for (const product of pkgxProducts) {
    if (!product.pkgxId) continue;
    
    // Lấy giá hiện tại trong HRM
    const currentPrices = await prisma.productPrice.findMany({
      where: { productId: product.systemId },
      include: { pricingPolicy: true },
    });
    
    // Fetch giá từ PKGX API
    const pkgxData = await fetchPkgxProduct(product.pkgxId);
    if (!pkgxData) {
      console.log(`  ❌ ${product.name}: Could not fetch from PKGX`);
      continue;
    }
    
    const pkgxPrices: Record<string, number> = {
      shop_price: parseFloat(pkgxData.shop_price) || 0,
      market_price: parseFloat(pkgxData.market_price) || 0,
      partner_price: parseFloat(pkgxData.partner_price) || 0,
      ace_price: pkgxData.ace_price || 0,
      deal_price: parseFloat(pkgxData.deal_price) || 0,
    };
    
    let hasUpdates = false;
    
    // Cập nhật từng price mapping
    for (const mapping of priceMappings) {
      if (!mapping.pricingPolicyId) continue;
      
      const pkgxPrice = pkgxPrices[mapping.priceType] || 0;
      const currentPrice = currentPrices.find(p => p.pricingPolicyId === mapping.pricingPolicyId);
      
      if (!currentPrice) {
        // Tạo mới nếu chưa có
        await prisma.productPrice.create({
          data: {
            productId: product.systemId,
            pricingPolicyId: mapping.pricingPolicyId,
            price: pkgxPrice,
          },
        });
        console.log(`  ✅ ${product.name}: Created ${mapping.priceType} = ${pkgxPrice}`);
        hasUpdates = true;
      } else if (Number(currentPrice.price) !== pkgxPrice && pkgxPrice > 0) {
        // Cập nhật nếu khác và PKGX có giá > 0
        await prisma.productPrice.update({
          where: { 
            productId_pricingPolicyId: {
              productId: product.systemId,
              pricingPolicyId: mapping.pricingPolicyId,
            }
          },
          data: { price: pkgxPrice },
        });
        console.log(`  ✅ ${product.name}: Updated ${mapping.priceType}: ${currentPrice.price} => ${pkgxPrice}`);
        hasUpdates = true;
      }
    }
    
    if (hasUpdates) updatedCount++;
    
    // Rate limiting - wait 100ms between API calls
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Updated prices for ${updatedCount} products`);
}

async function main() {
  console.log('Starting PKGX Products Fix...');
  
  await fixStockHistory();
  await fixPrices();
  
  console.log('\nDone!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
