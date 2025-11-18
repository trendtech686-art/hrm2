/**
 * Import Dual-Level Administrative Data
 * 
 * Import 2 files:
 * 1. Danh_muc_hanh_chinh_2cap.xlsx - 2 cấp (Tỉnh → Phường)
 * 2. Danh_muc_hanh_chinh_3cap.xls - 3 cấp (Tỉnh → Quận → Phường)
 * 
 * Generate:
 * - provinces-data.ts (34 provinces)
 * - wards-2level-data.ts (3,321 wards - 2 cấp)
 * - wards-3level-data.ts (10,035 wards - 3 cấp with districts)
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// File paths
const FILE_2_LEVEL = path.join(__dirname, '../../settings/px/Danh_muc_hanh_chinh_2cap.xlsx');
const FILE_3_LEVEL = path.join(__dirname, '../../settings/px/Danh_muc_hanh_chinh_3cap.xls');

const OUTPUT_DIR = path.join(__dirname, '..');
const OUTPUT_PROVINCES = path.join(OUTPUT_DIR, 'provinces-data.ts');
const OUTPUT_DISTRICTS = path.join(OUTPUT_DIR, 'districts-data.ts');
const OUTPUT_WARDS_2LEVEL = path.join(OUTPUT_DIR, 'wards-2level-data.ts');
const OUTPUT_WARDS_3LEVEL = path.join(OUTPUT_DIR, 'wards-3level-data.ts');

console.log('🚀 Starting dual-level import...\n');

// ========================================
// 1. Import 2-level data
// ========================================
console.log('📥 Reading 2-level file...');
const wb2 = XLSX.readFile(FILE_2_LEVEL);
const ws2 = wb2.Sheets[wb2.SheetNames[0]];
const data2Level = XLSX.utils.sheet_to_json(ws2);

console.log(`✅ Found ${data2Level.length} records (2-level)\n`);
console.log('Sample 2-level:', data2Level[0]);

// ========================================
// 2. Import 3-level data
// ========================================
console.log('\n📥 Reading 3-level file...');
const wb3 = XLSX.readFile(FILE_3_LEVEL);
const ws3 = wb3.Sheets[wb3.SheetNames[0]];
const data3Level = XLSX.utils.sheet_to_json(ws3);

console.log(`✅ Found ${data3Level.length} records (3-level)\n`);
console.log('Sample 3-level:', data3Level[0]);

// ========================================
// 3. Extract Provinces (unique)
// ========================================
console.log('\n📊 Extracting provinces...');
const provinceMap = new Map();

// From 3-level data (more reliable)
data3Level.forEach(row => {
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const provinceName = row['Tỉnh Thành Phố'];
  
  if (!provinceMap.has(provinceId)) {
    provinceMap.set(provinceId, provinceName);
  }
});

const provinces = Array.from(provinceMap.entries()).map(([id, name], index) => ({
  systemId: `T${String(index + 1).padStart(8, '0')}`,
  id,
  name,
}));

console.log(`✅ Extracted ${provinces.length} provinces`);

// ========================================
// 4. Extract Districts (from 3-level only)
// ========================================
console.log('\n📊 Extracting districts...');
const districtMap = new Map();

data3Level.forEach(row => {
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const districtId = String(row['Mã QH']).trim();
  const districtName = row['Quận Huyện'];
  
  const key = `${provinceId}-${districtId}`;
  
  if (!districtMap.has(key)) {
    districtMap.set(key, {
      systemId: `D${provinceId}${districtId}`,
      id: parseInt(provinceId + districtId, 10),
      name: districtName,
      provinceId,
    });
  }
});

const districts = Array.from(districtMap.values());
console.log(`✅ Extracted ${districts.length} districts`);

// ========================================
// 5. Process 2-level wards (NO district)
// ========================================
console.log('\n📊 Processing 2-level wards...');
const wards2Level = data2Level.map(row => {
  const wardId = String(row['Mã']).trim().padStart(5, '0');
  const wardName = row['Tên'];
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const provinceName = row['Tỉnh / Thành Phố'];
  
  return {
    systemId: `W2_${wardId}`,
    id: wardId,
    name: wardName,
    provinceId,
    provinceName,
    level: 2,
  };
});

console.log(`✅ Processed ${wards2Level.length} wards (2-level)`);

// ========================================
// 6. Process 3-level wards (WITH district)
// ========================================
console.log('\n📊 Processing 3-level wards...');
const wards3Level = data3Level.map(row => {
  const wardId = String(row['Mã PX']).trim().padStart(5, '0');
  const wardName = row['Phường Xã'];
  const provinceId = String(row['Mã TP']).trim().padStart(2, '0');
  const provinceName = row['Tỉnh Thành Phố'];
  const districtId = String(row['Mã QH']).trim();
  const districtName = row['Quận Huyện'];
  
  return {
    systemId: `W3_${wardId}`,
    id: wardId,
    name: wardName,
    provinceId,
    provinceName,
    districtId: parseInt(provinceId + districtId, 10),
    districtName,
    level: 3,
  };
});

console.log(`✅ Processed ${wards3Level.length} wards (3-level)`);

// ========================================
// 7. Generate TypeScript files
// ========================================
console.log('\n📝 Generating TypeScript files...');

// Provinces
const provincesContent = `/**
 * Auto-generated from dual-level import
 * Date: ${new Date().toISOString()}
 * Source: Danh_muc_hanh_chinh_3cap.xls
 */

export type Province = {
  systemId: string;
  id: string;
  name: string;
};

export const PROVINCES_DATA: Province[] = ${JSON.stringify(provinces, null, 2)};
`;

fs.writeFileSync(OUTPUT_PROVINCES, provincesContent, 'utf-8');
console.log(`✅ Generated: provinces-data.ts (${(fs.statSync(OUTPUT_PROVINCES).size / 1024).toFixed(2)} KB)`);

// Districts
const districtsContent = `/**
 * Auto-generated from 3-level import
 * Date: ${new Date().toISOString()}
 * Total: ${districts.length} districts
 */

export type District = {
  systemId: string;
  id: number;
  name: string;
  provinceId: string;
};

export const DISTRICTS_DATA: District[] = ${JSON.stringify(districts, null, 2)};
`;

fs.writeFileSync(OUTPUT_DISTRICTS, districtsContent, 'utf-8');
console.log(`✅ Generated: districts-data.ts (${(fs.statSync(OUTPUT_DISTRICTS).size / 1024).toFixed(2)} KB)`);

// 2-level wards
const wards2Content = `/**
 * Auto-generated from 2-level import
 * Date: ${new Date().toISOString()}
 * Total: ${wards2Level.length} wards (2 cấp - Tỉnh → Phường)
 * Note: NO districtId (theo luật mới 2025)
 */

export type Ward2Level = {
  systemId: string;
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
  level: 2;
};

export const WARDS_2LEVEL_DATA: Ward2Level[] = ${JSON.stringify(wards2Level, null, 2)};
`;

fs.writeFileSync(OUTPUT_WARDS_2LEVEL, wards2Content, 'utf-8');
console.log(`✅ Generated: wards-2level-data.ts (${(fs.statSync(OUTPUT_WARDS_2LEVEL).size / 1024).toFixed(2)} KB)`);

// 3-level wards
const wards3Content = `/**
 * Auto-generated from 3-level import
 * Date: ${new Date().toISOString()}
 * Total: ${wards3Level.length} wards (3 cấp - Tỉnh → Quận → Phường)
 * Note: WITH districtId (cho API vận chuyển)
 */

export type Ward3Level = {
  systemId: string;
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
  districtId: number;
  districtName: string;
  level: 3;
};

export const WARDS_3LEVEL_DATA: Ward3Level[] = ${JSON.stringify(wards3Level, null, 2)};
`;

fs.writeFileSync(OUTPUT_WARDS_3LEVEL, wards3Content, 'utf-8');
console.log(`✅ Generated: wards-3level-data.ts (${(fs.statSync(OUTPUT_WARDS_3LEVEL).size / 1024).toFixed(2)} KB)`);

// ========================================
// 8. Summary
// ========================================
console.log('\n' + '='.repeat(60));
console.log('✅ IMPORT COMPLETE!');
console.log('='.repeat(60));
console.log(`📊 Provinces: ${provinces.length}`);
console.log(`📊 Districts: ${districts.length}`);
console.log(`📊 Wards (2-level): ${wards2Level.length}`);
console.log(`📊 Wards (3-level): ${wards3Level.length}`);
console.log(`📊 Total wards: ${wards2Level.length + wards3Level.length}`);
console.log('='.repeat(60));

console.log('\n📁 Generated files:');
console.log(`  - ${OUTPUT_PROVINCES}`);
console.log(`  - ${OUTPUT_DISTRICTS}`);
console.log(`  - ${OUTPUT_WARDS_2LEVEL}`);
console.log(`  - ${OUTPUT_WARDS_3LEVEL}`);

console.log('\n🎉 Done! Now update store.ts to use these new files.');
