/**
 * DEV SEED - Master seed file for development
 * Runs all essential seeds in correct order
 * delete all : npx prisma migrate reset --force

 * Usage: npx tsx prisma/seeds/seed-dev.ts
 * 
 * This seeds:
 * 1. Users & Employees (required for authentication)
 * 2. Branches (SĐT từ DB; 1 chi nhánh mặc định)
 * 3. Store info (từ chi nhánh + user — không dùng chuỗi mẫu HRM/company.com trong file)
 * 4. Taxes
 * 5. Administrative Units (Provinces, Districts, Wards)
 * 6. All Settings (inventory, pricing, payment, tasks, etc.)
 * 
 * NOTE: This is for DEV only. Production should use migrations.
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Individual seed functions
import { seedAllSettings } from './seed-all-settings';
import { seedAdminUnits } from './seed-admin-units-v2';
import { seedUsers } from './seed-users';
import { seedStoreInfo } from './seed-store-info';
import { alignPrimaryBranchNameWithStore, inferPrimaryBranchForDevSeed } from './lib/read-db-settings';

/** Chi nhánh mặc định: SĐT lấy từ nhân viên; không còn địa chỉ mẫu HN / HCM / ĐN trong code. */
async function seedBranches() {
  console.log('🏢 Seeding Branches (gốc từ dữ liệu user / nhân viên trong DB)...');
  const row = await inferPrimaryBranchForDevSeed(prisma);
  await prisma.branch.upsert({
    where: { id: row.id },
    update: {},
    create: {
      systemId: crypto.randomUUID(),
      id: row.id,
      name: row.name,
      address: row.address || null,
      phone: row.phone || null,
      isDefault: row.isDefault,
    },
  });
  console.log(`   ✓ ${row.id} — ${row.name}${row.phone ? ` — ${row.phone}` : ''}`);
  console.log('✅ Branches seeded!');
}

async function seedTaxes() {
  console.log('🧾 Seeding Taxes...');
  
  const taxes = [
    { systemId: crypto.randomUUID(), id: 'VAT0', name: 'VAT 0%', rate: 0, description: 'Thuế GTGT 0%', isDefaultSale: false, isDefaultPurchase: false },
    { systemId: crypto.randomUUID(), id: 'VAT5', name: 'VAT 5%', rate: 5, description: 'Thuế GTGT 5%', isDefaultSale: false, isDefaultPurchase: false },
    { systemId: crypto.randomUUID(), id: 'VAT8', name: 'VAT 8%', rate: 8, description: 'Thuế GTGT 8%', isDefaultSale: false, isDefaultPurchase: false },
    { systemId: crypto.randomUUID(), id: 'VAT10', name: 'VAT 10%', rate: 10, description: 'Thuế GTGT 10%', isDefaultSale: true, isDefaultPurchase: true },
  ];

  for (const tax of taxes) {
    await prisma.tax.upsert({
      where: { id: tax.id },
      update: { name: tax.name, rate: tax.rate, description: tax.description },
      create: {
        ...tax,
        isActive: true,
      },
    });
    console.log(`   ✓ Tax: ${tax.name}`);
  }
  console.log('✅ Taxes seeded!');
}

async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║           🚀 DEV SEED - STARTING                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // 1. Users & Employees (required first for authentication)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 1: USERS & EMPLOYEES                                │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedUsers();
    console.log('');

    // 2. Branches (trước store-info đ infer được từ chi nhánh)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 2: BRANCHES                                         │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedBranches();
    console.log('');

    // 3. Store + system keys còn thiếu (store-info = suy ra từ DB, không ghi đè bản cũ)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3: STORE & SYSTEM DEFAULTS (NẾU THIẾU)              │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedStoreInfo();
    await alignPrimaryBranchNameWithStore(prisma, 'CN001');
    console.log('');

    // 4. Taxes
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: TAXES                                            │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedTaxes();
    console.log('');

    // 5. Administrative Units (Provinces, Districts, Wards) - OPTIONAL, takes ~30s
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 5: ADMINISTRATIVE UNITS (Provinces/Districts/Wards)│');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedAdminUnits();
    console.log('');

    // 6. All Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ STEP 6: ALL SETTINGS                                     │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedAllSettings();
    console.log('');

    // Summary
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║           ✅ DEV SEED COMPLETED!                          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('🔐 Login credentials:');
    console.log(`   • nhlpkgx@gmail.com / password123 (ADMIN)`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║           ❌ DEV SEED FAILED!                             ║');
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error(error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
