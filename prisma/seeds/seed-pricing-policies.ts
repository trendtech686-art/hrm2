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
    systemId: 'PRICE_POLICY_001',
    id: 'GIA_BAN',
    name: 'Giá bán lẻ',
    description: 'Giá bán lẻ cho khách hàng (shop_price)',
    type: 'Bán hàng',
    isDefault: true,
  },
  {
    systemId: 'PRICE_POLICY_002',
    id: 'GIA_THI_TRUONG',
    name: 'Giá thị trường',
    description: 'Giá niêm yết / giá gốc (market_price)',
    type: 'Bán hàng',
    isDefault: false,
  },
  {
    systemId: 'PRICE_POLICY_003',
    id: 'GIA_DOI_TAC',
    name: 'Giá đối tác',
    description: 'Giá dành cho đối tác (partner_price)',
    type: 'Bán hàng',
    isDefault: false,
  },
  {
    systemId: 'PRICE_POLICY_004',
    id: 'GIA_ACE',
    name: 'Giá ACE',
    description: 'Giá đặc biệt ACE (ace_price)',
    type: 'Bán hàng',
    isDefault: false,
  },
  {
    systemId: 'PRICE_POLICY_005',
    id: 'GIA_DEAL',
    name: 'Giá deal',
    description: 'Giá khuyến mãi (deal_price)',
    type: 'Bán hàng',
    isDefault: false,
  },
  {
    systemId: 'PRICE_POLICY_006',
    id: 'GIA_NHAP',
    name: 'Giá nhập',
    description: 'Giá nhập hàng từ nhà cung cấp',
    type: 'Nhập hàng',
    isDefault: true,
  },
];

const pkgxPriceMappings = [
  {
    systemId: 'PKGX_PRICE_MAP_001',
    priceType: 'shop_price',
    pricingPolicyId: 'PRICE_POLICY_001',
    description: 'Giá bán chính',
  },
  {
    systemId: 'PKGX_PRICE_MAP_002',
    priceType: 'market_price',
    pricingPolicyId: 'PRICE_POLICY_002',
    description: 'Giá thị trường',
  },
  {
    systemId: 'PKGX_PRICE_MAP_003',
    priceType: 'partner_price',
    pricingPolicyId: 'PRICE_POLICY_003',
    description: 'Giá đối tác',
  },
  {
    systemId: 'PKGX_PRICE_MAP_004',
    priceType: 'ace_price',
    pricingPolicyId: 'PRICE_POLICY_004',
    description: 'Giá ACE',
  },
  {
    systemId: 'PKGX_PRICE_MAP_005',
    priceType: 'deal_price',
    pricingPolicyId: 'PRICE_POLICY_005',
    description: 'Giá deal',
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
      await prisma.pricingPolicy.create({
        data: {
          systemId: policy.systemId,
          id: policy.id,
          name: policy.name,
          type: policy.type, // 'Bán hàng' or 'Nhập hàng'
          description: policy.description,
          isDefault: policy.isDefault,
          isActive: true,
          createdBy: 'SYSTEM',
        },
      });
      console.log(`   ✓ Created pricing policy: ${policy.name}`);
    }

    // Create PKGX price mappings
    for (const mapping of pkgxPriceMappings) {
      await prisma.pkgxPriceMapping.create({
        data: mapping,
      });
      console.log(`   ✓ Created PKGX price mapping: ${mapping.description}`);
    }

    console.log('');
    console.log('✅ Pricing Policies seeded successfully!');
    console.log(`   - ${pricingPolicies.length} pricing policies (in PricingPolicy table)`);
    console.log(`   - ${pkgxPriceMappings.length} PKGX price mappings`);

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
