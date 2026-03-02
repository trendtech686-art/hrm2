import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedComplaintsSettings() {
  console.log('🌱 Seeding complaints settings...');

  try {
    const GROUP = 'complaints';

    // 1. Seed Complaints SLA Settings
    console.log('  → Seeding complaints SLA settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_sla_settings', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_sla_settings',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints SLA settings',
        value: {
          low: { responseTime: 240, resolveTime: 48 },    // 4h response, 48h resolve
          medium: { responseTime: 120, resolveTime: 24 }, // 2h response, 24h resolve
          high: { responseTime: 60, resolveTime: 12 },    // 1h response, 12h resolve
          urgent: { responseTime: 30, resolveTime: 4 },   // 30m response, 4h resolve
        },
      },
    });
    console.log('  ✓ Created complaints SLA settings');

    // 2. Seed Complaints Notification Settings
    console.log('  → Seeding complaints notification settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_notification_settings', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_notification_settings',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints notification settings',
        value: {
          emailOnCreate: true,
          emailOnAssign: true,
          emailOnVerified: false,
          emailOnResolved: true,
          emailOnOverdue: true,
          smsOnOverdue: false,
          inAppNotifications: true,
        },
      },
    });
    console.log('  ✓ Created complaints notification settings');

    // 3. Seed Complaints Tracking Settings (Public tracking)
    console.log('  → Seeding complaints tracking settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_tracking_settings', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_tracking_settings',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints tracking settings',
        value: {
          enabled: false,
          allowCustomerComments: false,
          showEmployeeName: true,
          showTimeline: true,
        },
      },
    });
    console.log('  ✓ Created complaints tracking settings');

    // 4. Seed Complaints Reminder Settings
    console.log('  → Seeding complaints reminder settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_reminder_settings', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_reminder_settings',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints reminder settings',
        value: {
          enabled: true,
          intervals: {
            firstReminder: 4,
            secondReminder: 8,
            escalation: 24,
          },
          notifyAssignee: true,
          notifyCreator: true,
          notifyManager: true,
        },
      },
    });
    console.log('  ✓ Created complaints reminder settings');

    // 5. Seed Complaints Card Colors
    console.log('  → Seeding complaints card color settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_card_color_settings', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_card_color_settings',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints card color settings',
        value: {
          pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          processing: 'bg-blue-100 text-blue-800 border-blue-300',
          resolved: 'bg-green-100 text-green-800 border-green-300',
          rejected: 'bg-red-100 text-red-800 border-red-300',
        },
      },
    });
    console.log('  ✓ Created complaints card color settings');

    // 6. Seed Complaint Types
    console.log('  → Seeding complaint types...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_complaint_types', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_complaint_types',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaint types',
        value: [
          { id: 'product_quality', name: 'Chất lượng sản phẩm', isActive: true },
          { id: 'shipping_damage', name: 'Hư hỏng vận chuyển', isActive: true },
          { id: 'wrong_item', name: 'Gửi sai hàng', isActive: true },
          { id: 'missing_item', name: 'Thiếu hàng', isActive: true },
          { id: 'service_issue', name: 'Vấn đề dịch vụ', isActive: true },
          { id: 'late_delivery', name: 'Giao hàng trễ', isActive: true },
          { id: 'price_dispute', name: 'Tranh chấp giá', isActive: true },
          { id: 'warranty_issue', name: 'Vấn đề bảo hành', isActive: true },
          { id: 'staff_attitude', name: 'Thái độ nhân viên', isActive: true },
          { id: 'other', name: 'Khác', isActive: true },
        ],
      },
    });
    console.log('  ✓ Created complaint types');

    // 7. Seed Complaints Response Templates
    console.log('  → Seeding complaints response templates...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'complaints_templates', group: GROUP } },
      update: {},
      create: {
        key: 'complaints_templates',
        group: GROUP,
        type: 'complaints',
        category: 'system',
        description: 'Complaints response templates',
        value: [
          {
            id: '1',
            name: 'Xác nhận tiếp nhận khiếu nại',
            content: 'Kính chào Anh/Chị,\n\nChúng tôi đã tiếp nhận khiếu nại của Anh/Chị.\n\nMã khiếu nại: [MÃ KN]\nNgày tiếp nhận: [NGÀY]\n\nChúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.\n\nTrân trọng,',
            category: 'acknowledgment',
            order: 1,
          },
          {
            id: '2',
            name: 'Yêu cầu bổ sung thông tin',
            content: 'Kính chào Anh/Chị,\n\nĐể xử lý khiếu nại của Anh/Chị, chúng tôi cần thêm một số thông tin:\n\n[THÔNG TIN CẦN BỔ SUNG]\n\nXin Anh/Chị vui lòng cung cấp để chúng tôi hỗ trợ tốt nhất.\n\nTrân trọng,',
            category: 'information_request',
            order: 2,
          },
          {
            id: '3',
            name: 'Thông báo đang xử lý',
            content: 'Kính chào Anh/Chị,\n\nKhiếu nại của Anh/Chị đang được bộ phận liên quan xem xét và xử lý.\n\nDự kiến hoàn thành: [NGÀY]\n\nChúng tôi sẽ thông báo kết quả ngay khi có cập nhật.\n\nTrân trọng,',
            category: 'processing',
            order: 3,
          },
          {
            id: '4',
            name: 'Thông báo giải quyết thành công',
            content: 'Kính chào Anh/Chị,\n\nChúng tôi đã xử lý xong khiếu nại của Anh/Chị.\n\nKết quả: [KẾT QUẢ XỬ LÝ]\n\nNếu còn vấn đề gì, xin Anh/Chị liên hệ lại để được hỗ trợ.\n\nCảm ơn Anh/Chị đã phản hồi!\n\nTrân trọng,',
            category: 'resolved',
            order: 4,
          },
          {
            id: '5',
            name: 'Xin lỗi và đề xuất bồi thường',
            content: 'Kính chào Anh/Chị,\n\nChúng tôi thành thật xin lỗi về sự cố Anh/Chị gặp phải.\n\nĐể bù đắp, chúng tôi đề xuất:\n[PHƯƠNG ÁN BỒI THƯỜNG]\n\nXin Anh/Chị xác nhận để chúng tôi tiến hành.\n\nTrân trọng,',
            category: 'compensation',
            order: 5,
          },
        ],
      },
    });
    console.log('  ✓ Created complaints response templates');

    console.log('✅ Complaints settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding complaints settings:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedComplaintsSettings()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
