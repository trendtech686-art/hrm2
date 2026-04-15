/**
 * Seed all requested settings:
 *  1. Employee settings (job titles, departments, employee types, penalty types, etc.)
 *  2. Inventory settings (units, taxes, etc.)
 *  3. Payment settings (receipt types, payment types, cash accounts)
 *  4. Customer settings (customer types, groups, sources, etc.)
 *  5. Sales settings (sales channels, sales management config)
 *
 * Run: npx tsx scripts/run-seed-settings.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Import exported seed functions
import { seedEmployeeSettings } from '../prisma/seeds/seed-employee-settings';
import { seedInventorySettings } from '../prisma/seeds/seed-inventory-settings';
import { seedPaymentSettings } from '../prisma/seeds/seed-payment-settings';

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   SEED ALL SETTINGS (5 modules)                     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // 1. Employee Settings
    console.log('━━━ 1/5 EMPLOYEE SETTINGS ━━━');
    await seedEmployeeSettings();
    console.log('');

    // 2. Inventory Settings
    console.log('━━━ 2/5 INVENTORY SETTINGS ━━━');
    await seedInventorySettings();
    console.log('');

    // 3. Payment Settings
    console.log('━━━ 3/5 PAYMENT SETTINGS ━━━');
    await seedPaymentSettings();
    console.log('');

    // 4. Customer Settings (no export, run inline)
    console.log('━━━ 4/5 CUSTOMER SETTINGS ━━━');
    await seedCustomerSettings();
    console.log('');

    // 5. Sales Settings (no export, run inline)
    console.log('━━━ 5/5 SALES SETTINGS ━━━');
    await seedSalesSettings();
    console.log('');

    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   ✅ ALL 5 SETTINGS MODULES SEEDED SUCCESSFULLY!   ║');
    console.log('╚══════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ── Customer Settings (inline since no export) ──
async function seedCustomerSettings() {
  console.log('🌱 Seeding customer settings...');

  const customerTypes = [
    { id: 'INDIVIDUAL', name: 'Cá nhân', description: 'Khách hàng cá nhân, mua lẻ', isDefault: true, orderIndex: 1 },
    { id: 'BUSINESS', name: 'Doanh nghiệp', description: 'Khách hàng là công ty, doanh nghiệp', isDefault: false, orderIndex: 2 },
    { id: 'WHOLESALE', name: 'Đại lý/Bán sỉ', description: 'Khách hàng mua số lượng lớn, đại lý phân phối', isDefault: false, orderIndex: 3 },
    { id: 'PARTNER', name: 'Đối tác', description: 'Đối tác kinh doanh, hợp tác chiến lược', isDefault: false, orderIndex: 4 },
  ];

  const customerGroups = [
    { id: 'VIP', name: 'VIP', description: 'Khách hàng VIP, ưu tiên cao nhất', isDefault: false, orderIndex: 1 },
    { id: 'REGULAR', name: 'Thường xuyên', description: 'Khách hàng mua hàng thường xuyên', isDefault: true, orderIndex: 2 },
    { id: 'NEW', name: 'Khách mới', description: 'Khách hàng mới đăng ký', isDefault: false, orderIndex: 3 },
  ];

  const customerSources = [
    { id: 'WALK_IN', name: 'Khách vãng lai', description: 'Khách hàng đến trực tiếp cửa hàng', isDefault: true, orderIndex: 1 },
    { id: 'ONLINE', name: 'Online', description: 'Đặt hàng qua website/app', isDefault: false, orderIndex: 2 },
    { id: 'REFERRAL', name: 'Giới thiệu', description: 'Được giới thiệu từ khách hàng khác', isDefault: false, orderIndex: 3 },
    { id: 'SOCIAL_MEDIA', name: 'Mạng xã hội', description: 'Từ Facebook, Zalo, TikTok...', isDefault: false, orderIndex: 4 },
    { id: 'MARKETPLACE', name: 'Sàn TMĐT', description: 'Từ Shopee, Lazada, Tiki...', isDefault: false, orderIndex: 5 },
  ];

  type SettingItem = { id: string; name: string; description?: string; isDefault?: boolean; orderIndex?: number; metadata?: Record<string, unknown> };

  async function seedByType(typeName: string, typeLabel: string, items: SettingItem[]) {
    console.log(`  → Seeding ${typeLabel}...`);
    for (const item of items) {
      const systemId = `CS_${typeName}_${item.id}`;
      const { isDefault, orderIndex, ...rest } = item;
      await prisma.customerSetting.upsert({
        where: { systemId },
        update: { name: item.name, description: item.description },
        create: {
          systemId,
          type: typeName,
          ...rest,
          isDefault: isDefault ?? false,
          orderIndex: orderIndex ?? 0,
          isActive: true,
          createdBy: 'SYSTEM',
        },
      });
    }
    console.log(`  ✅ ${typeLabel}: ${items.length} items`);
  }

  await seedByType('customer-type', 'Customer Types', customerTypes);
  await seedByType('customer-group', 'Customer Groups', customerGroups);
  await seedByType('customer-source', 'Customer Sources', customerSources);
}

// ── Sales Settings (inline since no export) ──
async function seedSalesSettings() {
  console.log('🌱 Seeding sales settings...');

  // Sales Management Settings
  console.log('  → Seeding sales management config...');
  await prisma.setting.upsert({
    where: { key: 'sales-management-settings' },
    update: {},
    create: {
      key: 'sales-management-settings',
      value: {
        allowCancelAfterExport: true,
        allowNegativeOrder: true,
        allowNegativeApproval: true,
        allowNegativePacking: true,
        allowNegativeStockOut: true,
        printCopies: '1',
      },
      group: 'sales',
      label: 'Cài đặt quản lý bán hàng',
    },
  });
  console.log('  ✅ Sales management config');

  // Sales Channels
  console.log('  → Seeding sales channels...');
  const channels = [
    { name: 'Tại cửa hàng', code: 'POS', isDefault: true },
    { name: 'Website', code: 'WEB', isDefault: false },
    { name: 'Facebook', code: 'FB', isDefault: false },
    { name: 'Zalo', code: 'ZALO', isDefault: false },
    { name: 'Shopee', code: 'SHOPEE', isDefault: false },
    { name: 'Lazada', code: 'LAZADA', isDefault: false },
    { name: 'TikTok Shop', code: 'TIKTOK', isDefault: false },
    { name: 'Điện thoại', code: 'PHONE', isDefault: false },
  ];

  for (const ch of channels) {
    await prisma.salesChannel.upsert({
      where: { id: `SC_${ch.code}` },
      update: { name: ch.name },
      create: {
        id: `SC_${ch.code}`,
        name: ch.name,
        code: ch.code,
        isDefault: ch.isDefault,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ Sales channels: ${channels.length} items`);
}

main();
