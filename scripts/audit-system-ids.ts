/**
 * Audit ALL systemId values across the database
 * Find non-UUID systemIds that should be standardized
 * 
 * Run: npx tsx scripts/audit-system-ids.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AuditResult {
  table: string;
  total: number;
  uuid: number;
  nonUuid: number;
  examples: string[];
}

async function auditTable(
  tableName: string,
  queryFn: () => Promise<Array<{ systemId: string; id?: string; name?: string }>>,
): Promise<AuditResult> {
  try {
    const records = await queryFn();
    const uuid = records.filter(r => UUID_RE.test(r.systemId));
    const nonUuid = records.filter(r => !UUID_RE.test(r.systemId));

    return {
      table: tableName,
      total: records.length,
      uuid: uuid.length,
      nonUuid: nonUuid.length,
      examples: nonUuid.slice(0, 5).map(r =>
        `${r.systemId} | id=${r.id ?? 'N/A'} | name=${(r.name ?? 'N/A').slice(0, 30)}`,
      ),
    };
  } catch {
    return { table: tableName, total: 0, uuid: 0, nonUuid: 0, examples: ['(table empty or error)'] };
  }
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 SYSTEM ID FORMAT AUDIT');
  console.log('   Expected: UUID v4 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const results: AuditResult[] = [];

  // Settings domain
  results.push(await auditTable('SettingsData', () =>
    prisma.settingsData.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Setting', () =>
    prisma.setting.findMany({ select: { systemId: true, key: true } }).then(r => r.map(s => ({ systemId: s.systemId, id: s.key, name: s.key })))));
  results.push(await auditTable('JobTitle', () =>
    prisma.jobTitle.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Department', () =>
    prisma.department.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('EmployeeTypeSetting', () =>
    prisma.employeeTypeSetting.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('PenaltyTypeSetting', () =>
    prisma.penaltyTypeSetting.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Unit', () =>
    prisma.unit.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('PricingPolicy', () =>
    prisma.pricingPolicy.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('PkgxPriceMapping', () =>
    prisma.pkgxPriceMapping.findMany({ select: { systemId: true, priceType: true } }).then(r => r.map(m => ({ systemId: m.systemId, id: m.priceType })))));
  results.push(await auditTable('PaymentMethod', () =>
    prisma.paymentMethod.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('SalesChannel', () =>
    prisma.salesChannel.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('CustomerSetting', () =>
    prisma.customerSetting.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Branch', () =>
    prisma.branch.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Tax', () =>
    prisma.tax.findMany({ select: { systemId: true, id: true, name: true } })));

  // Location data
  results.push(await auditTable('Province', () =>
    prisma.province.findMany({ select: { systemId: true, id: true, name: true } })));
  results.push(await auditTable('Ward', () =>
    prisma.ward.findMany({ take: 20, select: { systemId: true, id: true, name: true } }).then(r =>
      // Just sample + total count
      prisma.ward.count().then(count => {
        const allUuid = r.every(w => UUID_RE.test(w.systemId));
        if (!allUuid) return r;
        // Return dummy to show count
        return [{ systemId: `(sampled 20/${count}, ${allUuid ? 'all UUID' : 'MIXED'})`, id: '', name: '' }];
      }),
    )));

  // Core entities (may be empty after purge)
  results.push(await auditTable('Employee', () =>
    prisma.employee.findMany({ select: { systemId: true, id: true, fullName: true } }).then(r => r.map(e => ({ systemId: e.systemId, id: e.id, name: e.fullName })))));
  results.push(await auditTable('User', () =>
    prisma.user.findMany({ select: { systemId: true, id: true, email: true } }).then(r => r.map(u => ({ systemId: u.systemId, id: u.id, name: u.email })))));

  // Also check Setting table JSON values for embedded systemIds
  console.log('─────────────────────────────────────────────────────────');
  console.log(' TABLE AUDIT RESULTS');
  console.log('─────────────────────────────────────────────────────────');

  let totalNonUuid = 0;
  for (const r of results) {
    if (r.total === 0) {
      console.log(`  ${r.table}: (empty)`);
      continue;
    }

    const status = r.nonUuid === 0 ? '✅' : '❌';
    console.log(`  ${status} ${r.table}: ${r.total} records | ${r.uuid} UUID | ${r.nonUuid} non-UUID`);

    if (r.nonUuid > 0) {
      for (const ex of r.examples) {
        console.log(`     → ${ex}`);
      }
      totalNonUuid += r.nonUuid;
    }
  }

  // Check embedded systemIds in Setting JSON values
  console.log('');
  console.log('─────────────────────────────────────────────────────────');
  console.log(' EMBEDDED SYSTEMIDS IN SETTING JSON');
  console.log('─────────────────────────────────────────────────────────');

  const settingsWithJson = await prisma.setting.findMany({
    where: { type: 'json' },
    select: { key: true, group: true, value: true },
  });

  for (const s of settingsWithJson) {
    const json = JSON.stringify(s.value);
    // Find all systemId-like values in JSON
    const systemIdMatches = json.match(/"systemId"\s*:\s*"([^"]+)"/g);
    if (!systemIdMatches) continue;

    const ids = systemIdMatches.map(m => m.replace(/"systemId"\s*:\s*"/, '').replace(/"$/, ''));
    const nonUuidIds = ids.filter(id => !UUID_RE.test(id));

    if (nonUuidIds.length > 0) {
      console.log(`  ❌ ${s.key} (${s.group}): ${nonUuidIds.length}/${ids.length} non-UUID`);
      for (const id of nonUuidIds.slice(0, 5)) {
        console.log(`     → ${id}`);
      }
      totalNonUuid += nonUuidIds.length;
    } else if (ids.length > 0) {
      console.log(`  ✅ ${s.key} (${s.group}): ${ids.length} all UUID`);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  if (totalNonUuid === 0) {
    console.log('✅ ALL systemIds are UUID format');
  } else {
    console.log(`⚠️  FOUND ${totalNonUuid} non-UUID systemIds across the database`);
  }
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
