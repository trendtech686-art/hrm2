/**
 * Master Settings Seed
 * Runs all settings seed files in order
 * 
 * Run: npx tsx prisma/seeds/seed-all-settings.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Import individual seed functions
import { seedPaymentSettings } from './seed-payment-settings';
import { seedTasksSettings } from './seed-tasks-settings';
import { seedComplaintsSettings } from './seed-complaints-settings';
import { seedWarrantySettings } from './seed-warranty-settings';
import { seedWorkflowTemplates } from './seed-workflow-templates';
import { seedPrintTemplates } from './seed-print-templates';
import { seedInventorySettings } from './seed-inventory-settings';
import { seedPricingPolicies } from './seed-pricing-policies';
import { seedRoles } from './seed-roles';
import { seedStoreInfo } from './seed-store-info';
import { seedCustomerSettings } from './seed-customer-settings';
import { seedEmployeeSettings } from './seed-employee-settings';
import { seedSalesSettings } from './seed-sales-settings';

export async function seedAllSettings() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌱 SEEDING ALL SETTINGS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Roles (must be early — sidebar depends on this)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 1/13 ROLE SETTINGS                                       │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedRoles();
    console.log('');

    // 2. Store Info & System Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 2/13 STORE INFO & SYSTEM SETTINGS                        │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedStoreInfo();
    console.log('');

    // 3. Employee Settings (departments, job titles, leave types, etc.)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 3/13 EMPLOYEE SETTINGS                                   │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedEmployeeSettings();
    console.log('');

    // 4. Customer Settings (types, groups, sources, etc.)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 4/13 CUSTOMER SETTINGS                                   │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedCustomerSettings();
    console.log('');

    // 5. Sales Settings (channels, management settings)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 5/13 SALES SETTINGS                                      │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedSalesSettings();
    console.log('');

    // 6. Inventory Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 6/13 INVENTORY SETTINGS                                  │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedInventorySettings();
    console.log('');

    // 7. Pricing Policies
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 7/13 PRICING POLICIES & PKGX MAPPINGS                    │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedPricingPolicies();
    console.log('');

    // 8. Payment Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 8/13 PAYMENT SETTINGS                                    │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedPaymentSettings();
    console.log('');

    // 9. Tasks Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 9/13 TASKS SETTINGS                                      │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedTasksSettings();
    console.log('');

    // 10. Complaints Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 10/13 COMPLAINTS SETTINGS                                │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedComplaintsSettings();
    console.log('');

    // 11. Warranty Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 11/13 WARRANTY SETTINGS                                  │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedWarrantySettings();
    console.log('');

    // 12. Workflow Templates
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 12/13 WORKFLOW TEMPLATES                                 │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedWorkflowTemplates();
    console.log('');

    // 13. Print Templates
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 13/13 PRINT TEMPLATES                                    │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedPrintTemplates();
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ALL SETTINGS SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ SETTINGS SEED FAILED');
    console.error('═══════════════════════════════════════════════════════════');
    console.error(error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedAllSettings()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
