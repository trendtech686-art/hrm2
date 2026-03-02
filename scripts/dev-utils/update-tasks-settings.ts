import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const GROUP = 'tasks';

async function main() {
  console.log('🔄 Updating tasks settings for mobile accessories retail...\n');

  // 1. Update SLA Settings - faster response for retail
  console.log('  → Updating SLA settings...');
  await prisma.setting.update({
    where: { key_group: { key: 'tasks_sla_settings', group: GROUP } },
    data: {
      value: {
        low: { responseTime: 240, resolveTime: 48 },      // 4h phản hồi, 48h hoàn thành
        medium: { responseTime: 120, resolveTime: 24 },   // 2h phản hồi, 24h hoàn thành
        high: { responseTime: 60, resolveTime: 8 },       // 1h phản hồi, 8h hoàn thành
        urgent: { responseTime: 30, resolveTime: 4 },     // 30p phản hồi, 4h hoàn thành
      },
    },
  });
  console.log('  ✓ SLA settings updated');

  // 2. Update Task Types for retail business
  console.log('  → Updating task types...');
  await prisma.setting.update({
    where: { key_group: { key: 'tasks_task_types', group: GROUP } },
    data: {
      value: [
        { id: 'general', name: 'Công việc chung', isActive: true, isDefault: true },
        { id: 'order-process', name: 'Xử lý đơn hàng', icon: 'shopping-cart', color: 'blue', isActive: true },
        { id: 'inventory', name: 'Kiểm tra tồn kho', icon: 'package', color: 'amber', isActive: true },
        { id: 'supplier', name: 'Liên hệ NCC', icon: 'truck', color: 'purple', isActive: true },
        { id: 'customer-support', name: 'CSKH', icon: 'headphones', color: 'green', isActive: true },
        { id: 'product-listing', name: 'Đăng sản phẩm', icon: 'image', color: 'pink', isActive: true },
        { id: 'shipping', name: 'Vận chuyển', icon: 'send', color: 'cyan', isActive: true },
        { id: 'warranty', name: 'Bảo hành', icon: 'shield', color: 'orange', isActive: true },
        { id: 'price-update', name: 'Cập nhật giá', icon: 'tag', color: 'red', isActive: true },
        { id: 'report', name: 'Báo cáo', icon: 'file-text', color: 'slate', isActive: true },
      ],
    },
  });
  console.log('  ✓ Task types updated');

  // 3. Update Task Templates for retail business
  console.log('  → Updating task templates...');
  await prisma.setting.update({
    where: { key_group: { key: 'tasks_templates', group: GROUP } },
    data: {
      value: [
        {
          id: 'new_product_launch',
          name: 'Ra mắt sản phẩm mới',
          description: 'Quy trình thêm sản phẩm mới từ NCC',
          defaultPriority: 'medium',
          defaultTaskType: 'product-listing',
          subtasks: [
            { title: 'Nhận hàng mẫu từ NCC', order: 1 },
            { title: 'Chụp ảnh sản phẩm', order: 2 },
            { title: 'Viết mô tả sản phẩm', order: 3 },
            { title: 'Thiết lập giá bán (lẻ/sỉ/CTV)', order: 4 },
            { title: 'Đăng lên website PKGX', order: 5 },
            { title: 'Đăng lên Shopee/Lazada', order: 6 },
          ],
          isActive: true,
        },
        {
          id: 'inventory_check',
          name: 'Kiểm kho định kỳ',
          description: 'Kiểm tra tồn kho hàng tuần/tháng',
          defaultPriority: 'medium',
          defaultTaskType: 'inventory',
          subtasks: [
            { title: 'Xuất báo cáo tồn từ Sapo', order: 1 },
            { title: 'Kiểm đếm thực tế', order: 2 },
            { title: 'Đối chiếu chênh lệch', order: 3 },
            { title: 'Điều chỉnh tồn kho', order: 4 },
            { title: 'Báo cáo quản lý', order: 5 },
          ],
          isActive: true,
        },
        {
          id: 'order_issue',
          name: 'Xử lý đơn hàng lỗi',
          description: 'Giải quyết vấn đề đơn hàng (thiếu hàng, giao sai, hư hỏng)',
          defaultPriority: 'high',
          defaultTaskType: 'customer-support',
          subtasks: [
            { title: 'Tiếp nhận phản hồi KH', order: 1 },
            { title: 'Kiểm tra thông tin đơn hàng', order: 2 },
            { title: 'Xác minh lỗi (ảnh/video)', order: 3 },
            { title: 'Đề xuất giải pháp', order: 4 },
            { title: 'Thực hiện đổi/trả/hoàn tiền', order: 5 },
            { title: 'Cập nhật trạng thái', order: 6 },
          ],
          isActive: true,
        },
        {
          id: 'supplier_order',
          name: 'Đặt hàng NCC',
          description: 'Quy trình đặt hàng bổ sung từ nhà cung cấp',
          defaultPriority: 'medium',
          defaultTaskType: 'supplier',
          subtasks: [
            { title: 'Kiểm tra tồn kho cần nhập', order: 1 },
            { title: 'Lập danh sách đặt hàng', order: 2 },
            { title: 'Gửi PO cho NCC', order: 3 },
            { title: 'Xác nhận đơn hàng + ETA', order: 4 },
            { title: 'Theo dõi vận chuyển', order: 5 },
            { title: 'Nhập kho khi hàng về', order: 6 },
          ],
          isActive: true,
        },
        {
          id: 'price_sync',
          name: 'Đồng bộ giá đa kênh',
          description: 'Cập nhật giá trên các kênh bán hàng',
          defaultPriority: 'high',
          defaultTaskType: 'price-update',
          subtasks: [
            { title: 'Cập nhật giá Sapo', order: 1 },
            { title: 'Sync giá PKGX', order: 2 },
            { title: 'Cập nhật giá Shopee', order: 3 },
            { title: 'Cập nhật giá Lazada', order: 4 },
            { title: 'Kiểm tra hiển thị', order: 5 },
          ],
          isActive: true,
        },
        {
          id: 'warranty_process',
          name: 'Xử lý bảo hành',
          description: 'Quy trình tiếp nhận và xử lý bảo hành sản phẩm',
          defaultPriority: 'medium',
          defaultTaskType: 'warranty',
          subtasks: [
            { title: 'Tiếp nhận yêu cầu BH', order: 1 },
            { title: 'Kiểm tra tình trạng SP', order: 2 },
            { title: 'Xác định phương án (sửa/đổi)', order: 3 },
            { title: 'Gửi NCC (nếu cần)', order: 4 },
            { title: 'Trả hàng cho KH', order: 5 },
            { title: 'Cập nhật trạng thái BH', order: 6 },
          ],
          isActive: true,
        },
      ],
    },
  });
  console.log('  ✓ Task templates updated');

  console.log('\n✅ Tasks settings updated successfully for mobile accessories retail!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
