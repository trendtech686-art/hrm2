/**
 * Seed script for Sales Settings
 * Run with: npx tsx prisma/seeds/seed-sales-settings.ts
 */

import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// SALES MANAGEMENT SETTINGS DATA
// ============================================================================
const SALES_MANAGEMENT_SETTINGS_KEY = 'sales-management-settings';
const SALES_MANAGEMENT_SETTINGS_GROUP = 'sales';

const defaultSalesManagementSettings = {
  allowCancelAfterExport: true,
  allowNegativeOrder: true,
  allowNegativeApproval: true,
  allowNegativePacking: true,
  allowNegativeStockOut: true,
  printCopies: '1',
};

// ============================================================================
// SALES CHANNELS DATA
// ============================================================================
const salesChannelsData = [
  {
    id: 'STORE',
    name: 'Tại quầy',
    isApplied: true,
    isDefault: true,
  },
  {
    id: 'ONLINE',
    name: 'Online',
    isApplied: true,
    isDefault: false,
  },
  {
    id: 'FACEBOOK',
    name: 'Facebook',
    isApplied: true,
    isDefault: false,
  },
  {
    id: 'ZALO',
    name: 'Zalo',
    isApplied: true,
    isDefault: false,
  },
  {
    id: 'SHOPEE',
    name: 'Shopee',
    isApplied: true,
    isDefault: false,
  },
  {
    id: 'LAZADA',
    name: 'Lazada',
    isApplied: false,
    isDefault: false,
  },
  {
    id: 'TIKTOK',
    name: 'TikTok Shop',
    isApplied: false,
    isDefault: false,
  },
  {
    id: 'PHONE',
    name: 'Điện thoại',
    isApplied: true,
    isDefault: false,
  },
  {
    id: 'WHOLESALE',
    name: 'Bán sỉ',
    isApplied: false,
    isDefault: false,
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedSalesManagementSettings() {
  console.log('\n📦 Seeding Sales Management Settings...');
  
  try {
    const existing = await prisma.setting.findFirst({
      where: { key: SALES_MANAGEMENT_SETTINGS_KEY },
    });

    if (existing) {
      console.log('  ⏭️  Sales management settings already exist, skipping...');
      return;
    }

    await prisma.setting.create({
      data: {
        key: SALES_MANAGEMENT_SETTINGS_KEY,
        group: SALES_MANAGEMENT_SETTINGS_GROUP,
        type: 'json',
        category: 'sales',
        value: defaultSalesManagementSettings,
      },
    });

    console.log('  ✅ Created sales management settings');
  } catch (error) {
    console.error('  ❌ Error seeding sales management settings:', error);
    throw error;
  }
}

async function seedSalesChannels() {
  console.log('\n🛒 Seeding Sales Channels...');
  
  try {
    const existingCount = await prisma.salesChannel.count();
    
    if (existingCount > 0) {
      console.log(`  ⏭️  ${existingCount} sales channels already exist, skipping...`);
      return;
    }

    let created = 0;
    for (const channel of salesChannelsData) {
      try {
        await prisma.salesChannel.create({
          data: {
            systemId: crypto.randomUUID(),
            ...channel,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        created++;
        console.log(`  ✅ Created: ${channel.name}`);
      } catch (error) {
        console.error(`  ❌ Failed to create ${channel.name}:`, error);
      }
    }

    console.log(`  📊 Created ${created} sales channels`);
  } catch (error) {
    console.error('  ❌ Error seeding sales channels:', error);
    throw error;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🌱 Starting Sales Settings Seeding...');
  console.log('=====================================');

  try {
    await seedSalesManagementSettings();
    await seedSalesChannels();

    console.log('\n=====================================');
    console.log('✅ Sales settings seeding completed!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
