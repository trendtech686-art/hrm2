/**
 * Import địa danh từ file2.xlsb (File chính thức Chính phủ)
 * - Sheet "MA DIA DANH MOI": 3,321 phường MỚI (sau sáp nhập, có mã TMS)
 * - Sheet "DIA DANH CU": 10,035 phường CŨ (trước sáp nhập, để tra cứu)
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Đường dẫn file
const FILE_PATH = path.join(__dirname, '../../settings/px/file2.xlsb');
const OUTPUT_DIR = path.join(__dirname, '..');

console.log('📖 Reading file2.xlsb...\n');

// Đọc file Excel
const workbook = XLSX.readFile(FILE_PATH);

// ============================================
// SHEET 1: MA DIA DANH MOI (3,321 phường mới)
// ============================================
console.log('=== SHEET: MA DIA DANH MOI ===');
const wsNew = workbook.Sheets['MA DIA DANH MOI'];
const dataNew = XLSX.utils.sheet_to_json(wsNew);

console.log(`Total wards (new): ${dataNew.length}`);

// Extract provinces
const provincesMap = new Map();
const districtsMap = new Map();
const wardsNew = [];

dataNew.forEach((row, index) => {
  const provinceCode = String(row['Mã tỉnh (TMS)'] || '').trim();
  const provinceName = String(row['Tên tỉnh/TP mới'] || '').trim();
  const districtCode = String(row['Mã Quận huyện TMS (cũ) '] || '').trim(); // Note: space at end
  const districtName = String(row['Tên Quận huyện TMS (cũ)'] || '').trim();
  const wardCode = String(row['Mã phường/xã mới '] || '').trim(); // Note: space at end
  const wardName = String(row['Tên Phường/Xã mới'] || '').trim();

  if (!provinceCode || !wardCode || !wardName) {
    console.warn(`⚠️  Row ${index + 1}: Missing data`, { provinceCode, wardCode, wardName });
    return;
  }

  // Add province
  if (!provincesMap.has(provinceCode)) {
    provincesMap.set(provinceCode, {
      systemId: `P${provinceCode}`,
      id: provinceCode,
      name: provinceName,
    });
  }

  // Add district
  if (districtCode && districtName && !districtsMap.has(districtCode)) {
    districtsMap.set(districtCode, {
      systemId: `D${districtCode}`,
      id: parseInt(districtCode, 10),
      name: districtName,
      provinceId: provinceCode,
    });
  }

  // Add ward (NEW version with TMS code)
  wardsNew.push({
    systemId: `W_NEW_${wardCode}`,
    id: wardCode, // 8 digits: 10105001
    name: wardName,
    provinceId: provinceCode,
    districtId: districtCode ? parseInt(districtCode, 10) : null,
    districtName: districtName || null,
    level: 'new', // Đánh dấu phường MỚI (sau sáp nhập)
  });
});

console.log(`✅ Provinces: ${provincesMap.size}`);
console.log(`✅ Districts: ${districtsMap.size}`);
console.log(`✅ Wards (new): ${wardsNew.length}\n`);

// ============================================
// SHEET 2: DIA DANH CU (10,035 phường CŨ - trước sáp nhập)
// ============================================
console.log('=== SHEET: DIA DANH CU (OLD wards) ===');
const wsOld = workbook.Sheets['DIA DANH CU'];
const dataOld = XLSX.utils.sheet_to_json(wsOld);

console.log(`Total wards (old): ${dataOld.length}`);

const wardsOld = [];
let oldWardsSkipped = 0;

dataOld.forEach((row, index) => {
  const wardName = String(row['Tên xã/ phường cũ'] || '').trim();
  const districtName = String(row['Quận Huyện'] || '').trim();
  const provinceName = String(row['Tỉnh / Thành Phố mới'] || '').trim();

  if (!wardName || !districtName || !provinceName) {
    oldWardsSkipped++;
    return;
  }

  // Find matching province
  let matchedProvince = null;
  for (const [code, prov] of provincesMap) {
    if (prov.name === provinceName) {
      matchedProvince = prov;
      break;
    }
  }

  if (!matchedProvince) {
    oldWardsSkipped++;
    return;
  }

  // Find matching district
  let matchedDistrict = null;
  for (const [code, dist] of districtsMap) {
    if (dist.name === districtName && dist.provinceId === matchedProvince.id) {
      matchedDistrict = dist;
      break;
    }
  }

  // Generate unique ID for old ward (use index-based)
  const wardId = `OLD_${String(index + 1).padStart(6, '0')}`;

  wardsOld.push({
    systemId: `W_OLD_${index + 1}`,
    id: wardId,
    name: wardName,
    provinceId: matchedProvince.id,
    districtId: matchedDistrict ? matchedDistrict.id : null,
    districtName: matchedDistrict ? matchedDistrict.name : districtName,
    level: 'old', // Đánh dấu phường CŨ (trước sáp nhập)
  });
});

console.log(`✅ Wards (old): ${wardsOld.length}`);
console.log(`⚠️  Skipped: ${oldWardsSkipped} (missing data)\n`);

// ============================================
// GENERATE TYPESCRIPT FILES
// ============================================
console.log('📝 Generating TypeScript files...\n');

// 1. Provinces
const provincesArray = Array.from(provincesMap.values());
const provincesContent = `// Auto-generated from file2.xlsb - Sheet: MA DIA DANH MOI
// Total: ${provincesArray.length} provinces

export interface Province {
  systemId: string;
  id: string;
  name: string;
}

export const PROVINCES_DATA: Province[] = ${JSON.stringify(provincesArray, null, 2)};
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'provinces-data.ts'), provincesContent, 'utf8');
console.log(`✅ provinces-data.ts (${provincesArray.length} provinces)`);

// 2. Districts
const districtsArray = Array.from(districtsMap.values());
const districtsContent = `// Auto-generated from file2.xlsb - Sheet: MA DIA DANH MOI
// Total: ${districtsArray.length} districts

export interface District {
  systemId: string;
  id: number;
  name: string;
  provinceId: string;
}

export const DISTRICTS_DATA: District[] = ${JSON.stringify(districtsArray, null, 2)};
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'districts-data.ts'), districtsContent, 'utf8');
console.log(`✅ districts-data.ts (${districtsArray.length} districts)`);

// 3. Wards NEW (3,321 phường mới - Luật 2025)
const wardsNewContent = `// Auto-generated from file2.xlsb - Sheet: MA DIA DANH MOI
// Total: ${wardsNew.length} wards (AFTER merge - New Law 2025)
// ID format: 8 digits TMS code (e.g., 10105001)

export interface WardNew {
  systemId: string;
  id: string; // 8-digit TMS code
  name: string;
  provinceId: string;
  districtId: number | null;
  districtName: string | null;
  level: 'new';
}

export const WARDS_NEW_DATA: WardNew[] = ${JSON.stringify(wardsNew, null, 2)};
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'wards-new-data.ts'), wardsNewContent, 'utf8');
const sizeNew = (Buffer.byteLength(wardsNewContent, 'utf8') / 1024).toFixed(2);
console.log(`✅ wards-new-data.ts (${wardsNew.length} wards, ${sizeNew} KB)`);

// 4. Wards OLD (10,035 phường cũ - trước sáp nhập)
const wardsOldContent = `// Auto-generated from file2.xlsb - Sheet: DIA DANH CU
// Total: ${wardsOld.length} wards (BEFORE merge - OLD system)
// ID format: OLD_XXXXXX (index-based)

export interface WardOld {
  systemId: string;
  id: string; // OLD_XXXXXX
  name: string;
  provinceId: string;
  districtId: number | null;
  districtName: string | null;
  level: 'old';
}

export const WARDS_OLD_DATA: WardOld[] = ${JSON.stringify(wardsOld, null, 2)};
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'wards-old-data.ts'), wardsOldContent, 'utf8');
const sizeOld = (Buffer.byteLength(wardsOldContent, 'utf8') / 1024).toFixed(2);
console.log(`✅ wards-old-data.ts (${wardsOld.length} wards, ${sizeOld} KB)`);

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '='.repeat(50));
console.log('✅ IMPORT COMPLETE!');
console.log('='.repeat(50));
console.log(`
📊 Summary:
- Provinces: ${provincesArray.length}
- Districts: ${districtsArray.length}
- Wards (NEW - After merge): ${wardsNew.length}
- Wards (OLD - Before merge): ${wardsOld.length}
- TOTAL WARDS: ${wardsNew.length + wardsOld.length}

📁 Files generated:
- provinces-data.ts
- districts-data.ts
- wards-new-data.ts (${sizeNew} KB) ← NEW wards (Luật 2025)
- wards-old-data.ts (${sizeOld} KB) ← OLD wards (Legacy)

🎯 Usage:
- Merge both WARDS_NEW_DATA + WARDS_OLD_DATA in store
- Each ward has 'level' field: 'new' or 'old'
- User can choose from either dataset
- Ward NEW ID: 8 digits TMS (e.g., 10105001)
- Ward OLD ID: OLD_XXXXXX (e.g., OLD_000001)

`);
