/**
 * Debug: Check what API returns for a product
 */
import { prisma } from './lib/prisma';

async function main() {
  console.log('='.repeat(60));
  console.log('🔍 DEBUG: Check API Response for Product');
  console.log('='.repeat(60));

  // Get a product with pkgxId
  const productFromDb = await prisma.product.findFirst({
    where: { pkgxId: { not: null } },
    include: {
      brand: true,
      productCategories: {
        include: {
          category: true,
        },
      },
      productInventory: true,
      prices: {
        include: {
          pricingPolicy: true,
        },
      },
    },
  });

  if (!productFromDb) {
    console.log('❌ No product with pkgxId found');
    return;
  }

  console.log('\n📦 Raw Product from DB:');
  console.log('   systemId:', productFromDb.systemId);
  console.log('   name:', productFromDb.name);
  console.log('   pkgxId:', productFromDb.pkgxId);
  console.log('   prices array length:', productFromDb.prices?.length);

  // Transform like API does
  function transformProduct(product: any): any {
    if (!product) return product;
    
    const result = { ...product };
    
    // Transform prices from array to Record<policySystemId, number>
    const pricesArray = product.prices;
    if (Array.isArray(pricesArray)) {
      const pricesRecord: Record<string, number> = {};
      for (const pp of pricesArray) {
        if (pp.pricingPolicyId && pp.price != null) {
          pricesRecord[pp.pricingPolicyId] = Number(pp.price);
        }
      }
      result.prices = pricesRecord;
    }
    
    // Map brandId to brandSystemId (frontend expects brandSystemId)
    if (product.brandId) {
      result.brandSystemId = product.brandId;
    }
    
    // Map productCategories to categorySystemId (first one) and categorySystemIds
    if (Array.isArray(product.productCategories) && product.productCategories.length > 0) {
      result.categorySystemId = product.productCategories[0].categoryId;
      result.categorySystemIds = product.productCategories.map((pc: { categoryId: string }) => pc.categoryId);
    }
    
    return result;
  }

  const transformed = transformProduct(productFromDb);

  console.log('\n🔄 Transformed Product (like API returns):');
  console.log('   systemId:', transformed.systemId);
  console.log('   name:', transformed.name);
  console.log('   prices:', transformed.prices);
  console.log('   prices type:', typeof transformed.prices);
  console.log('   prices keys:', Object.keys(transformed.prices || {}));

  // Also check what the list API would return
  console.log('\n📋 Check list API format (first 3 products):');
  const products = await prisma.product.findMany({
    where: { pkgxId: { not: null } },
    take: 3,
    include: {
      prices: {
        include: {
          pricingPolicy: true,
        },
      },
    },
  });

  for (const p of products) {
    const t = transformProduct(p);
    console.log(`   - ${p.systemId}: prices = ${JSON.stringify(t.prices)}`);
  }

  console.log('\n' + '='.repeat(60));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
