/**
 * Seed Pricing Policies and PKGX Price Mappings
 * Creates standard pricing policies in PricingPolicy table (for ProductPrice FK)
 * and maps them to PKGX price fields
 * 
 * Run: npx tsx prisma/seeds/seed-pricing-policies.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
config({ path: resolve(__dirname, '../../.env') });

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Remove quotes from DATABASE_URL if present
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}
// Strip quotes if present
connectionString = connectionString.replace(/^["']|["']$/g, '');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Pricing policies - stored in PricingPolicy table (ProductPrice.pricingPolicyId FK to this)
const pricingPolicies = [
  {
    id: 'GIA_BAN',
    name: 'Giá bán lẻ',
    description: 'Giá bán lẻ cho khách hàng (shop_price)',
    type: 'Bán hàng',
    isDefault: true,
    pkgxPriceType: 'shop_price', // maps to PkgxPriceMapping
  },
  {
    id: 'GIA_THI_TRUONG',
    name: 'Giá thị trường',
    description: 'Giá niêm yết / giá gốc (market_price)',
    type: 'Bán hàng',
    isDefault: false,
    pkgxPriceType: 'market_price',
  },
  {
    id: 'GIA_DOI_TAC',
    name: 'Giá đối tác',
    description: 'Giá dành cho đối tác (partner_price)',
    type: 'Bán hàng',
    isDefault: false,
    pkgxPriceType: 'partner_price',
  },
  {
    id: 'GIA_ACE',
    name: 'Giá ACE',
    description: 'Giá đặc biệt ACE (ace_price)',
    type: 'Bán hàng',
    isDefault: false,
    pkgxPriceType: 'ace_price',
  },
  {
    id: 'GIA_DEAL',
    name: 'Giá deal',
    description: 'Giá khuyến mãi (deal_price)',
    type: 'Bán hàng',
    isDefault: false,
    pkgxPriceType: 'deal_price',
  },
  {
    id: 'GIA_NHAP',
    name: 'Giá nhập',
    description: 'Giá nhập hàng từ nhà cung cấp',
    type: 'Nhập hàng',
    isDefault: true,
    pkgxPriceType: null, // no PKGX mapping
  },
];

export async function seedPricingPolicies() {
  console.log('🌱 Seeding Pricing Policies...');

  try {
    // Delete existing PKGX price mappings first (foreign key dependency)
    await prisma.pkgxPriceMapping.deleteMany({});
    console.log('   ✓ Cleared existing PKGX price mappings');

    // Delete existing pricing policies from PricingPolicy table
    await prisma.pricingPolicy.deleteMany({});
    console.log('   ✓ Cleared existing pricing policies from PricingPolicy');

    // Create pricing policies in PricingPolicy table (ProductPrice FK references this)
    for (const policy of pricingPolicies) {
      const { pkgxPriceType, ...policyData } = policy;
      await prisma.pricingPolicy.create({
        data: {
          systemId: crypto.randomUUID(),
          ...policyData,
          isActive: true,
          createdBy: 'SYSTEM',
        },
      });
      console.log(`   ✓ Created pricing policy: ${policy.name}`);
    }

    // Create PKGX price mappings — lookup created policy systemIds by businessId
    const createdPolicies = await prisma.pricingPolicy.findMany({
      select: { systemId: true, id: true },
    });
    const policyIdMap = new Map(createdPolicies.map(p => [p.id, p.systemId]));

    for (const policy of pricingPolicies) {
      if (!policy.pkgxPriceType) continue;
      const policySystemId = policyIdMap.get(policy.id);
      if (!policySystemId) {
        console.warn(`   ⚠️ PricingPolicy ${policy.id} not found, skipping PKGX mapping`);
        continue;
      }
      await prisma.pkgxPriceMapping.create({
        data: {
          priceType: policy.pkgxPriceType,
          pricingPolicyId: policySystemId,
          description: policy.name,
        },
      });
      console.log(`   ✓ Created PKGX price mapping: ${policy.name}`);
    }

    console.log('');
    console.log('✅ Pricing Policies seeded successfully!');
    console.log(`   - ${pricingPolicies.length} pricing policies (in PricingPolicy table)`);
    console.log(`   - ${pricingPolicies.filter(p => p.pkgxPriceType).length} PKGX price mappings`);

  } catch (error) {
    console.error('❌ Error seeding pricing policies:', error);
    throw error;
  }
}

// Always run when executed directly
seedPricingPolicies()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
