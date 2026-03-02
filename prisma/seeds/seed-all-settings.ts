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

export async function seedAllSettings() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌱 SEEDING ALL SETTINGS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Inventory Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 1/8 INVENTORY SETTINGS                                   │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedInventorySettings();
    console.log('');

    // 2. Pricing Policies (IMPORTANT: Uses SettingsData, not PricingPolicy table)
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 2/8 PRICING POLICIES & PKGX MAPPINGS                     │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedPricingPolicies();
    console.log('');

    // 3. Payment Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 3/8 PAYMENT SETTINGS                                     │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedPaymentSettings();
    console.log('');

    // 4. Tasks Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 4/8 TASKS SETTINGS                                       │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedTasksSettings();
    console.log('');

    // 5. Complaints Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 5/8 COMPLAINTS SETTINGS                                  │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedComplaintsSettings();
    console.log('');

    // 6. Warranty Settings
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 6/8 WARRANTY SETTINGS                                    │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedWarrantySettings();
    console.log('');

    // 7. Workflow Templates
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 7/8 WORKFLOW TEMPLATES                                   │');
    console.log('└──────────────────────────────────────────────────────────┘');
    await seedWorkflowTemplates();
    console.log('');

    // 8. Print Templates
    console.log('┌──────────────────────────────────────────────────────────┐');
    console.log('│ 8/8 PRINT TEMPLATES                                      │');
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
