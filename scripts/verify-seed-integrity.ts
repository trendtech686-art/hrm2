/**
 * Verify seed cross-references integrity
 * Checks for:
 * 1. Payroll template componentSystemIds → salary components
 * 2. Duplicate salary components
 * 3. Wrong-type records showing as salary components
 * 4. Leave type references
 * 
 * Run: npx tsx scripts/verify-seed-integrity.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// Same type list as salary-components API route
const SALARY_COMPONENT_TYPES = [
  'salary_component', 'earning', 'deduction', 'allowance', 'contribution',
  'minimum_wage', 'base_salary',
];

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 SEED INTEGRITY VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════');
  
  let issues = 0;

  // ===================================================================
  // 1. SALARY COMPONENTS — check for duplicates and wrong types
  // ===================================================================
  console.log('\n📋 1. SALARY COMPONENTS (SettingsData)');
  console.log('─────────────────────────────────────────');
  
  const allComponents = await prisma.settingsData.findMany({
    where: { type: { in: SALARY_COMPONENT_TYPES }, isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });
  
  console.log(`   Total records matching salary component types: ${allComponents.length}`);
  console.log('');

  // Group by type
  const byType: Record<string, typeof allComponents> = {};
  for (const c of allComponents) {
    (byType[c.type] ??= []).push(c);
  }
  for (const [type, items] of Object.entries(byType)) {
    console.log(`   Type "${type}" (${items.length}):`);
    for (const item of items) {
      const meta = item.metadata as Record<string, unknown> | null;
      const category = meta?.category ?? 'N/A';
      console.log(`     - ${item.id} | ${item.name} | systemId: ${item.systemId} | category: ${category}`);
    }
  }

  // Check for name duplicates
  console.log('\n   🔎 Checking for duplicate names...');
  const nameCount: Record<string, { count: number; ids: string[] }> = {};
  for (const c of allComponents) {
    const entry = (nameCount[c.name] ??= { count: 0, ids: [] });
    entry.count++;
    entry.ids.push(`${c.id} (${c.type})`);
  }
  const dupes = Object.entries(nameCount).filter(([, v]) => v.count > 1);
  if (dupes.length > 0) {
    console.log(`   ⚠️  Found ${dupes.length} duplicate names:`);
    for (const [name, info] of dupes) {
      console.log(`     "${name}": ${info.ids.join(' vs ')}`);
      issues++;
    }
  } else {
    console.log('   ✅ No duplicate names');
  }

  // Check for non-component types that might confuse UI
  const weirdTypes = allComponents.filter(c => 
    ['minimum_wage', 'base_salary', 'insurance_rate', 'tax_deduction', 'tax_bracket', 'holiday'].includes(c.type)
  );
  if (weirdTypes.length > 0) {
    console.log(`\n   ⚠️  ${weirdTypes.length} records with non-component types (may show in salary UI):`);
    for (const c of weirdTypes) {
      console.log(`     - ${c.id} | ${c.name} | type: ${c.type}`);
      issues++;
    }
  }

  // ===================================================================
  // 2. PAYROLL TEMPLATES — verify componentSystemIds
  // ===================================================================
  console.log('\n📋 2. PAYROLL TEMPLATES');
  console.log('─────────────────────────────────────────');
  
  const setting = await prisma.setting.findFirst({
    where: { key: 'payroll-templates', group: 'hrm' },
  });
  
  if (!setting) {
    console.log('   ❌ No payroll-templates setting found!');
    issues++;
  } else {
    const templates = setting.value as Array<{
      systemId: string; id: string; name: string; componentSystemIds: string[];
    }>;
    
    const componentSystemIds = new Set(allComponents.map(c => c.systemId));
    
    for (const t of templates) {
      const valid = t.componentSystemIds.filter(id => componentSystemIds.has(id));
      const invalid = t.componentSystemIds.filter(id => !componentSystemIds.has(id));
      
      if (invalid.length > 0) {
        console.log(`   ❌ ${t.id} (${t.name}): ${invalid.length}/${t.componentSystemIds.length} INVALID refs`);
        console.log(`      Invalid: [${invalid.join(', ')}]`);
        issues++;
      } else {
        console.log(`   ✅ ${t.id} (${t.name}): ${valid.length}/${t.componentSystemIds.length} components OK`);
      }
    }
  }

  // ===================================================================
  // 3. LEAVE TYPES — check in employee-settings JSON
  // ===================================================================
  console.log('\n📋 3. LEAVE TYPES (in employee-settings)');
  console.log('─────────────────────────────────────────');
  
  const empSettings = await prisma.setting.findFirst({
    where: { key: 'employee-settings', group: 'hrm' },
  });
  
  if (!empSettings) {
    console.log('   ❌ No employee-settings found!');
    issues++;
  } else {
    const val = empSettings.value as Record<string, unknown>;
    const leaveTypes = val.leaveTypes as Array<{ systemId?: string; id?: string; name: string }> | undefined;
    
    if (!leaveTypes || leaveTypes.length === 0) {
      console.log('   ⚠️  No leave types in employee-settings');
    } else {
      console.log(`   Found ${leaveTypes.length} leave types:`);
      for (const lt of leaveTypes) {
        console.log(`     - ${lt.name} (systemId: ${lt.systemId ?? 'N/A'})`);
      }
      console.log('   ✅ Leave types are self-contained JSON — no cross-refs');
    }
  }

  // ===================================================================
  // 4. PENALTY TYPES — check for conflicts
  // ===================================================================
  console.log('\n📋 4. PENALTY TYPES');
  console.log('─────────────────────────────────────────');
  
  const penalties = await prisma.penaltyTypeSetting.findMany({
    where: { isDeleted: false },
    orderBy: { sortOrder: 'asc' },
  });
  console.log(`   Total: ${penalties.length} penalty types`);
  
  // Check for duplicate IDs
  const penaltyIdCount: Record<string, number> = {};
  for (const p of penalties) {
    penaltyIdCount[p.id] = (penaltyIdCount[p.id] ?? 0) + 1;
  }
  const dupPenalties = Object.entries(penaltyIdCount).filter(([, c]) => c > 1);
  if (dupPenalties.length > 0) {
    console.log(`   ⚠️  Duplicate penalty IDs: ${dupPenalties.map(([id, c]) => `${id}(${c}x)`).join(', ')}`);
    issues++;
  } else {
    console.log('   ✅ No duplicate penalty IDs');
  }

  // ===================================================================
  // 5. OTHER SETTINGS — check for cross-refs
  // ===================================================================
  console.log('\n📋 5. OTHER SETTINGS WITH SYSTEMID REFS');
  console.log('─────────────────────────────────────────');
  
  const allSettings = await prisma.setting.findMany({
    where: { group: 'hrm' },
    select: { key: true, group: true, systemId: true },
  });
  console.log(`   HRM settings found: ${allSettings.map(s => s.key).join(', ')}`);

  // ===================================================================
  // 6. PRICING POLICIES → PKGX MAPPINGS
  // ===================================================================
  console.log('\n📋 6. PRICING POLICIES ↔ PKGX MAPPINGS');
  console.log('─────────────────────────────────────────');
  
  const policies = await prisma.pricingPolicy.findMany({ select: { systemId: true, id: true, name: true } });
  const mappings = await prisma.pkgxPriceMapping.findMany({ select: { systemId: true, priceType: true, pricingPolicyId: true } });
  
  if (policies.length === 0 && mappings.length === 0) {
    console.log('   (No pricing data seeded — skipping)');
  } else {
    const policySystemIds = new Set(policies.map(p => p.systemId));
    for (const m of mappings) {
      const policyId = m.pricingPolicyId ?? '';
      if (!policySystemIds.has(policyId)) {
        console.log(`   ❌ PKGX mapping ${m.priceType} → ${policyId} (NOT FOUND)`);
        issues++;
      } else {
        console.log(`   ✅ PKGX mapping ${m.priceType} → ${policyId} OK`);
      }
    }
    if (mappings.length === 0) console.log('   (No PKGX mappings)');
  }

  // ===================================================================
  // SUMMARY
  // ===================================================================
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  if (issues === 0) {
    console.log('✅ ALL CHECKS PASSED — No integrity issues found');
  } else {
    console.log(`⚠️  FOUND ${issues} ISSUE(S) — See details above`);
  }
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
