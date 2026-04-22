import 'dotenv/config';
import { PrismaClient, CashAccountType } from '../../generated/prisma/client';
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
      const typeMap: Record<string, string> = {
        'PM-001': 'cash',
        'PM-002': 'bank',
        'PM-003': 'wallet',
        'PM-004': 'card',
        'PM-005': 'cod',
        'PM-006': 'other',
      }
      await prisma.paymentMethod.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          isDefault: item.isDefault,
          isActive: true,
        },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          code: item.id,
          type: typeMap[item.id] || 'other',
          description: item.description,
          isActive: true,
          isDefault: item.isDefault,
        },
      });
    }
    console.log(`  ✓ Created ${paymentMethods.length} payment methods`);

    // 5. Seed Cash Accounts — nguồn duy nhất: bảng cash_accounts (không còn settings_data type cash-account)
    console.log('  → Seeding cash accounts (cash_accounts)...');
    const cashAccountSeed: Array<{
      id: string
      name: string
      accountType: CashAccountType
      isDefault: boolean
      bankName?: string
      bankAccountNumber?: string
    }> = [
      { id: 'CA-001', name: 'Quỹ tiền mặt', accountType: CashAccountType.CASH, isDefault: true },
      {
        id: 'CA-002',
        name: 'Ngân hàng VCB',
        accountType: CashAccountType.BANK,
        isDefault: false,
        bankName: 'Vietcombank',
        bankAccountNumber: '0001000xxxxx',
      },
      {
        id: 'CA-003',
        name: 'Ngân hàng TCB',
        accountType: CashAccountType.BANK,
        isDefault: false,
        bankName: 'Techcombank',
        bankAccountNumber: '19035xxxxx',
      },
      {
        id: 'CA-004',
        name: 'Ngân hàng MB',
        accountType: CashAccountType.BANK,
        isDefault: false,
        bankName: 'MB Bank',
        bankAccountNumber: '0013xxxxx',
      },
      {
        id: 'CA-005',
        name: 'Ví MoMo',
        accountType: CashAccountType.WALLET,
        isDefault: false,
        bankName: 'MoMo',
        bankAccountNumber: '0987654321',
      },
    ];

    for (const item of cashAccountSeed) {
      await prisma.cashAccount.upsert({
        where: { id: item.id },
        create: {
          systemId: randomUUID(),
          id: item.id,
          name: item.name,
          type: item.accountType,
          initialBalance: 0,
          balance: 0,
          isActive: true,
          isDefault: item.isDefault,
          bankName: item.bankName,
          bankAccountNumber: item.bankAccountNumber,
          accountType: item.accountType === CashAccountType.CASH ? 'cash' : item.accountType === CashAccountType.WALLET ? 'wallet' : 'bank',
        },
        update: {
          name: item.name,
          type: item.accountType,
          isActive: true,
          bankName: item.bankName ?? null,
          bankAccountNumber: item.bankAccountNumber ?? null,
          accountType: item.accountType === CashAccountType.CASH ? 'cash' : item.accountType === CashAccountType.WALLET ? 'wallet' : 'bank',
        },
      });
    }
    console.log(`  ✓ Upserted ${cashAccountSeed.length} cash accounts`);

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
