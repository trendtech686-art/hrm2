/**
 * Import Script - Ward District Mapping
 * 
 * Import 3,321 phường/xã với mapping 2-level + 3-level từ FB0CA300.xlsx
 * 
 * Run: node features/provinces/scripts/import-ward-district-mapping.js
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Đọc file Excel
const filePath = path.join(__dirname, '../../settings/px/FB0CA300.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(ws);

console.log('📦 Bắt đầu import ward-district mapping...\n');
console.log(`📊 Tổng số records: ${rawData.length}`);

// Transform data
const mappingData = rawData.map(row => ({
  wardId: String(row['Mã phường/xã mới ']),
  wardName: row['Tên Phường/Xã mới'],
  districtId: row['Mã Quận huyện TMS (cũ) CQT đã rà soát'],
  districtName: row['Tên Quận huyện TMS (cũ)'],
  provinceId: row['Mã tỉnh (BNV)'],
  provinceName: row['Tên tỉnh/TP mới'],
}));

// Thống kê
const provinces = [...new Set(mappingData.map(r => r.provinceId))];
const districts = [...new Set(mappingData.map(r => r.districtId))];

console.log(`\n📍 Thống kê:`);
console.log(`   - Tỉnh/TP: ${provinces.length}`);
console.log(`   - Quận/Huyện: ${districts.length}`);
console.log(`   - Phường/Xã: ${mappingData.length}`);

// Tạo file data.ts
const outputPath = path.join(__dirname, '../ward-district-data.ts');
const content = `/**
 * Ward District Mapping Data
 * Auto-generated from FB0CA300.xlsx
 * Total: ${mappingData.length} wards, ${districts.length} districts, ${provinces.length} provinces
 * Generated: ${new Date().toISOString()}
 */

import type { WardDistrictMapping } from './ward-district-mapping';

export const WARD_DISTRICT_DATA: WardDistrictMapping[] = ${JSON.stringify(mappingData, null, 2)};

export const STATISTICS = {
  totalWards: ${mappingData.length},
  totalDistricts: ${districts.length},
  totalProvinces: ${provinces.length},
  generatedAt: '${new Date().toISOString()}'
};
`;

fs.writeFileSync(outputPath, content, 'utf8');

console.log(`\n✅ Import thành công!`);
console.log(`📁 File: ${outputPath}`);
console.log(`💾 Size: ${(Buffer.byteLength(content) / 1024).toFixed(2)} KB`);

// Sample data
console.log(`\n📋 Sample (3 records đầu tiên):`);
console.log(JSON.stringify(mappingData.slice(0, 3), null, 2));
