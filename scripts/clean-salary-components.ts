/**
 * Clean up duplicate / wrong-type salary component records in SettingsData
 * 
 * Issues:
 * 1. Old ALLOWANCE_* records (type: allowance) duplicate with COMP_* (type: earning) 
 * 2. minimum_wage, base_salary records show in salary components UI but shouldn't
 * 3. insurance_rate, tax_deduction, tax_bracket, holiday records if they exist
 * 
 * Run: npx tsx scripts/clean-salary-components.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧹 CLEAN SALARY COMPONENT DATA');
  console.log('═══════════════════════════════════════════════════════════');

  // 1. Remove duplicate ALLOWANCE_* records (keep COMP_* versions)
  console.log('\n📋 Step 1: Remove old ALLOWANCE_* duplicates...');
  const oldAllowances = ['ALLOWANCE_MEAL', 'ALLOWANCE_TRANSPORT', 'ALLOWANCE_PHONE',
    'ALLOWANCE_HOUSING', 'ALLOWANCE_POSITION', 'ALLOWANCE_SENIORITY'];
  
  const deleted1 = await prisma.settingsData.deleteMany({
    where: { id: { in: oldAllowances }, type: 'allowance' },
  });
  console.log(`   ✅ Deleted ${deleted1.count} old allowance records`);

  // 2. Move minimum_wage and base_salary to non-component types
  // These are reference data, not salary components for payroll templates
  console.log('\n📋 Step 2: Reclassify minimum_wage/base_salary as reference data...');
  const refTypes = ['minimum_wage', 'base_salary'];
  
  const refRecords = await prisma.settingsData.findMany({
    where: { type: { in: refTypes } },
    select: { systemId: true, id: true, name: true, type: true },
  });
  
  for (const rec of refRecords) {
    // Change type to 'salary_reference' so they don't show in salary components API
    await prisma.settingsData.update({
      where: { systemId: rec.systemId },
      data: { type: `ref_${rec.type}` }, // ref_minimum_wage, ref_base_salary
    });
    console.log(`   ✅ Reclassified: ${rec.id} (${rec.type} → ref_${rec.type})`);
  }

  // 3. Also clean any insurance_rate, tax_deduction, tax_bracket, holiday records
  console.log('\n📋 Step 3: Check for other non-component types...');
  const otherTypes = ['insurance_rate', 'tax_deduction', 'tax_bracket', 'holiday'];
  const others = await prisma.settingsData.findMany({
    where: { type: { in: otherTypes } },
    select: { systemId: true, id: true, name: true, type: true },
  });
  
  if (others.length > 0) {
    for (const rec of others) {
      await prisma.settingsData.update({
        where: { systemId: rec.systemId },
        data: { type: `ref_${rec.type}` },
      });
      console.log(`   ✅ Reclassified: ${rec.id} (${rec.type} → ref_${rec.type})`);
    }
  } else {
    console.log('   (No records found — OK)');
  }

  // 4. Verify final state
  console.log('\n📋 Step 4: Verify...');
  const SALARY_COMPONENT_TYPES = [
    'salary_component', 'earning', 'deduction', 'allowance', 'contribution',
    'minimum_wage', 'base_salary',
  ];
  
  const remaining = await prisma.settingsData.findMany({
    where: { type: { in: SALARY_COMPONENT_TYPES }, isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });
  
  console.log(`   Salary components visible in API: ${remaining.length}`);
  
  // Check no duplicates
  const nameSet = new Set<string>();
  let dupCount = 0;
  for (const r of remaining) {
    if (nameSet.has(r.name)) {
      console.log(`   ⚠️  Still duplicate: ${r.name} (${r.id})`);
      dupCount++;
    }
    nameSet.add(r.name);
  }
  
  if (dupCount === 0) {
    console.log('   ✅ No duplicate names');
  }

  // List by category
  const byCategory: Record<string, string[]> = {};
  for (const r of remaining) {
    const meta = r.metadata as Record<string, unknown> | null;
    const cat = (meta?.category as string) ?? r.type;
    (byCategory[cat] ??= []).push(r.name);
  }
  console.log('');
  for (const [cat, names] of Object.entries(byCategory)) {
    console.log(`   ${cat}: ${names.join(', ')}`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ CLEANUP COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
