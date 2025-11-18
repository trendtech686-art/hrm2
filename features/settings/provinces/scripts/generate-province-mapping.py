"""
Generate Province Mapping from FILE3
Tạo mapping: Tỉnh cũ (63) → Tỉnh mới (34)

Input: file3.xlsx (cột B, C)
Output: province-mapping.ts

Logic:
- Cột B: Tỉnh mới (34 tỉnh)
- Cột C: "Gộp từ các tỉnh cũ" (có thể nhiều tỉnh, phân cách bằng dấu phẩy)
- Parse cột C để tạo mapping: Old Province Name → New Province ID
"""

import pandas as pd
import json
from datetime import datetime
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent
FILE3_PATH = PROJECT_ROOT / 'features' / 'settings' / 'px' / 'file3.xlsx'
OUTPUT_DIR = SCRIPT_DIR.parent
OUTPUT_FILE = OUTPUT_DIR / 'province-mapping.ts'

print('📖 Reading file3.xlsx...\n')

# Read Excel
df = pd.read_excel(FILE3_PATH, sheet_name=0)

print(f'✅ Loaded {len(df)} rows')
print(f'Columns: {df.columns.tolist()}\n')

# Expected columns (adjust if needed)
COL_STT = 'Stt'
COL_NEW_PROVINCE = 'Tỉnh mới'  # Cột B
COL_OLD_PROVINCES = 'Gộp từ các tỉnh cũ'  # Cột C
COL_NEW_WARD = 'Phường/xã mới'  # Cột D (optional, for validation)

# Check columns exist
if COL_NEW_PROVINCE not in df.columns or COL_OLD_PROVINCES not in df.columns:
    print('❌ ERROR: Required columns not found!')
    print(f'Available columns: {df.columns.tolist()}')
    exit(1)

# Province ID mapping (from provinces-data.ts)
# Map province name → ID (01-34)
PROVINCE_IDS = {
    'An Giang': '01',
    'Bắc Ninh': '02',
    'Cao Bằng': '03',
    'Cà Mau': '04',
    'Cần Thơ': '05',
    'Gia Lai': '06',
    'Huế': '07',
    'Hà Nội': '08',
    'Hà Tĩnh': '09',
    'Hưng Yên': '10',
    'Hải Phòng': '11',
    'Khánh Hòa': '12',
    'Lai Châu': '13',
    'Lào Cai': '14',
    'Lâm Đồng': '15',
    'Lạng Sơn': '16',
    'Nghệ An': '17',
    'Ninh Bình': '18',
    'Phú Thọ': '19',
    'Quảng Ngãi': '20',
    'Quảng Ninh': '21',
    'Quảng Trị': '22',
    'Sơn La': '23',
    'TP HCM': '24',
    'Thanh Hóa': '25',
    'Thái Nguyên': '26',
    'Tuyên Quang': '27',
    'Tây Ninh': '28',
    'Vĩnh Long': '29',
    'Điện Biên': '30',
    'Đà Nẵng': '31',
    'Đắk Lắk': '32',
    'Đồng Nai': '33',
    'Đồng Tháp': '34',
}

# Build mapping
province_mapping = {}  # { "Tỉnh cũ": { newProvinceId: "XX", newProvinceName: "YY" } }
province_groups = {}   # { "Tỉnh mới": ["Tỉnh cũ 1", "Tỉnh cũ 2", ...] }

for _, row in df.iterrows():
    new_province = str(row[COL_NEW_PROVINCE]).strip() if pd.notna(row[COL_NEW_PROVINCE]) else None
    old_provinces_str = str(row[COL_OLD_PROVINCES]).strip() if pd.notna(row[COL_OLD_PROVINCES]) else None
    
    if not new_province or not old_provinces_str or new_province == 'nan':
        continue
    
    # Get new province ID
    new_province_id = PROVINCE_IDS.get(new_province)
    if not new_province_id:
        print(f'⚠️  Province not found in mapping: {new_province}')
        continue
    
    # Parse old provinces (separated by comma)
    old_province_names = [p.strip() for p in old_provinces_str.split(',') if p.strip()]
    
    # Store mapping
    for old_name in old_province_names:
        if old_name not in province_mapping:
            province_mapping[old_name] = {
                'newProvinceId': new_province_id,
                'newProvinceName': new_province,
            }
    
    # Store groups (for documentation)
    if new_province not in province_groups:
        province_groups[new_province] = []
    
    for old_name in old_province_names:
        if old_name not in province_groups[new_province]:
            province_groups[new_province].append(old_name)

print('\n' + '='*60)
print('✅ MAPPING SUMMARY')
print('='*60)
print(f'Total old provinces: {len(province_mapping)}')
print(f'Total new provinces: {len(province_groups)}\n')

# Print groups
for new_prov, old_provs in sorted(province_groups.items()):
    if len(old_provs) > 1:
        print(f'  {new_prov} ← {", ".join(old_provs)}')

# Generate TypeScript file
ts_content = f'''/**
 * Province Mapping: Old (63) → New (34)
 * Auto-generated from file3.xlsx
 * Date: {datetime.now().isoformat()}
 * 
 * Usage:
 * - Tìm provinceId mới từ tên tỉnh cũ
 * - Map wards 3-level (có tỉnh cũ) sang provinceId mới
 */

export type OldProvinceMapping = {{
  newProvinceId: string;  // "01" - "34"
  newProvinceName: string; // "Hà Nội", "TP HCM", etc.
}};

/**
 * Map tên tỉnh CŨ → Thông tin tỉnh MỚI
 * 
 * @example
 * OLD_TO_NEW_PROVINCE_MAP["Hà Tây"] 
 * // => {{ newProvinceId: "08", newProvinceName: "Hà Nội" }}
 */
export const OLD_TO_NEW_PROVINCE_MAP: Record<string, OldProvinceMapping> = {json.dumps(province_mapping, ensure_ascii=False, indent=2)};

/**
 * Helper: Lấy provinceId mới từ tên tỉnh cũ
 */
export function getNewProvinceId(oldProvinceName: string): string | null {{
  const mapping = OLD_TO_NEW_PROVINCE_MAP[oldProvinceName];
  return mapping ? mapping.newProvinceId : null;
}}

/**
 * Helper: Lấy tên tỉnh mới từ tên tỉnh cũ
 */
export function getNewProvinceName(oldProvinceName: string): string | null {{
  const mapping = OLD_TO_NEW_PROVINCE_MAP[oldProvinceName];
  return mapping ? mapping.newProvinceName : null;
}}

/**
 * Reverse map: Tỉnh MỚI → Danh sách tỉnh CŨ
 */
export const NEW_TO_OLD_PROVINCE_GROUPS: Record<string, string[]> = {json.dumps(province_groups, ensure_ascii=False, indent=2)};
'''

# Write file
OUTPUT_FILE.write_text(ts_content, encoding='utf-8')

print(f'\n✅ Generated: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}')
print(f'   Size: {OUTPUT_FILE.stat().st_size / 1024:.2f} KB')
print('\n🎯 Next steps:')
print('   1. Import mapping in store.ts')
print('   2. Use getNewProvinceId() to map old province → new provinceId')
print('   3. Update wards-3level-data with new provinceIds')
