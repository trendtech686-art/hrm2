/**
 * Seed thêm loại phạt cho kinh doanh phụ kiện điện thoại
 * (đóng gói, bảo hành, kho vận)
 *
 * Run: npx tsx scripts/seed-penalty-accessories.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const accessoryPenalties = [
  // Đóng gói - Packaging
  {
    id: 'PACKING_WRONG_ITEM',
    name: 'Đóng gói nhầm sản phẩm',
    description: 'Cho nhầm sản phẩm vào đơn hàng (sai model, sai màu, sai loại)',
    defaultAmount: 100000,
    category: 'packaging',
    sortOrder: 40,
  },
  {
    id: 'PACKING_MISSING_ITEM',
    name: 'Đóng gói thiếu sản phẩm',
    description: 'Thiếu sản phẩm hoặc phụ kiện kèm theo trong đơn hàng',
    defaultAmount: 80000,
    category: 'packaging',
    sortOrder: 41,
  },
  {
    id: 'PACKING_EXCESS_ITEM',
    name: 'Đóng gói thừa sản phẩm',
    description: 'Cho thừa sản phẩm vào đơn hàng gây thất thoát',
    defaultAmount: 50000,
    category: 'packaging',
    sortOrder: 42,
  },
  {
    id: 'PACKING_DAMAGED',
    name: 'Đóng gói làm hỏng hàng',
    description: 'Sản phẩm bị hư hỏng do đóng gói không cẩn thận (vỡ kính, trầy xước)',
    defaultAmount: 0, // Theo giá trị thực tế
    category: 'packaging',
    sortOrder: 43,
  },
  {
    id: 'PACKING_CARELESS',
    name: 'Đóng gói không đạt chuẩn',
    description: 'Đóng gói ẩu, thiếu bọc bảo vệ, không dán seal, quên phiếu giao hàng',
    defaultAmount: 30000,
    category: 'packaging',
    sortOrder: 44,
  },

  // Kho vận - Warehouse
  {
    id: 'STOCK_WRONG_COUNT',
    name: 'Đếm hàng sai số lượng',
    description: 'Kiểm hàng nhập/xuất sai số lượng so với phiếu',
    defaultAmount: 50000,
    category: 'warehouse',
    sortOrder: 50,
  },
  {
    id: 'STOCK_WRONG_LOCATION',
    name: 'Để hàng sai vị trí',
    description: 'Xếp hàng không đúng vị trí quy định gây khó tìm kiếm',
    defaultAmount: 30000,
    category: 'warehouse',
    sortOrder: 51,
  },
  {
    id: 'STOCK_LOSS',
    name: 'Thất thoát hàng hóa',
    description: 'Hàng hóa bị mất do quản lý kho không chặt chẽ',
    defaultAmount: 0, // Theo giá trị thực tế
    category: 'warehouse',
    sortOrder: 52,
  },

  // Bảo hành - Warranty
  {
    id: 'WARRANTY_WRONG_DIAGNOSIS',
    name: 'Chẩn đoán bảo hành sai',
    description: 'Xác định sai nguyên nhân lỗi sản phẩm bảo hành',
    defaultAmount: 100000,
    category: 'warranty',
    sortOrder: 60,
  },
  {
    id: 'WARRANTY_DELAY',
    name: 'Trả bảo hành trễ hẹn',
    description: 'Không trả hàng bảo hành đúng thời hạn cam kết với khách',
    defaultAmount: 50000,
    category: 'warranty',
    sortOrder: 61,
  },
  {
    id: 'WARRANTY_LOST_PARTS',
    name: 'Làm mất linh kiện bảo hành',
    description: 'Làm mất phụ tùng hoặc linh kiện trong quá trình bảo hành',
    defaultAmount: 0, // Theo giá trị thực tế
    category: 'warranty',
    sortOrder: 62,
  },

  // Bán hàng - Sales
  {
    id: 'SALES_WRONG_PRICE',
    name: 'Báo giá sai',
    description: 'Báo sai giá cho khách hàng, tính sai chiết khấu, sai khuyến mãi',
    defaultAmount: 50000,
    category: 'sales',
    sortOrder: 70,
  },
  {
    id: 'SALES_WRONG_ORDER',
    name: 'Tạo đơn sai thông tin',
    description: 'Nhập sai thông tin đơn hàng (sai SĐT, địa chỉ, ghi chú giao hàng)',
    defaultAmount: 50000,
    category: 'sales',
    sortOrder: 71,
  },
];

async function main() {
  console.log('⚠️ Seeding thêm loại phạt cho KD phụ kiện ĐT...\n');

  let created = 0;
  let skipped = 0;

  for (const penalty of accessoryPenalties) {
    const existing = await prisma.penaltyTypeSetting.findUnique({ where: { id: penalty.id } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.penaltyTypeSetting.create({
      data: {
        systemId: `penalty_${penalty.id.toLowerCase()}_${randomUUID().slice(0, 8)}`,
        id: penalty.id,
        name: penalty.name,
        description: penalty.description,
        defaultAmount: penalty.defaultAmount,
        category: penalty.category,
        sortOrder: penalty.sortOrder,
        isActive: true,
      },
    });
    created++;
  }

  console.log(`✅ Created: ${created} | Skipped: ${skipped}`);
  console.log('\nChi tiết:');
  console.log('  📦 Đóng gói: 5 loại (nhầm, thiếu, thừa, hỏng, ẩu)');
  console.log('  🏭 Kho vận:  3 loại (đếm sai, sai vị trí, thất thoát)');
  console.log('  🔧 Bảo hành: 3 loại (chẩn đoán sai, trễ hẹn, mất linh kiện)');
  console.log('  💰 Bán hàng: 2 loại (báo giá sai, tạo đơn sai)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
