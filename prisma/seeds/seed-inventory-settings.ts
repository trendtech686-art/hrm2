import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function seedInventorySettings() {
  console.log('🌱 Seeding inventory settings...');

  try {
    // 1. Seed Units (Đơn vị tính)
    console.log('  → Seeding units...');
    const units = [
      { id: 'UNIT-001', name: 'Cái', description: 'Đơn vị tính cho sản phẩm đơn lẻ', isDefault: true },
      { id: 'UNIT-002', name: 'Bộ', description: 'Bộ sản phẩm' },
      { id: 'UNIT-003', name: 'Hộp', description: 'Hộp đóng gói' },
      { id: 'UNIT-004', name: 'Thùng', description: 'Thùng carton' },
      { id: 'UNIT-005', name: 'Kg', description: 'Kilogram' },
      { id: 'UNIT-006', name: 'Gram', description: 'Gram' },
      { id: 'UNIT-007', name: 'Lít', description: 'Lít' },
      { id: 'UNIT-008', name: 'Mét', description: 'Mét' },
      { id: 'UNIT-009', name: 'M²', description: 'Mét vuông' },
      { id: 'UNIT-010', name: 'M³', description: 'Mét khối' },
    ];

    for (const unit of units) {
      await prisma.unit.upsert({
        where: { id: unit.id },
        update: {},
        create: {
          systemId: randomUUID(),
          ...unit,
          isActive: true,
        },
      });
    }
    console.log(`  ✓ Created ${units.length} units`);

    // 2. Seed Product Types (Loại sản phẩm)
    console.log('  → Seeding product types...');
    const productTypes = [
      { id: 'PTYPE-001', name: 'Hàng hóa', description: 'Sản phẩm vật lý, có tồn kho', isDefault: true },
      { id: 'PTYPE-002', name: 'Dịch vụ', description: 'Dịch vụ không có tồn kho' },
      { id: 'PTYPE-003', name: 'Digital', description: 'Sản phẩm số, download' },
      { id: 'PTYPE-004', name: 'Combo', description: 'Bộ sản phẩm kết hợp' },
      { id: 'PTYPE-005', name: 'Nguyên vật liệu', description: 'Nguyên liệu sản xuất' },
    ];

    for (const type of productTypes) {
      await prisma.settingsData.upsert({
        where: { 
          id_type: { 
            id: type.id, 
            type: 'product-type' 
          } 
        },
        update: {},
        create: {
          systemId: randomUUID(),
          id: type.id,
          name: type.name,
          type: 'product-type',
          description: type.description,
          isActive: true,
          isDefault: type.isDefault || false,
          metadata: {},
        },
      });
    }
    console.log(`  ✓ Created ${productTypes.length} product types`);

    // 3. Seed Importers (Đơn vị nhập khẩu)
    console.log('  → Seeding importers...');
    const importers = [
      { id: 'IMP-001', name: 'Việt Nam', description: 'Hàng nội địa', isDefault: true },
      { id: 'IMP-002', name: 'Trung Quốc', description: 'Nhập khẩu từ Trung Quốc' },
      { id: 'IMP-003', name: 'Hàn Quốc', description: 'Nhập khẩu từ Hàn Quốc' },
      { id: 'IMP-004', name: 'Nhật Bản', description: 'Nhập khẩu từ Nhật Bản' },
      { id: 'IMP-005', name: 'Mỹ', description: 'Nhập khẩu từ Mỹ' },
      { id: 'IMP-006', name: 'EU', description: 'Nhập khẩu từ EU' },
      { id: 'IMP-007', name: 'Thái Lan', description: 'Nhập khẩu từ Thái Lan' },
    ];

    for (const importer of importers) {
      await prisma.settingsData.upsert({
        where: { 
          id_type: { 
            id: importer.id, 
            type: 'importer' 
          } 
        },
        update: {},
        create: {
          systemId: randomUUID(),
          id: importer.id,
          name: importer.name,
          type: 'importer',
          description: importer.description,
          isActive: true,
          isDefault: importer.isDefault || false,
          metadata: {},
        },
      });
    }
    console.log(`  ✓ Created ${importers.length} importers`);

    // 4. Seed Storage Locations (Điểm lưu kho)
    console.log('  → Seeding storage locations...');
    const storageLocations = [
      { id: 'LOC-001', name: 'Kệ A1', description: 'Khu A - Kệ 1', isDefault: true },
      { id: 'LOC-002', name: 'Kệ A2', description: 'Khu A - Kệ 2' },
      { id: 'LOC-003', name: 'Kệ B1', description: 'Khu B - Kệ 1' },
      { id: 'LOC-004', name: 'Kệ B2', description: 'Khu B - Kệ 2' },
      { id: 'LOC-005', name: 'Kệ C1', description: 'Khu C - Kệ 1' },
      { id: 'LOC-006', name: 'Tầng lửng', description: 'Khu tầng lửng' },
      { id: 'LOC-007', name: 'Kho lạnh', description: 'Khu kho lạnh' },
      { id: 'LOC-008', name: 'Sàn trống', description: 'Sàn chưa phân bổ' },
    ];

    const defaultBranchForStorage =
      (await prisma.branch.findFirst({ where: { isDeleted: false, isDefault: true } })) ||
      (await prisma.branch.findFirst({ where: { isDeleted: false } }))
    if (!defaultBranchForStorage) {
      console.log('  ⚠ Skip storage / stock locations — no branch in DB (seed branch first).');
    } else {
      for (const location of storageLocations) {
        await prisma.stockLocation.upsert({
          where: { id: location.id },
          update: {
            name: location.name,
            description: location.description,
            isDefault: location.isDefault || false,
          },
          create: {
            systemId: randomUUID(),
            id: location.id,
            name: location.name,
            description: location.description,
            code: location.id,
            branchId: defaultBranchForStorage.id,
            branchSystemId: defaultBranchForStorage.systemId,
            isDefault: location.isDefault || false,
            isActive: true,
          },
        })
      }
      console.log(`  ✓ Upserted ${storageLocations.length} storage locations (stock_locations)`);
    }

    // 5. Seed Logistics Settings (Khối lượng & kích thước)
    console.log('  → Seeding logistics settings...');
    await prisma.setting.upsert({
      where: { 
        key_group: { 
          key: 'logistics', 
          group: 'inventory' 
        } 
      },
      update: {
        value: {
          physicalDefaults: {
            weight: 500,
            weightUnit: 'g',
            length: 30,
            width: 20,
            height: 10,
          },
          comboDefaults: {
            weight: 1000,
            weightUnit: 'g',
            length: 35,
            width: 25,
            height: 15,
          },
        },
      },
      create: {
        systemId: randomUUID(),
        key: 'logistics',
        group: 'inventory',
        type: 'json',
        category: 'inventory',
        description: 'Cài đặt khối lượng & kích thước mặc định',
        value: {
          physicalDefaults: {
            weight: 500,
            weightUnit: 'g',
            length: 30,
            width: 20,
            height: 10,
          },
          comboDefaults: {
            weight: 1000,
            weightUnit: 'g',
            length: 35,
            width: 25,
            height: 15,
          },
        },
      },
    });
    console.log('  ✓ Created logistics settings');

    // 6. Seed Warranty Settings (Bảo hành)
    console.log('  → Seeding warranty settings...');
    await prisma.setting.upsert({
      where: { 
        key_group: { 
          key: 'warranty', 
          group: 'inventory' 
        } 
      },
      update: {
        value: {
          defaultWarrantyMonths: 12,
        },
      },
      create: {
        systemId: randomUUID(),
        key: 'warranty',
        group: 'inventory',
        type: 'json',
        category: 'inventory',
        description: 'Cài đặt bảo hành mặc định',
        value: {
          defaultWarrantyMonths: 12,
        },
      },
    });
    console.log('  ✓ Created warranty settings');

    // 7. Seed SLA Settings (Cảnh báo tồn kho)
    console.log('  → Seeding SLA settings...');
    await prisma.setting.upsert({
      where: { 
        key_group: { 
          key: 'sla', 
          group: 'inventory' 
        } 
      },
      update: {
        value: {
          defaultReorderLevel: 10,
          defaultSafetyStock: 5,
          defaultMaxStock: 100,
          slowMovingDays: 30,
          deadStockDays: 90,
          enableEmailAlerts: false,
          alertFrequency: 'daily',
          alertEmailRecipients: [],
          showOnDashboard: true,
          dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
        },
      },
      create: {
        systemId: randomUUID(),
        key: 'sla',
        group: 'inventory',
        type: 'json',
        category: 'inventory',
        description: 'Cài đặt cảnh báo tồn kho',
        value: {
          defaultReorderLevel: 10,
          defaultSafetyStock: 5,
          defaultMaxStock: 100,
          slowMovingDays: 30,
          deadStockDays: 90,
          enableEmailAlerts: false,
          alertFrequency: 'daily',
          alertEmailRecipients: [],
          showOnDashboard: true,
          dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
        },
      },
    });
    console.log('  ✓ Created SLA settings');

    console.log('✅ Inventory settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding inventory settings:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedInventorySettings()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
