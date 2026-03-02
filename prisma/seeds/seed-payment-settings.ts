import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedPaymentSettings() {
  console.log('🌱 Seeding payment settings...');

  try {
    // 1. Seed Receipt Types (Loại phiếu thu)
    console.log('  → Seeding receipt types...');
    const receiptTypes = [
      { id: 'THANHTOAN', name: 'Thanh toán cho đơn hàng', description: 'Thu tiền thanh toán đơn hàng', isDefault: true, metadata: { isBusinessResult: true, color: 'green' } },
      { id: 'THUNO', name: 'Thu nợ khách hàng', description: 'Thu hồi công nợ từ khách hàng', isDefault: false, metadata: { isBusinessResult: true, color: 'blue' } },
      { id: 'DATCOC', name: 'Đối tác vận chuyển đặt cọc', description: 'Thu tiền đặt cọc từ đối tác vận chuyển', isDefault: false, metadata: { isBusinessResult: false, color: 'cyan' } },
      { id: 'THUNO_VC', name: 'Thu nợ đối tác vận chuyển', description: 'Thu nợ từ đối tác vận chuyển', isDefault: false, metadata: { isBusinessResult: false, color: 'cyan' } },
      { id: 'THUNHAPKHAC', name: 'Thu nhập khác', description: 'Các khoản thu nhập khác', isDefault: false, metadata: { isBusinessResult: false, color: 'gray' } },
      { id: 'TIENTHUONG', name: 'Tiền thưởng', description: 'Thu tiền thưởng', isDefault: false, metadata: { isBusinessResult: false, color: 'amber' } },
      { id: 'TIENBOITHUONG', name: 'Tiền bồi thường', description: 'Thu tiền bồi thường thiệt hại', isDefault: false, metadata: { isBusinessResult: false, color: 'orange' } },
      { id: 'CHOTHUETAISAN', name: 'Cho thuê tài sản', description: 'Thu tiền cho thuê tài sản', isDefault: false, metadata: { isBusinessResult: false, color: 'purple' } },
      { id: 'THANHLY', name: 'Nhượng bán, thanh lý tài sản', description: 'Thu từ thanh lý, nhượng bán tài sản', isDefault: false, metadata: { isBusinessResult: false, color: 'indigo' } },
      { id: 'TUDONG', name: 'Tự động', description: 'Phiếu thu tự động từ hệ thống', isDefault: false, metadata: { isBusinessResult: false, color: 'slate', isSystem: true } },
    ];

    for (const item of receiptTypes) {
      await prisma.settingsData.upsert({
        where: { id_type: { id: item.id, type: 'receipt-type' } },
        update: { name: item.name, description: item.description, isDefault: item.isDefault, metadata: item.metadata },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: 'receipt-type',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
          metadata: item.metadata,
        },
      });
    }
    console.log(`  ✓ Created ${receiptTypes.length} receipt types`);

    // 2. Seed Payment Types (Loại phiếu chi)
    console.log('  → Seeding payment types...');
    const paymentTypes = [
      { id: 'THANHTOANDONNHAP', name: 'Thanh toán cho đơn nhập hàng', description: 'Thanh toán công nợ nhà cung cấp', isDefault: true, metadata: { isBusinessResult: false, color: 'red' } },
      { id: 'TRANO', name: 'Trả nợ đối tác vận chuyển', description: 'Trả nợ cho đối tác vận chuyển', isDefault: false, metadata: { isBusinessResult: false, color: 'cyan' } },
      { id: 'HOANTIEN', name: 'Hoàn tiền khách hàng', description: 'Chi hoàn tiền cho khách hàng', isDefault: false, metadata: { isBusinessResult: true, color: 'pink' } },
      { id: 'CHIPHIVANCHUYEN', name: 'Chi phí vận chuyển', description: 'Chi phí vận chuyển, giao hàng', isDefault: false, metadata: { isBusinessResult: true, color: 'blue' } },
      { id: 'CHIPHIVPP', name: 'Chi phí văn phòng phẩm', description: 'Chi phí văn phòng phẩm', isDefault: false, metadata: { isBusinessResult: true, color: 'purple' } },
      { id: 'CHIPHIQUANLY', name: 'Chi phí quản lý cửa hàng', description: 'Chi phí quản lý cửa hàng', isDefault: false, metadata: { isBusinessResult: true, color: 'indigo' } },
      { id: 'CHIPHIBANHANG', name: 'Chi phí bán hàng', description: 'Chi phí bán hàng', isDefault: false, metadata: { isBusinessResult: true, color: 'green' } },
      { id: 'CHIPHINHANCONG', name: 'Chi phí nhân công', description: 'Chi phí nhân công, lương nhân viên', isDefault: false, metadata: { isBusinessResult: true, color: 'amber' } },
      { id: 'CHIPHISINHHOAT', name: 'Chi phí sinh hoạt', description: 'Chi phí sinh hoạt hàng ngày', isDefault: false, metadata: { isBusinessResult: true, color: 'teal' } },
      { id: 'CHIPHINVL', name: 'Chi phí nguyên - vật liệu', description: 'Chi phí nguyên vật liệu', isDefault: false, metadata: { isBusinessResult: true, color: 'orange' } },
      { id: 'CHIPHISANXUAT', name: 'Chi phí sản xuất', description: 'Chi phí sản xuất', isDefault: false, metadata: { isBusinessResult: true, color: 'rose' } },
      { id: 'CHIPHIKHAC', name: 'Chi phí khác', description: 'Các khoản chi phí khác', isDefault: false, metadata: { isBusinessResult: false, color: 'gray' } },
      { id: 'TUDONG', name: 'Tự động', description: 'Phiếu chi tự động từ hệ thống', isDefault: false, metadata: { isBusinessResult: false, color: 'slate', isSystem: true } },
    ];

    for (const item of paymentTypes) {
      await prisma.settingsData.upsert({
        where: { id_type: { id: item.id, type: 'payment-type' } },
        update: { name: item.name, description: item.description, isDefault: item.isDefault, metadata: item.metadata },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: 'payment-type',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
          metadata: item.metadata,
        },
      });
    }
    console.log(`  ✓ Created ${paymentTypes.length} payment types`);

    // 3. Seed Target Groups (Nhóm người nộp/nhận)
    console.log('  → Seeding target groups...');
    const targetGroups = [
      { id: 'KHACHHANG', name: 'Khách hàng', description: 'Khách hàng mua hàng', isDefault: true },
      { id: 'NHANVIEN', name: 'Nhân viên', description: 'Nhân viên công ty', isDefault: false },
      { id: 'NHACUNGCAP', name: 'Nhà cung cấp', description: 'Nhà cung cấp hàng hóa', isDefault: false },
      { id: 'DOITACVANCHUYEN', name: 'Đối tác vận chuyển', description: 'Đối tác vận chuyển, giao hàng', isDefault: false },
      { id: 'DOITUONGKHAC', name: 'Đối tượng khác', description: 'Các đối tượng khác', isDefault: false },
    ];

    for (const item of targetGroups) {
      await prisma.settingsData.upsert({
        where: { id_type: { id: item.id, type: 'target-group' } },
        update: { name: item.name, description: item.description, isDefault: item.isDefault },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: 'target-group',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
          metadata: {},
        },
      });
    }
    console.log(`  ✓ Created ${targetGroups.length} target groups`);

    // 4. Seed Payment Methods (Phương thức thanh toán)
    console.log('  → Seeding payment methods...');
    const paymentMethods = [
      { id: 'PM-001', name: 'Tiền mặt', description: 'Thanh toán bằng tiền mặt', isDefault: true, metadata: { icon: 'banknote' } },
      { id: 'PM-002', name: 'Chuyển khoản', description: 'Chuyển khoản ngân hàng', isDefault: false, metadata: { icon: 'building' } },
      { id: 'PM-003', name: 'Ví điện tử', description: 'MoMo, ZaloPay, VNPay...', isDefault: false, metadata: { icon: 'wallet' } },
      { id: 'PM-004', name: 'Thẻ tín dụng', description: 'Quẹt thẻ VISA, Mastercard...', isDefault: false, metadata: { icon: 'credit-card' } },
      { id: 'PM-005', name: 'COD', description: 'Thu tiền khi giao hàng', isDefault: false, metadata: { icon: 'truck' } },
      { id: 'PM-006', name: 'Trả góp', description: 'Thanh toán trả góp qua ngân hàng', isDefault: false, metadata: { icon: 'calendar' } },
    ];

    for (const item of paymentMethods) {
      await prisma.settingsData.upsert({
        where: { id_type: { id: item.id, type: 'payment-method' } },
        update: { name: item.name, description: item.description, isDefault: item.isDefault, metadata: item.metadata },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: 'payment-method',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
          metadata: item.metadata,
        },
      });
    }
    console.log(`  ✓ Created ${paymentMethods.length} payment methods`);

    // 5. Seed Cash Accounts (Tài khoản quỹ)
    console.log('  → Seeding cash accounts...');
    const cashAccounts = [
      { id: 'CA-001', name: 'Quỹ tiền mặt', description: 'Quỹ tiền mặt tại cửa hàng', isDefault: true, metadata: { accountNumber: '', bankName: '', balance: 0 } },
      { id: 'CA-002', name: 'Ngân hàng VCB', description: 'Tài khoản Vietcombank', isDefault: false, metadata: { accountNumber: '0001000xxxxx', bankName: 'Vietcombank', balance: 0 } },
      { id: 'CA-003', name: 'Ngân hàng TCB', description: 'Tài khoản Techcombank', isDefault: false, metadata: { accountNumber: '19035xxxxx', bankName: 'Techcombank', balance: 0 } },
      { id: 'CA-004', name: 'Ngân hàng MB', description: 'Tài khoản MB Bank', isDefault: false, metadata: { accountNumber: '0013xxxxx', bankName: 'MB Bank', balance: 0 } },
      { id: 'CA-005', name: 'Ví MoMo', description: 'Ví điện tử MoMo', isDefault: false, metadata: { accountNumber: '0987654321', bankName: 'MoMo', balance: 0 } },
    ];

    for (const item of cashAccounts) {
      await prisma.settingsData.upsert({
        where: { id_type: { id: item.id, type: 'cash-account' } },
        update: { name: item.name, description: item.description, isDefault: item.isDefault, metadata: item.metadata },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: 'cash-account',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
          metadata: item.metadata,
        },
      });
    }
    console.log(`  ✓ Created ${cashAccounts.length} cash accounts`);

    console.log('✅ Payment settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding payment settings:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedPaymentSettings()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
