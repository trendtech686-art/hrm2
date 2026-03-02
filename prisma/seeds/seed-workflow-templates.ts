import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedWorkflowTemplates() {
  console.log('🌱 Seeding workflow templates...');

  try {
    const GROUP = 'workflow';

    // Seed Workflow Templates
    console.log('  → Seeding workflow templates...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'workflow_templates', group: GROUP } },
      update: {},
      create: {
        key: 'workflow_templates',
        group: GROUP,
        type: 'json',
        category: 'workflow',
        description: 'Workflow templates for various processes',
        value: [
          // Complaints workflows
          {
            systemId: 'WF-COMPL-001',
            id: 'complaints-standard',
            name: 'complaints',
            label: 'Quy trình khiếu nại tiêu chuẩn',
            description: 'Quy trình xử lý khiếu nại cơ bản theo SLA',
            subtasks: [
              { id: 's1', title: 'Tiếp nhận khiếu nại', completed: false, order: 1 },
              { id: 's2', title: 'Xác minh thông tin', completed: false, order: 2 },
              { id: 's3', title: 'Phân loại & ưu tiên', completed: false, order: 3 },
              { id: 's4', title: 'Điều tra nguyên nhân', completed: false, order: 4 },
              { id: 's5', title: 'Đề xuất giải pháp', completed: false, order: 5 },
              { id: 's6', title: 'Liên hệ khách hàng', completed: false, order: 6 },
              { id: 's7', title: 'Xác nhận & đóng khiếu nại', completed: false, order: 7 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            systemId: 'WF-COMPL-002',
            id: 'complaints-urgent',
            name: 'complaints',
            label: 'Quy trình khiếu nại khẩn cấp',
            description: 'Xử lý khiếu nại cấp độ khẩn, cần giải quyết ngay',
            subtasks: [
              { id: 's1', title: 'Tiếp nhận & escalate ngay', completed: false, order: 1 },
              { id: 's2', title: 'Thông báo quản lý', completed: false, order: 2 },
              { id: 's3', title: 'Xử lý tạm thời', completed: false, order: 3 },
              { id: 's4', title: 'Giải quyết triệt để', completed: false, order: 4 },
              { id: 's5', title: 'Báo cáo & rút kinh nghiệm', completed: false, order: 5 },
            ],
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Warranty workflows
          {
            systemId: 'WF-WARR-001',
            id: 'warranty-standard',
            name: 'warranty',
            label: 'Quy trình bảo hành tiêu chuẩn',
            description: 'Quy trình xử lý bảo hành sản phẩm',
            subtasks: [
              { id: 's1', title: 'Tiếp nhận yêu cầu bảo hành', completed: false, order: 1 },
              { id: 's2', title: 'Kiểm tra điều kiện bảo hành', completed: false, order: 2 },
              { id: 's3', title: 'Kiểm tra kỹ thuật', completed: false, order: 3 },
              { id: 's4', title: 'Xác định nguyên nhân lỗi', completed: false, order: 4 },
              { id: 's5', title: 'Sửa chữa / Đổi mới', completed: false, order: 5 },
              { id: 's6', title: 'Kiểm tra chất lượng', completed: false, order: 6 },
              { id: 's7', title: 'Liên hệ khách nhận hàng', completed: false, order: 7 },
              { id: 's8', title: 'Bàn giao & hoàn thành', completed: false, order: 8 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            systemId: 'WF-WARR-002',
            id: 'warranty-reject',
            name: 'warranty',
            label: 'Quy trình từ chối bảo hành',
            description: 'Xử lý các trường hợp không đủ điều kiện bảo hành',
            subtasks: [
              { id: 's1', title: 'Tiếp nhận yêu cầu', completed: false, order: 1 },
              { id: 's2', title: 'Kiểm tra điều kiện', completed: false, order: 2 },
              { id: 's3', title: 'Chụp ảnh/ghi nhận bằng chứng', completed: false, order: 3 },
              { id: 's4', title: 'Soạn thông báo từ chối', completed: false, order: 4 },
              { id: 's5', title: 'Đề xuất phương án sửa chữa có phí', completed: false, order: 5 },
              { id: 's6', title: 'Liên hệ khách hàng', completed: false, order: 6 },
            ],
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Order workflows
          {
            systemId: 'WF-ORD-001',
            id: 'orders-standard',
            name: 'orders',
            label: 'Quy trình xử lý đơn hàng',
            description: 'Quy trình từ khi nhận đơn đến hoàn thành',
            subtasks: [
              { id: 's1', title: 'Xác nhận đơn hàng', completed: false, order: 1 },
              { id: 's2', title: 'Kiểm tra tồn kho', completed: false, order: 2 },
              { id: 's3', title: 'Soạn hàng', completed: false, order: 3 },
              { id: 's4', title: 'Đóng gói', completed: false, order: 4 },
              { id: 's5', title: 'Bàn giao vận chuyển', completed: false, order: 5 },
              { id: 's6', title: 'Theo dõi giao hàng', completed: false, order: 6 },
              { id: 's7', title: 'Xác nhận hoàn thành', completed: false, order: 7 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Sales return workflows
          {
            systemId: 'WF-RET-001',
            id: 'sales-returns-standard',
            name: 'sales-returns',
            label: 'Quy trình đổi trả hàng',
            description: 'Xử lý yêu cầu đổi trả hàng từ khách',
            subtasks: [
              { id: 's1', title: 'Tiếp nhận yêu cầu đổi trả', completed: false, order: 1 },
              { id: 's2', title: 'Kiểm tra điều kiện đổi trả', completed: false, order: 2 },
              { id: 's3', title: 'Nhận hàng từ khách', completed: false, order: 3 },
              { id: 's4', title: 'Kiểm tra chất lượng hàng trả', completed: false, order: 4 },
              { id: 's5', title: 'Xử lý đổi/hoàn tiền', completed: false, order: 5 },
              { id: 's6', title: 'Cập nhật kho', completed: false, order: 6 },
              { id: 's7', title: 'Hoàn tất & thông báo khách', completed: false, order: 7 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Stock transfer workflows
          {
            systemId: 'WF-STK-001',
            id: 'stock-transfers-standard',
            name: 'stock-transfers',
            label: 'Quy trình chuyển kho',
            description: 'Xử lý chuyển hàng giữa các kho',
            subtasks: [
              { id: 's1', title: 'Tạo phiếu chuyển kho', completed: false, order: 1 },
              { id: 's2', title: 'Duyệt phiếu chuyển', completed: false, order: 2 },
              { id: 's3', title: 'Soạn hàng xuất', completed: false, order: 3 },
              { id: 's4', title: 'Vận chuyển', completed: false, order: 4 },
              { id: 's5', title: 'Nhận hàng tại kho đích', completed: false, order: 5 },
              { id: 's6', title: 'Kiểm tra & nhập kho', completed: false, order: 6 },
              { id: 's7', title: 'Cập nhật hệ thống', completed: false, order: 7 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Inventory check workflows
          {
            systemId: 'WF-INV-001',
            id: 'inventory-checks-standard',
            name: 'inventory-checks',
            label: 'Quy trình kiểm kho',
            description: 'Quy trình kiểm kê hàng hóa định kỳ',
            subtasks: [
              { id: 's1', title: 'Lập kế hoạch kiểm kho', completed: false, order: 1 },
              { id: 's2', title: 'Thông báo nhân viên', completed: false, order: 2 },
              { id: 's3', title: 'In phiếu kiểm kho', completed: false, order: 3 },
              { id: 's4', title: 'Thực hiện kiểm đếm', completed: false, order: 4 },
              { id: 's5', title: 'Nhập số liệu thực tế', completed: false, order: 5 },
              { id: 's6', title: 'Đối chiếu chênh lệch', completed: false, order: 6 },
              { id: 's7', title: 'Giải trình chênh lệch', completed: false, order: 7 },
              { id: 's8', title: 'Duyệt & cân bằng kho', completed: false, order: 8 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Purchase return workflows
          {
            systemId: 'WF-PRET-001',
            id: 'purchase-returns-standard',
            name: 'purchase-returns',
            label: 'Quy trình trả hàng NCC',
            description: 'Xử lý trả hàng cho nhà cung cấp',
            subtasks: [
              { id: 's1', title: 'Xác định hàng cần trả', completed: false, order: 1 },
              { id: 's2', title: 'Liên hệ NCC', completed: false, order: 2 },
              { id: 's3', title: 'Lập phiếu trả hàng', completed: false, order: 3 },
              { id: 's4', title: 'Soạn hàng xuất', completed: false, order: 4 },
              { id: 's5', title: 'Bàn giao hàng cho NCC', completed: false, order: 5 },
              { id: 's6', title: 'Xác nhận NCC đã nhận', completed: false, order: 6 },
              { id: 's7', title: 'Cập nhật công nợ', completed: false, order: 7 },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });
    console.log('  ✓ Created workflow templates');

    console.log('✅ Workflow templates seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding workflow templates:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedWorkflowTemplates()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
