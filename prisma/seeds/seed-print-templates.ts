import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DEFAULT_TEMPLATES } from '../../features/settings/printer/templates';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedPrintTemplates() {
  console.log('🌱 Seeding print templates...');

  try {
    const GROUP = 'printer';

    // Define print template entries with default content from DEFAULT_TEMPLATES
    const printTemplateEntries = [
      { type: 'order', name: 'Đơn bán hàng', paperSize: 'A4' },
      { type: 'quote', name: 'Phiếu đơn tạm tính', paperSize: 'A4' },
      { type: 'sales-return', name: 'Đơn đổi trả hàng', paperSize: 'A4' },
      { type: 'packing', name: 'Phiếu đóng gói', paperSize: 'A4' },
      { type: 'delivery', name: 'Phiếu giao hàng', paperSize: 'A4' },
      { type: 'shipping-label', name: 'Nhãn giao hàng', paperSize: 'A6' },
      { type: 'product-label', name: 'Tem phụ sản phẩm', paperSize: '50x30' },
      { type: 'purchase-order', name: 'Đơn đặt hàng nhập', paperSize: 'A4' },
      { type: 'stock-in', name: 'Phiếu nhập kho', paperSize: 'A4' },
      { type: 'stock-transfer', name: 'Phiếu chuyển kho', paperSize: 'A4' },
      { type: 'inventory-check', name: 'Phiếu kiểm kho', paperSize: 'A4' },
      { type: 'cost-adjustment', name: 'Phiếu điều chỉnh giá vốn', paperSize: 'A4' },
      { type: 'receipt', name: 'Phiếu thu', paperSize: 'A4' },
      { type: 'payment', name: 'Phiếu chi', paperSize: 'A4' },
      { type: 'warranty', name: 'Phiếu bảo hành', paperSize: 'A4' },
      { type: 'supplier-return', name: 'Phiếu trả hàng NCC', paperSize: 'A4' },
      { type: 'complaint', name: 'Phiếu khiếu nại', paperSize: 'A4' },
      { type: 'penalty', name: 'Phiếu phạt', paperSize: 'A4' },
      { type: 'payroll', name: 'Bảng lương', paperSize: 'A4' },
      { type: 'payslip', name: 'Phiếu lương', paperSize: 'A4' },
      { type: 'attendance', name: 'Bảng chấm công', paperSize: 'A4' },
    ];

    // Build templates array with content from DEFAULT_TEMPLATES
    const templates = printTemplateEntries.map((entry, index) => ({
      id: `tpl-default-${entry.type}`,
      type: entry.type,
      name: entry.name,
      content: DEFAULT_TEMPLATES[entry.type as keyof typeof DEFAULT_TEMPLATES] || '',
      paperSize: entry.paperSize,
      branchId: null,
      isActive: true,
      isDefault: true,
      updatedAt: new Date().toISOString(),
      order: index + 1,
    }));

    // Seed Print Templates as a setting
    console.log('  → Seeding print templates...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'print_templates', group: GROUP } },
      update: {
        value: templates,
        updatedAt: new Date(),
      },
      create: {
        key: 'print_templates',
        group: GROUP,
        type: 'json',
        category: 'printer',
        description: 'Print templates for various document types',
        value: templates,
      },
    });
    console.log(`  ✓ Created ${templates.length} print templates`);

    // Seed Print Settings (paper sizes, default settings)
    console.log('  → Seeding print settings...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'print_settings', group: GROUP } },
      update: {},
      create: {
        key: 'print_settings',
        group: GROUP,
        type: 'json',
        category: 'printer',
        description: 'General print settings',
        value: {
          defaultPaperSize: 'A4',
          defaultOrientation: 'portrait',
          defaultMargins: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          showPreviewBeforePrint: true,
          autoOpenPrintDialog: false,
          includeCompanyLogo: true,
          includeCompanyHeader: true,
          includeFooter: true,
          footerText: 'Cảm ơn quý khách!',
        },
      },
    });
    console.log('  ✓ Created print settings');

    // Seed Default Paper Sizes per Template Type
    console.log('  → Seeding default paper sizes...');
    await prisma.setting.upsert({
      where: { key_group: { key: 'print_default_sizes', group: GROUP } },
      update: {},
      create: {
        key: 'print_default_sizes',
        group: GROUP,
        type: 'json',
        category: 'printer',
        description: 'Default paper sizes per template type',
        value: {
          'order': 'A4',
          'quote': 'A4',
          'sales-return': 'A4',
          'packing': 'A4',
          'delivery': 'A4',
          'shipping-label': 'A6',
          'product-label': '50x30',
          'purchase-order': 'A4',
          'stock-in': 'A4',
          'stock-transfer': 'A4',
          'inventory-check': 'A4',
          'cost-adjustment': 'A4',
          'receipt': 'K80',
          'payment': 'K80',
          'warranty': 'A4',
          'supplier-return': 'A4',
          'complaint': 'A4',
          'penalty': 'A4',
          'payroll': 'A4',
          'payslip': 'A5',
          'attendance': 'A4',
        },
      },
    });
    console.log('  ✓ Created default paper sizes');

    console.log('✅ Print templates seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding print templates:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedPrintTemplates()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
