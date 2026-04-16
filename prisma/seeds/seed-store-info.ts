/**
 * Store Info & System Settings Seed
 * Seed essential system-level settings from the Setting table:
 * - store-info: Thông tin cửa hàng
 * - sales-management-settings: Cài đặt bán hàng
 * - system_notification_settings: Thông báo hệ thống
 * - warranty: Cài đặt bảo hành mặc định
 * 
 * Run: npx tsx prisma/seeds/seed-store-info.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedStoreInfo() {
  console.log('🏪 Seeding Store Info & System Settings...');

  const settings: { key: string; value: Record<string, unknown>; type: string; category: string; group: string }[] = [
    {
      key: 'store-info',
      type: 'json',
      category: 'store',
      group: 'store',
      value: {
        brandName: 'HRM System',
        companyName: 'Công ty của bạn',
        hotline: '0900000000',
        email: 'info@company.com',
        website: '',
        taxCode: '',
        headquartersAddress: '',
        province: '',
        district: '',
        ward: '',
        representativeName: '',
        representativeTitle: 'Giám đốc',
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: '',
        registrationNumber: '',
      },
    },
    {
      key: 'sales-management-settings',
      type: 'json',
      category: 'sales',
      group: 'sales',
      value: {
        printCopies: '1',
        allowNegativeOrder: true,
        allowNegativePacking: true,
        allowNegativeApproval: true,
        allowNegativeStockOut: true,
        allowCancelAfterExport: true,
      },
    },
    {
      key: 'system_notification_settings',
      type: 'json',
      category: 'system',
      group: 'system',
      value: {
        commentCreated: true,
        paymentOverdue: true,
        receiptUpdated: true,
        paymentReceived: true,
        dailySummaryEmail: true,
      },
    },
    {
      key: 'warranty',
      type: 'json',
      category: 'inventory',
      group: 'inventory',
      value: {
        defaultWarrantyMonths: 12,
      },
    },
    {
      key: 'shipping_global_config',
      type: 'json',
      category: 'shipping',
      group: 'shipping',
      value: {
        note: '',
        weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
        dimensions: { width: 20, height: 10, length: 30 },
        requirement: 'ALLOW_CHECK_NOT_TRY',
        productSendMode: 'all',
        autoSyncCancelStatus: false,
        autoSyncCODCollection: false,
        latePickupWarningDays: 2,
        lateDeliveryWarningDays: 7,
      },
    },
    {
      key: 'sla',
      type: 'json',
      category: 'inventory',
      group: 'inventory',
      value: {
        deadStockDays: 90,
        alertFrequency: 'daily',
        slowMovingDays: 30,
        defaultMaxStock: 100,
        showOnDashboard: true,
        enableEmailAlerts: false,
        defaultSafetyStock: 5,
        dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
        defaultReorderLevel: 10,
        alertEmailRecipients: [],
      },
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key_group: { key: setting.key, group: setting.group } },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
        type: setting.type,
        category: setting.category,
        group: setting.group,
      },
    });
    console.log(`   ✅ Setting: ${setting.key}`);
  }

  console.log('✅ Store Info & System Settings seeded!');
}

// Run if executed directly
import { pathToFileURL } from 'url';
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seedStoreInfo()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
