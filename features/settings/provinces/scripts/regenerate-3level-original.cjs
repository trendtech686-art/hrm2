/**
 * Re-generate 3-level wards data with ORIGINAL 63 provinces (not mapped to 34)
 * 
 * Run: node features/settings/provinces/scripts/regenerate-3level-original.cjs
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE_3_LEVEL = path.join(__dirname, '../../px/file1.xls');
const OUTPUT_DIR = path.join(__dirname, '..');
const OUTPUT_PROVINCES_3LEVEL = path.join(OUTPUT_DIR, 'provinces-3level-data.ts');
const OUTPUT_DISTRICTS_3LEVEL = path.join(OUTPUT_DIR, 'districts-3level-data.ts');
const OUTPUT_WARDS_3LEVEL = path.join(OUTPUT_DIR, 'wards-3level-data.ts');

console.log('🚀 Re-generating 3-level data with original 63 provinces...\n');

// Read file1.xls
console.log('📥 Reading file1.xls...');
const wb = XLSX.readFile(FILE_3_LEVEL);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);
console.log(`✅ Found ${data.length} records\n`);

// Extract 63 provinces (original)
console.log('📊 Extracting 63 original provinces...');
const provinceMap = new Map();

data.forEach(row => {
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const provinceName = String(row['Tỉnh Thành Phố']).trim();
  
  if (!provinceMap.has(provinceId)) {
    provinceMap.set(provinceId, provinceName);
  }
});

const provinces3Level = Array.from(provinceMap.entries())
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([id, name]) => ({
    systemId: `P3_${id}`,
    id,
    name,
  }));

console.log(`✅ Extracted ${provinces3Level.length} provinces (should be 63)`);
provinces3Level.slice(0, 5).forEach(p => console.log(`   ${p.id}: ${p.name}`));

// Extract districts
console.log('\n📊 Extracting districts...');
const districtMap = new Map();

data.forEach(row => {
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const districtCode = String(row['Mã QH']).trim();
  const districtName = String(row['Quận Huyện']).trim();
  
  const districtId = parseInt(provinceId + districtCode, 10);
  
  if (!districtMap.has(districtId)) {
    districtMap.set(districtId, {
      systemId: `D3_${districtId}`,
      id: districtId,
      name: districtName,
      provinceId,
    });
  }
});

const districts3Level = Array.from(districtMap.values()).sort((a, b) => a.id - b.id);
console.log(`✅ Extracted ${districts3Level.length} districts`);

// Extract wards
console.log('\n📊 Extracting wards...');
const wards3Level = data.map(row => {
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const provinceName = String(row['Tỉnh Thành Phố']).trim();
  const districtCode = String(row['Mã QH']).trim();
  const districtName = String(row['Quận Huyện']).trim();
  const wardId = String(row['Mã PX']).trim();
  const wardName = String(row['Phường Xã']).trim();
  
  const districtId = parseInt(provinceId + districtCode, 10);
  
  return {
    systemId: `W3_${wardId}`,
    id: wardId,
    name: wardName,
    provinceId,
    provinceName,
    districtId,
    districtName,
    level: 3,
  };
});

console.log(`✅ Extracted ${wards3Level.length} wards`);

// Generate provinces-3level-data.ts
console.log('\n📝 Generating provinces-3level-data.ts...');
const provincesContent = `/**
 * 63 Original Provinces (3-level administrative structure)
 * Auto-generated from file1.xls
 * Date: ${new Date().toISOString()}
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export interface Province3Level {
  systemId: SystemId;
  id: BusinessId;
  name: string;
}

const PROVINCE_3LEVEL_AUDIT_DATE = '2024-01-15T00:00:00Z';

const rawData = ${JSON.stringify(provinces3Level, null, 2)} as const;

export const PROVINCES_3LEVEL_DATA: Province3Level[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  id: asBusinessId(item.id),
  ...buildSeedAuditFields({ createdAt: PROVINCE_3LEVEL_AUDIT_DATE }),
}));
`;

fs.writeFileSync(OUTPUT_PROVINCES_3LEVEL, provincesContent, 'utf8');
console.log(`✅ Generated provinces-3level-data.ts (${provinces3Level.length} provinces)`);

// Generate districts-3level-data.ts
console.log('\n📝 Generating districts-3level-data.ts...');
const districtsContent = `/**
 * Districts for 3-level administrative structure (63 provinces)
 * Auto-generated from file1.xls
 * Date: ${new Date().toISOString()}
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export interface District3Level {
  systemId: SystemId;
  id: number;
  name: string;
  provinceId: BusinessId;
}

const DISTRICT_3LEVEL_AUDIT_DATE = '2024-01-16T00:00:00Z';

const rawData = ${JSON.stringify(districts3Level, null, 2)} as const;

export const DISTRICTS_3LEVEL_DATA: District3Level[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  provinceId: asBusinessId(item.provinceId),
  ...buildSeedAuditFields({ createdAt: DISTRICT_3LEVEL_AUDIT_DATE }),
}));
`;

fs.writeFileSync(OUTPUT_DISTRICTS_3LEVEL, districtsContent, 'utf8');
console.log(`✅ Generated districts-3level-data.ts (${districts3Level.length} districts)`);

// Generate wards-3level-data.ts
console.log('\n📝 Generating wards-3level-data.ts...');
const wardsContent = `/**
 * Wards for 3-level administrative structure (63 provinces)
 * Auto-generated from file1.xls
 * Date: ${new Date().toISOString()}
 * Total: ${wards3Level.length} wards
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export type Ward3Level = {
  systemId: SystemId;
  id: string;
  name: string;
  provinceId: BusinessId;
  provinceName: string;
  districtId: number;
  districtName: string;
  level: 3;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

type Ward3LevelSeed = {
  systemId: string;
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
  districtId: number;
  districtName: string;
  level: 3;
};

const WARD_3LEVEL_AUDIT_DATE = '2024-01-19T00:00:00Z';

const rawData: Ward3LevelSeed[] = ${JSON.stringify(wards3Level, null, 2)};

export const WARDS_3LEVEL_DATA: Ward3Level[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  provinceId: asBusinessId(item.provinceId),
  ...buildSeedAuditFields({ createdAt: WARD_3LEVEL_AUDIT_DATE }),
}));
`;

fs.writeFileSync(OUTPUT_WARDS_3LEVEL, wardsContent, 'utf8');
console.log(`✅ Generated wards-3level-data.ts (${wards3Level.length} wards)`);

console.log('\n🎉 Done! Generated:');
console.log(`   - provinces-3level-data.ts: ${provinces3Level.length} provinces`);
console.log(`   - districts-3level-data.ts: ${districts3Level.length} districts`);
console.log(`   - wards-3level-data.ts: ${wards3Level.length} wards`);
