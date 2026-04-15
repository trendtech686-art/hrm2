/**
 * Seed script for Sales Channels
 * Run with: npx tsx scripts/seed-sales-channels.ts
 */

// Load environment variables FIRST
import { config } from 'dotenv';
config();

import { prisma } from '../lib/prisma';

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

async function main() {
  console.log('🌱 Starting sales channels seeding...');

  // Delete existing sales channels
  const deleteResult = await prisma.salesChannel.deleteMany({});
  console.log(`🗑️  Deleted ${deleteResult.count} existing sales channels`);

  // Create sales channels
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
      console.log(`✅ Created: ${channel.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${channel.name}:`, error);
    }
  }

  console.log(`\n✨ Successfully seeded ${created}/${salesChannelsData.length} sales channels`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
