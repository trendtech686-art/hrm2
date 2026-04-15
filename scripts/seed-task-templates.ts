/**
 * Seed task templates for testing
 * Run: npx tsx scripts/seed-task-templates.ts
 */
import 'dotenv/config';
import { prisma } from '../lib/prisma';

const PRIORITY_MAP = {
  low: 'LOW' as const,
  medium: 'MEDIUM' as const,
  high: 'HIGH' as const,
  urgent: 'URGENT' as const,
};

const templates = [
  {
    name: 'Kiểm tra hàng tồn kho',
    description: 'Mẫu giao việc kiểm tra hàng tồn kho định kỳ',
    title: 'Kiểm tra hàng tồn kho',
    taskDescription: 'Kiểm tra số lượng hàng tồn kho thực tế so với hệ thống, ghi nhận chênh lệch nếu có.',
    priority: 'high' as const,
    estimatedHours: 4,
    category: 'Kho hàng',
    subtasks: [
      { title: 'In danh sách hàng cần kiểm', description: 'Xuất danh sách từ hệ thống', order: 1 },
      { title: 'Đếm hàng thực tế', description: 'Đếm từng kệ theo thứ tự', order: 2 },
      { title: 'Đối chiếu với hệ thống', description: 'So sánh số lượng thực tế vs hệ thống', order: 3 },
      { title: 'Ghi nhận chênh lệch', description: 'Lập biên bản nếu có sai lệch', order: 4 },
    ],
    checklistItems: [
      'Đã in danh sách kiểm',
      'Đã đếm đủ tất cả kệ hàng',
      'Đã ghi nhận chênh lệch',
      'Đã chụp ảnh bằng chứng',
    ],
  },
  {
    name: 'Cập nhật bảng giá sản phẩm',
    description: 'Mẫu giao việc cập nhật bảng giá khi có thay đổi từ nhà cung cấp',
    title: 'Cập nhật bảng giá sản phẩm',
    taskDescription: 'Cập nhật giá bán lẻ, giá sỉ cho các sản phẩm theo bảng giá mới từ nhà cung cấp.',
    priority: 'medium' as const,
    estimatedHours: 2,
    category: 'Bán hàng',
    subtasks: [
      { title: 'Nhận bảng giá mới từ NCC', description: 'Xác nhận bảng giá mới nhất', order: 1 },
      { title: 'Tính giá bán lẻ mới', description: 'Áp dụng công thức tính giá bán', order: 2 },
      { title: 'Cập nhật trên hệ thống', description: 'Nhập giá mới vào hệ thống', order: 3 },
      { title: 'In bảng giá mới', description: 'In và dán tại quầy', order: 4 },
    ],
    checklistItems: [
      'Đã nhận bảng giá NCC',
      'Đã tính giá bán lẻ',
      'Đã cập nhật hệ thống',
      'Đã in và dán bảng giá mới',
    ],
  },
  {
    name: 'Sắp xếp kệ hàng',
    description: 'Mẫu giao việc sắp xếp lại kệ hàng theo danh mục',
    title: 'Sắp xếp kệ hàng khu vực',
    taskDescription: 'Sắp xếp lại kệ hàng theo danh mục mới, dán nhãn vị trí cho từng sản phẩm.',
    priority: 'low' as const,
    estimatedHours: 3,
    category: 'Kho hàng',
    subtasks: [
      { title: 'Lấy sơ đồ kệ mới', description: 'Nhận sơ đồ bố trí kệ mới từ quản lý', order: 1 },
      { title: 'Dọn hàng ra khỏi kệ', description: 'Lấy hết hàng ra, phân loại', order: 2 },
      { title: 'Sắp xếp lại theo sơ đồ', description: 'Đặt hàng đúng vị trí mới', order: 3 },
      { title: 'Dán nhãn vị trí', description: 'Dán mã QR/nhãn cho từng vị trí', order: 4 },
    ],
    checklistItems: [],
  },
  {
    name: 'Liên hệ nhà cung cấp',
    description: 'Mẫu giao việc liên hệ NCC để đặt hàng hoặc xử lý vấn đề',
    title: 'Liên hệ nhà cung cấp',
    taskDescription: 'Liên hệ nhà cung cấp để xác nhận đơn hàng, kiểm tra tình trạng giao hàng hoặc giải quyết vấn đề.',
    priority: 'urgent' as const,
    estimatedHours: 1,
    category: 'Mua hàng',
    subtasks: [
      { title: 'Gọi điện/email NCC', description: 'Liên hệ trực tiếp', order: 1 },
      { title: 'Xác nhận nội dung', description: 'Ghi nhận kết quả trao đổi', order: 2 },
      { title: 'Cập nhật hệ thống', description: 'Lưu thông tin vào hệ thống', order: 3 },
    ],
    checklistItems: [],
  },
  {
    name: 'Xử lý phiếu bảo hành',
    description: 'Mẫu giao việc xử lý yêu cầu bảo hành từ khách hàng',
    title: 'Xử lý phiếu bảo hành',
    taskDescription: 'Tiếp nhận và xử lý phiếu bảo hành, kiểm tra sản phẩm, liên hệ hãng nếu cần.',
    priority: 'high' as const,
    estimatedHours: 2,
    category: 'Bảo hành',
    subtasks: [
      { title: 'Tiếp nhận sản phẩm', description: 'Kiểm tra tình trạng sản phẩm', order: 1 },
      { title: 'Xác nhận điều kiện BH', description: 'Kiểm tra còn hạn bảo hành', order: 2 },
      { title: 'Gửi hãng hoặc sửa tại chỗ', description: 'Xử lý theo quy trình', order: 3 },
      { title: 'Trả sản phẩm cho khách', description: 'Thông báo và trả hàng', order: 4 },
    ],
    checklistItems: [
      'Đã kiểm tra tình trạng sản phẩm',
      'Đã xác nhận bảo hành hợp lệ',
      'Đã chụp ảnh sản phẩm',
      'Đã liên hệ hãng (nếu cần)',
    ],
  },
  {
    name: 'Vệ sinh cửa hàng',
    description: 'Mẫu giao việc vệ sinh định kỳ cửa hàng',
    title: 'Vệ sinh cửa hàng',
    taskDescription: 'Vệ sinh toàn bộ khu vực cửa hàng bao gồm quầy kệ, sàn nhà, kho hàng.',
    priority: 'low' as const,
    estimatedHours: 2,
    category: 'Vận hành',
    subtasks: [
      { title: 'Lau kệ trưng bày', description: 'Lau sạch bụi trên các kệ', order: 1 },
      { title: 'Lau sàn nhà', description: 'Quét và lau sàn toàn bộ', order: 2 },
      { title: 'Dọn kho hàng', description: 'Sắp xếp và vệ sinh kho', order: 3 },
      { title: 'Vệ sinh khu vực quầy', description: 'Dọn dẹp quầy thu ngân', order: 4 },
    ],
    checklistItems: [],
  },
  {
    name: 'Đào tạo nhân viên mới',
    description: 'Mẫu giao việc hướng dẫn nhân viên mới quy trình làm việc',
    title: 'Đào tạo nhân viên mới',
    taskDescription: 'Hướng dẫn nhân viên mới các quy trình bán hàng, sử dụng hệ thống, quy định cửa hàng.',
    priority: 'medium' as const,
    estimatedHours: 8,
    category: 'Nhân sự',
    subtasks: [
      { title: 'Giới thiệu quy trình bán hàng', description: 'Hướng dẫn quy trình tiếp khách, tư vấn, thanh toán', order: 1 },
      { title: 'Hướng dẫn sử dụng hệ thống', description: 'Đào tạo sử dụng phần mềm', order: 2 },
      { title: 'Giải thích nội quy', description: 'Nội quy cửa hàng, giờ làm', order: 3 },
      { title: 'Thực hành với khách thật', description: 'Cho NV mới thực hành dưới giám sát', order: 4 },
    ],
    checklistItems: [
      'NV mới đã nắm quy trình bán hàng',
      'NV mới đã sử dụng được hệ thống',
      'NV mới đã đọc và ký nội quy',
      'Đã đánh giá kết quả đào tạo',
    ],
  },
  {
    name: 'Báo cáo doanh số cuối ngày',
    description: 'Mẫu giao việc tổng hợp và báo cáo doanh số cuối ngày',
    title: 'Báo cáo doanh số cuối ngày',
    taskDescription: 'Tổng hợp doanh số bán hàng trong ngày, kiểm tra tiền mặt, đối chiếu với hệ thống.',
    priority: 'high' as const,
    estimatedHours: 1,
    category: 'Bán hàng',
    subtasks: [
      { title: 'Xuất báo cáo từ hệ thống', description: 'Xuất file báo cáo bán hàng', order: 1 },
      { title: 'Kiểm tiền mặt', description: 'Đếm tiền mặt thực tế trong quỹ', order: 2 },
      { title: 'Đối chiếu chênh lệch', description: 'So sánh tiền mặt vs doanh thu hệ thống', order: 3 },
      { title: 'Gửi báo cáo cho quản lý', description: 'Email hoặc chat báo cáo', order: 4 },
    ],
    checklistItems: [],
  },
];

async function main() {
  console.log('Seeding task templates into TaskTemplate model...');

  // Check how many templates exist already
  const existingCount = await prisma.taskTemplate.count({ where: { isDeleted: false } });
  console.log(`Found ${existingCount} existing templates.`);

  // Get the max counter from existing IDs to avoid collisions
  const existingTemplates = await prisma.taskTemplate.findMany({
    select: { systemId: true, id: true },
    orderBy: { systemId: 'desc' },
    take: 1,
  });

  let counter = 1;
  if (existingTemplates.length > 0) {
    const lastId = existingTemplates[0].id;
    const num = parseInt(lastId.replace(/\D/g, ''), 10);
    if (!isNaN(num)) counter = num + 1;
  }

  let created = 0;
  for (const t of templates) {
    // Check if template with same name already exists
    const exists = await prisma.taskTemplate.findFirst({
      where: { name: t.name, isDeleted: false },
    });
    if (exists) {
      console.log(`  Skip: "${t.name}" (already exists)`);
      continue;
    }

    const systemId = `TASK-TPL-${String(counter).padStart(6, '0')}`;
    const id = `MAU${String(counter).padStart(6, '0')}`;

    await prisma.taskTemplate.create({
      data: {
        systemId,
        id,
        name: t.name,
        description: t.description,
        title: t.title,
        taskDescription: t.taskDescription,
        priority: PRIORITY_MAP[t.priority],
        estimatedHours: t.estimatedHours,
        category: t.category,
        subtasks: t.subtasks,
        checklistItems: t.checklistItems,
        isActive: true,
      },
    });
    console.log(`  Created: "${t.name}" (${systemId})`);
    counter++;
    created++;
  }

  console.log(`\nDone! Created ${created} new templates.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
