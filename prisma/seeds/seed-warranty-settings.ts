import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedWarrantySettings() {
  console.log('🌱 Seeding warranty settings...');

  try {
    const GROUP = 'warranty';

    // 1. Seed Warranty SLA Settings
    console.log('  → Seeding warranty SLA settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_sla_settings', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_sla_settings',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty SLA settings',
        value: {
          low: { responseTime: 480, resolveTime: 72 },    // 8h response, 72h resolve
          medium: { responseTime: 240, resolveTime: 48 }, // 4h response, 48h resolve
          high: { responseTime: 120, resolveTime: 24 },   // 2h response, 24h resolve
          urgent: { responseTime: 60, resolveTime: 12 },  // 1h response, 12h resolve
        },
      },
    });
    console.log('  ✓ Created warranty SLA settings');

    // 2. Seed Warranty Notification Settings
    console.log('  → Seeding warranty notification settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_notification_settings', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_notification_settings',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty notification settings',
        value: {
          emailOnCreate: true,
          emailOnAssign: true,
          emailOnInspected: false,
          emailOnApproved: true,
          emailOnRejected: true,
          emailOnOverdue: true,
          inAppNotifications: true,
        },
      },
    });
    console.log('  ✓ Created warranty notification settings');

    // 3. Seed Warranty Tracking Settings (Public tracking)
    console.log('  → Seeding warranty tracking settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_tracking_settings', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_tracking_settings',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty tracking settings',
        value: {
          enabled: false,
          allowCustomerComments: false,
          showEmployeeName: true,
          showTimeline: true,
        },
      },
    });
    console.log('  ✓ Created warranty tracking settings');

    // 4. Seed Warranty Reminder Templates
    console.log('  → Seeding warranty reminder templates...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_reminder_templates', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_reminder_templates',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty reminder templates',
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
    console.log('  ✓ Created warranty reminder templates');

    // 5. Seed Warranty Card Colors
    console.log('  → Seeding warranty card color settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_card_color_settings', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_card_color_settings',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty card color settings',
        value: {
          statusColors: {
            new: 'bg-blue-50 border-blue-200',
            pending: 'bg-yellow-50 border-yellow-200',
            processed: 'bg-green-50 border-green-200',
            returned: 'bg-gray-50 border-gray-200',
          },
          overdueColor: 'bg-red-50 border-red-400',
          enableStatusColors: true,
          enableOverdueColor: true,
        },
      },
    });
    console.log('  ✓ Created warranty card color settings');

    // 6. Seed Warranty Response Templates
    console.log('  → Seeding warranty response templates...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_templates', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_templates',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty response templates',
        value: [
          {
            id: '1',
            name: 'Xác nhận tiếp nhận yêu cầu bảo hành',
            content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được yêu cầu bảo hành của Anh/Chị cho sản phẩm [TÊN SẢN PHẨM].\n\nMã bảo hành: [MÃ BẢO HÀNH]\nNgày tiếp nhận: [NGÀY]\n\nChúng tôi sẽ tiến hành kiểm tra và thông báo kết quả trong thời gian sớm nhất.\n\nTrân trọng,',
            category: 'general',
            order: 1,
          },
          {
            id: '2',
            name: 'Thông báo đang kiểm tra',
            content: 'Kính chào Anh/Chị,\n\nSản phẩm của Anh/Chị đang được nhân viên kỹ thuật kiểm tra.\n\nChúng tôi sẽ thông báo kết quả kiểm tra và phương án xử lý trong vòng 24-48 giờ.\n\nTrân trọng,',
            category: 'inspection-result',
            order: 2,
          },
          {
            id: '3',
            name: 'Chấp nhận bảo hành - Lỗi sản xuất',
            content: 'Kính chào Anh/Chị,\n\nSau khi kiểm tra, chúng tôi xác nhận sản phẩm của Anh/Chị thuộc diện bảo hành do lỗi sản xuất.\n\nPhương án xử lý: [ĐỔI MỚI / SỬA CHỮA / HOÀN TIỀN]\nThời gian xử lý: [THỜI GIAN]\n\nChúng tôi sẽ liên hệ với Anh/Chị để sắp xếp việc [đổi sản phẩm mới / sửa chữa / hoàn tiền].\n\nTrân trọng,',
            category: 'warranty-approved',
            order: 3,
          },
          {
            id: '4',
            name: 'Từ chối bảo hành - Lỗi người dùng',
            content: 'Kính chào Anh/Chị,\n\nSau khi kiểm tra kỹ thuật, chúng tôi xin phép được thông báo rằng sản phẩm của Anh/Chị không thuộc diện bảo hành do:\n\n[LÝ DO: VD: Hư hỏng do tác động vật lý / Sử dụng không đúng mục đích / Đã qua sửa chữa bởi bên thứ ba]\n\nChúng tôi có thể hỗ trợ sửa chữa với chi phí [SỐ TIỀN] nếu Anh/Chị có nhu cầu.\n\nTrân trọng,',
            category: 'warranty-rejected',
            order: 4,
          },
          {
            id: '5',
            name: 'Xin lỗi - Lỗi xử lý',
            content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sự cố xảy ra trong quá trình xử lý sản phẩm của Anh/Chị.\n\nChúng tôi đã xác định nguyên nhân và sẽ có phương án khắc phục/bồi thường hợp lý.\n\nXin Anh/Chị vui lòng liên hệ với chúng tôi để được hỗ trợ tốt nhất.\n\nTrân trọng,',
            category: 'processing-error',
            order: 5,
          },
          {
            id: '6',
            name: 'Hoàn thành bảo hành - Sẵn sàng trả hàng',
            content: 'Kính chào Anh/Chị,\n\nSản phẩm của Anh/Chị đã được bảo hành/sửa chữa hoàn tất.\n\nMã bảo hành: [MÃ BẢO HÀNH]\nKết quả: [KẾT QUẢ XỬ LÝ]\n\nAnh/Chị có thể đến nhận sản phẩm tại:\n[ĐỊA CHỈ]\n\nGiờ làm việc: 8h - 18h (Thứ 2 - Thứ 7)\n\nTrân trọng,',
            category: 'general',
            order: 6,
          },
        ],
      },
    });
    console.log('  ✓ Created warranty response templates');

    // 7. Seed Warranty Public Tracking Settings
    console.log('  → Seeding warranty public tracking settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'warranty_public_tracking', group: GROUP } },
      update: {},
      create: {
        key: 'warranty_public_tracking',
        group: GROUP,
        type: 'warranty',
        category: 'system',
        description: 'Warranty public tracking settings',
        value: {
          enabled: true,
          showTrackingCode: true,
          showCustomerInfo: false,
          showProductDetails: true,
          showTimeline: true,
          showEstimatedCompletion: true,
          allowRating: false,
          customMessage: 'Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ bảo hành của chúng tôi.',
        },
      },
    });
    console.log('  ✓ Created warranty public tracking settings');

    console.log('✅ Warranty settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding warranty settings:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedWarrantySettings()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
