/**
 * Seed script for Customer Settings
 * Run with: npx tsx prisma/seeds/seed-customer-settings.ts
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// CUSTOMER TYPES (Loại khách hàng)
// ============================================================================
const customerTypes = [
  { id: 'INDIVIDUAL', name: 'Cá nhân', description: 'Khách hàng cá nhân, mua lẻ', isDefault: true, orderIndex: 1 },
  { id: 'BUSINESS', name: 'Doanh nghiệp', description: 'Khách hàng là công ty, doanh nghiệp', isDefault: false, orderIndex: 2 },
  { id: 'WHOLESALE', name: 'Đại lý/Bán sỉ', description: 'Khách hàng mua số lượng lớn, đại lý phân phối', isDefault: false, orderIndex: 3 },
  { id: 'PARTNER', name: 'Đối tác', description: 'Đối tác kinh doanh, hợp tác chiến lược', isDefault: false, orderIndex: 4 },
];

// ============================================================================
// CUSTOMER GROUPS (Nhóm khách hàng)
// ============================================================================
const customerGroups = [
  { id: 'VIP', name: 'VIP', description: 'Khách hàng VIP, ưu tiên cao nhất', isDefault: false, orderIndex: 1 },
  { id: 'REGULAR', name: 'Thường xuyên', description: 'Khách hàng mua hàng thường xuyên', isDefault: true, orderIndex: 2 },
  { id: 'NEW', name: 'Khách mới', description: 'Khách hàng mới đăng ký', isDefault: false, orderIndex: 3 },
  { id: 'POTENTIAL', name: 'Tiềm năng', description: 'Khách hàng tiềm năng, đang tìm hiểu', isDefault: false, orderIndex: 4 },
  { id: 'INACTIVE', name: 'Không hoạt động', description: 'Khách hàng không mua hàng trong thời gian dài', isDefault: false, orderIndex: 5 },
];

// ============================================================================
// CUSTOMER SOURCES (Nguồn khách hàng)
// ============================================================================
const customerSources = [
  { id: 'WALK_IN', name: 'Đến trực tiếp', description: 'Khách vào cửa hàng trực tiếp', isDefault: true, orderIndex: 1, metadata: { sourceType: 'offline' } },
  { id: 'WEBSITE', name: 'Website', description: 'Khách hàng từ website công ty', isDefault: false, orderIndex: 2, metadata: { sourceType: 'online' } },
  { id: 'FACEBOOK', name: 'Facebook', description: 'Khách hàng từ fanpage Facebook', isDefault: false, orderIndex: 3, metadata: { sourceType: 'social' } },
  { id: 'ZALO', name: 'Zalo', description: 'Khách hàng từ Zalo OA', isDefault: false, orderIndex: 4, metadata: { sourceType: 'social' } },
  { id: 'REFERRAL', name: 'Giới thiệu', description: 'Được giới thiệu từ khách hàng khác', isDefault: false, orderIndex: 5, metadata: { sourceType: 'referral' } },
  { id: 'ADS', name: 'Quảng cáo', description: 'Khách hàng từ các chiến dịch quảng cáo', isDefault: false, orderIndex: 6, metadata: { sourceType: 'marketing' } },
  { id: 'PHONE', name: 'Điện thoại', description: 'Khách hàng gọi điện đến', isDefault: false, orderIndex: 7, metadata: { sourceType: 'offline' } },
];

// ============================================================================
// PAYMENT TERMS (Hạn thanh toán)
// ============================================================================
const paymentTerms = [
  { id: 'COD', name: 'Thanh toán ngay', description: 'Thanh toán khi nhận hàng (COD)', isDefault: true, orderIndex: 1, metadata: { days: 0 } },
  { id: 'NET7', name: 'Net 7', description: 'Thanh toán trong vòng 7 ngày', isDefault: false, orderIndex: 2, metadata: { days: 7 } },
  { id: 'NET15', name: 'Net 15', description: 'Thanh toán trong vòng 15 ngày', isDefault: false, orderIndex: 3, metadata: { days: 15 } },
  { id: 'NET30', name: 'Net 30', description: 'Thanh toán trong vòng 30 ngày', isDefault: false, orderIndex: 4, metadata: { days: 30 } },
  { id: 'NET45', name: 'Net 45', description: 'Thanh toán trong vòng 45 ngày', isDefault: false, orderIndex: 5, metadata: { days: 45 } },
  { id: 'NET60', name: 'Net 60', description: 'Thanh toán trong vòng 60 ngày', isDefault: false, orderIndex: 6, metadata: { days: 60 } },
];

// ============================================================================
// CREDIT RATINGS (Xếp hạng tín dụng)
// ============================================================================
const creditRatings = [
  { id: 'AAA', name: 'AAA - Xuất sắc', description: 'Khách hàng tốt nhất, không nợ quá hạn', isDefault: false, orderIndex: 1, metadata: { level: 1, maxCreditLimit: 500000000 } },
  { id: 'AA', name: 'AA - Rất tốt', description: 'Thanh toán đúng hạn, ít rủi ro', isDefault: false, orderIndex: 2, metadata: { level: 2, maxCreditLimit: 300000000 } },
  { id: 'A', name: 'A - Tốt', description: 'Khách hàng tốt, đôi khi chậm', isDefault: true, orderIndex: 3, metadata: { level: 3, maxCreditLimit: 200000000 } },
  { id: 'B', name: 'B - Trung bình', description: 'Cần theo dõi, có lịch sử chậm thanh toán', isDefault: false, orderIndex: 4, metadata: { level: 4, maxCreditLimit: 100000000 } },
  { id: 'C', name: 'C - Thấp', description: 'Rủi ro cao, cần thanh toán trước', isDefault: false, orderIndex: 5, metadata: { level: 5, maxCreditLimit: 50000000 } },
  { id: 'D', name: 'D - Xấu', description: 'Nợ xấu, không cho nợ', isDefault: false, orderIndex: 6, metadata: { level: 6, maxCreditLimit: 0 } },
];

// ============================================================================
// LIFECYCLE STAGES (Giai đoạn vòng đời)
// ============================================================================
const lifecycleStages = [
  { id: 'LEAD', name: 'Tiềm năng', description: 'Khách hàng tiềm năng, đang tiếp cận', isDefault: true, orderIndex: 1 },
  { id: 'OPPORTUNITY', name: 'Cơ hội', description: 'Đang có nhu cầu, cơ hội bán hàng', isDefault: false, orderIndex: 2 },
  { id: 'CUSTOMER', name: 'Khách hàng', description: 'Đã mua hàng ít nhất 1 lần', isDefault: false, orderIndex: 3 },
  { id: 'LOYAL', name: 'Khách trung thành', description: 'Mua hàng thường xuyên, gắn bó lâu dài', isDefault: false, orderIndex: 4 },
  { id: 'ADVOCATE', name: 'Người giới thiệu', description: 'Giới thiệu khách hàng mới', isDefault: false, orderIndex: 5 },
  { id: 'CHURNED', name: 'Rời bỏ', description: 'Ngừng mua hàng, cần kích hoạt lại', isDefault: false, orderIndex: 6 },
];

// ============================================================================
// SLA SETTINGS (Cài đặt SLA)
// ============================================================================
const slaSettings = [
  { id: 'FOLLOW_UP', name: 'Liên hệ định kỳ', description: 'Nhắc nhở liên hệ khách hàng theo chu kỳ', orderIndex: 1, metadata: { slaType: 'follow-up', daysThreshold: 30, warningDays: 7 } },
  { id: 'RE_ENGAGE', name: 'Kích hoạt lại', description: 'Kích hoạt khách hàng không hoạt động', orderIndex: 2, metadata: { slaType: 're-engagement', daysThreshold: 90, warningDays: 14 } },
  { id: 'DEBT', name: 'Nhắc công nợ', description: 'Nhắc thanh toán công nợ quá hạn', orderIndex: 3, metadata: { slaType: 'debt-payment', daysThreshold: 7, warningDays: 3 } },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedByType(typeName: string, typeLabel: string, items: Array<{ id: string; name: string; description?: string; isDefault?: boolean; orderIndex?: number; metadata?: Record<string, unknown> }>) {
  console.log(`\n📦 Seeding ${typeLabel}...`);
  
  const existing = await prisma.customerSetting.count({ where: { type: typeName, isDeleted: false } });
  if (existing > 0) {
    console.log(`  ⏭️  ${existing} ${typeLabel} already exist, skipping...`);
    return;
  }
  
  for (const item of items) {
    await prisma.customerSetting.create({
      data: {
        id: item.id,
        name: item.name,
        type: typeName,
        description: item.description,
        isDefault: item.isDefault ?? false,
        isActive: true,
        orderIndex: item.orderIndex ?? 0,
        metadata: (item.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
    console.log(`  ✅ Created: ${item.name}`);
  }
  console.log(`  📊 Created ${items.length} ${typeLabel}`);
}

// ============================================================================
// MAIN
// ============================================================================

export async function seedCustomerSettings() {
  console.log('🌱 Starting Customer Settings Seeding...');
  console.log('=========================================');

  try {
    // Seed all customer setting types using the unified CustomerSetting model
    await seedByType('customer-type', 'Customer Types', customerTypes);
    await seedByType('customer-group', 'Customer Groups', customerGroups);
    await seedByType('customer-source', 'Customer Sources', customerSources);
    await seedByType('payment-term', 'Payment Terms', paymentTerms);
    await seedByType('credit-rating', 'Credit Ratings', creditRatings);
    await seedByType('lifecycle-stage', 'Lifecycle Stages', lifecycleStages);
    await seedByType('sla-setting', 'SLA Settings', slaSettings);

    console.log('\n=========================================');
    console.log('✅ Customer settings seeding completed!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

// Run if executed directly
import { pathToFileURL } from 'url';
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seedCustomerSettings()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
