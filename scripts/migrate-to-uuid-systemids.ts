/**
 * Migrate ALL non-UUID systemIds to proper UUID format
 * 
 * Since business data (employees, orders, products) was purged,
 * there are NO FK references to worry about — safest time to fix.
 * 
 * Tables affected:
 * - Setting (3 records)
 * - JobTitle (36), Department (17), EmployeeTypeSetting (8)
 * - PenaltyTypeSetting (29)
 * - PricingPolicy (6), PkgxPriceMapping (5) — FK pricingPolicyId
 * - SalesChannel (9), Branch (3), Tax (4)
 * - Province (97), Ward (13,356)
 * - Setting JSON: payroll-templates (3), workflow_templates (9)
 * 
 * Run: npx tsx scripts/migrate-to-uuid-systemids.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface MigrationResult {
  table: string;
  migrated: number;
  skipped: number;
}

/**
 * Generic migration for simple tables (no FK references pointing to them)
 */
async function migrateSimpleTable(
  tableName: string,
  findFn: () => Promise<Array<{ systemId: string }>>,
  updateFn: (oldSystemId: string, newSystemId: string) => Promise<unknown>,
): Promise<MigrationResult> {
  const records = await findFn();
  let migrated = 0;
  let skipped = 0;

  for (const record of records) {
    if (UUID_RE.test(record.systemId)) {
      skipped++;
      continue;
    }
    const newId = randomUUID();
    await updateFn(record.systemId, newId);
    migrated++;
  }

  return { table: tableName, migrated, skipped };
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 MIGRATE NON-UUID SYSTEM IDS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const results: MigrationResult[] = [];

  // ===================================================================
  // 1. Setting table (own records, no FK pointing to it except by key)
  // ===================================================================
  console.log('📋 1. Setting table...');
  results.push(await migrateSimpleTable(
    'Setting',
    () => prisma.setting.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.setting.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 2. JobTitle — referenced by Employee.jobTitleId (currently empty)
  // ===================================================================
  console.log('📋 2. JobTitle...');
  results.push(await migrateSimpleTable(
    'JobTitle',
    () => prisma.jobTitle.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.jobTitle.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 3. Department — referenced by Employee.departmentId (currently empty)
  // ===================================================================
  console.log('📋 3. Department...');
  results.push(await migrateSimpleTable(
    'Department',
    () => prisma.department.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.department.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 4. EmployeeTypeSetting
  // ===================================================================
  console.log('📋 4. EmployeeTypeSetting...');
  results.push(await migrateSimpleTable(
    'EmployeeTypeSetting',
    () => prisma.employeeTypeSetting.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.employeeTypeSetting.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 5. PenaltyTypeSetting — referenced by Penalty records (currently empty)
  // ===================================================================
  console.log('📋 5. PenaltyTypeSetting...');
  results.push(await migrateSimpleTable(
    'PenaltyTypeSetting',
    () => prisma.penaltyTypeSetting.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.penaltyTypeSetting.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 6. PricingPolicy + PkgxPriceMapping (FK: PkgxMapping → PricingPolicy.systemId)
  // ===================================================================
  console.log('📋 6. PricingPolicy + PkgxPriceMapping...');
  
  // Get mapping of old → new for PricingPolicy
  const policies = await prisma.pricingPolicy.findMany({ select: { systemId: true } });
  const policyIdMap = new Map<string, string>();
  let pMigrated = 0;
  
  for (const p of policies) {
    if (UUID_RE.test(p.systemId)) continue;
    const newId = randomUUID();
    policyIdMap.set(p.systemId, newId);
    pMigrated++;
  }

  // First update PKGX mappings that reference old policy IDs
  const mappings = await prisma.pkgxPriceMapping.findMany({ 
    select: { systemId: true, pricingPolicyId: true } 
  });
  let mMigrated = 0;
  
  for (const m of mappings) {
    const updates: Record<string, string> = {};
    
    // Fix own systemId
    if (!UUID_RE.test(m.systemId)) {
      updates.systemId = randomUUID();
    }
    
    // Fix FK to PricingPolicy
    if (m.pricingPolicyId && policyIdMap.has(m.pricingPolicyId)) {
      updates.pricingPolicyId = policyIdMap.get(m.pricingPolicyId)!;
    }
    
    if (Object.keys(updates).length > 0) {
      await prisma.pkgxPriceMapping.update({ 
        where: { systemId: m.systemId }, 
        data: updates 
      });
      mMigrated++;
    }
  }

  // Now update PricingPolicy IDs
  for (const [oldId, newId] of policyIdMap) {
    await prisma.pricingPolicy.update({ where: { systemId: oldId }, data: { systemId: newId } });
  }

  results.push({ table: 'PricingPolicy', migrated: pMigrated, skipped: policies.length - pMigrated });
  results.push({ table: 'PkgxPriceMapping', migrated: mMigrated, skipped: mappings.length - mMigrated });

  // ===================================================================
  // 7. SalesChannel
  // ===================================================================
  console.log('📋 7. SalesChannel...');
  results.push(await migrateSimpleTable(
    'SalesChannel',
    () => prisma.salesChannel.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.salesChannel.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 8. Branch — referenced by Employee.branchId (currently empty)
  // ===================================================================
  console.log('📋 8. Branch...');
  results.push(await migrateSimpleTable(
    'Branch',
    () => prisma.branch.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.branch.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 9. Tax — referenced by Product.taxId (currently empty)
  // ===================================================================
  console.log('📋 9. Tax...');
  results.push(await migrateSimpleTable(
    'Tax',
    () => prisma.tax.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.tax.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  // ===================================================================
  // 10. Province + Ward (bulk migration)
  // ===================================================================
  console.log('📋 10. Province...');
  results.push(await migrateSimpleTable(
    'Province',
    () => prisma.province.findMany({ select: { systemId: true } }),
    (old, neu) => prisma.province.update({ where: { systemId: old }, data: { systemId: neu } }),
  ));

  console.log('📋 11. Ward (may take a moment)...');
  // Ward has thousands of records — batch process
  const wards = await prisma.ward.findMany({ select: { systemId: true } });
  let wardMigrated = 0;
  let wardSkipped = 0;
  
  for (const w of wards) {
    if (UUID_RE.test(w.systemId)) {
      wardSkipped++;
      continue;
    }
    await prisma.ward.update({ where: { systemId: w.systemId }, data: { systemId: randomUUID() } });
    wardMigrated++;
  }
  results.push({ table: 'Ward', migrated: wardMigrated, skipped: wardSkipped });

  // ===================================================================
  // 12. Embedded systemIds in Setting JSON values
  // ===================================================================
  console.log('📋 12. Embedded JSON systemIds...');

  // Payroll templates
  const payrollSetting = await prisma.setting.findFirst({
    where: { key: 'payroll-templates', group: 'hrm' },
  });
  if (payrollSetting) {
    const templates = payrollSetting.value as Array<Record<string, unknown>>;
    let changed = false;
    for (const t of templates) {
      if (typeof t.systemId === 'string' && !UUID_RE.test(t.systemId)) {
        t.systemId = randomUUID();
        changed = true;
      }
    }
    if (changed) {
      await prisma.setting.update({
        where: { systemId: payrollSetting.systemId },
        data: { value: templates },
      });
      console.log(`   ✅ Payroll templates: ${templates.length} embedded systemIds fixed`);
    }
  }

  // Workflow templates
  const workflowSetting = await prisma.setting.findFirst({
    where: { key: 'workflow_templates', group: 'workflow' },
  });
  if (workflowSetting) {
    const workflows = workflowSetting.value as Array<Record<string, unknown>>;
    let changed = false;
    for (const w of workflows) {
      if (typeof w.systemId === 'string' && !UUID_RE.test(w.systemId)) {
        w.systemId = randomUUID();
        changed = true;
      }
    }
    if (changed) {
      await prisma.setting.update({
        where: { systemId: workflowSetting.systemId },
        data: { value: workflows },
      });
      console.log(`   ✅ Workflow templates: ${workflows.length} embedded systemIds fixed`);
    }
  }

  // ===================================================================
  // SUMMARY
  // ===================================================================
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' MIGRATION RESULTS');
  console.log('─────────────────────────────────────────────────────────');
  
  let totalMigrated = 0;
  for (const r of results) {
    if (r.migrated > 0) {
      console.log(`  ✅ ${r.table}: ${r.migrated} migrated, ${r.skipped} already UUID`);
    } else {
      console.log(`  ⏭️  ${r.table}: all ${r.skipped} already UUID`);
    }
    totalMigrated += r.migrated;
  }
  
  console.log('');
  console.log(`  Total migrated: ${totalMigrated}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
