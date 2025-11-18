"""
Generate Ward Mapping from FILE3.xlsx

Đọc FILE3.xlsx và tạo mapping:
- Ward cũ (3 cấp) → Ward mới (2 cấp)
- Dựa trên cột "Phường/xã mới" và "Sát nhập từ các Phường/xã trước"

Output: ward-old-to-new-mapping.ts
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime
import re

# Paths
BASE_DIR = Path(__file__).parent.parent.parent
FILE3_PATH = BASE_DIR / "settings" / "px" / "file3.xlsx"
OUTPUT_PATH = BASE_DIR / "provinces" / "ward-old-to-new-mapping.ts"

def normalize_text(text: str) -> str:
    """Chuẩn hóa text để so sánh"""
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text.strip())
    return text

def parse_ward_list(text: str) -> list[str]:
    """Parse danh sách ward từ text ngăn cách bằng dấu phẩy"""
    if pd.isna(text) or not text:
        return []
    
    # Split by comma
    wards = [normalize_text(w) for w in text.split(',')]
    return [w for w in wards if w]

def main():
    print("=" * 80)
    print("GENERATE WARD MAPPING FROM FILE3.xlsx")
    print("=" * 80)
    
    # Read FILE3
    print(f"\n📂 Reading: {FILE3_PATH}")
    df = pd.read_excel(FILE3_PATH)
    
    print(f"✅ Loaded {len(df)} rows")
    print(f"📋 Columns: {', '.join(df.columns.tolist())}")
    
    # Find relevant columns
    # Cột B (index 1): Tỉnh mới
    # Cột D (index 3): Phường/xã mới
    # Cột E (index 4): Sát nhập từ các Phường/xã trước
    
    columns = df.columns.tolist()
    province_col = columns[1] if len(columns) > 1 else None  # Column B: "Tỉnh mới"
    new_ward_col = columns[3] if len(columns) > 3 else None  # Column D: "Phường/xã mới"
    old_wards_col = columns[4] if len(columns) > 4 else None  # Column E: "Sát nhập từ các Phường/xã trước"
    
    if not all([province_col, new_ward_col, old_wards_col]):
        print("❌ ERROR: Không tìm thấy đủ cột trong FILE3!")
        print(f"   Province: {province_col}")
        print(f"   New Ward: {new_ward_col}")
        print(f"   Old Wards: {old_wards_col}")
        return
    
    print(f"\n📊 Mapping columns:")
    print(f"   - Tỉnh mới: {province_col}")
    print(f"   - Phường/xã mới: {new_ward_col}")
    print(f"   - Phường/xã cũ: {old_wards_col}")
    
    # Generate mapping
    mapping = {}
    stats = {
        'total_rows': 0,
        'total_new_wards': 0,
        'total_old_wards': 0,
        'skipped_rows': 0,
    }
    
    print(f"\n🔄 Processing rows...")
    
    for idx, row in df.iterrows():
        stats['total_rows'] += 1
        
        province = row[province_col]
        new_ward = row[new_ward_col]
        old_wards_text = row[old_wards_col]
        
        # Skip if missing data
        if pd.isna(province) or pd.isna(new_ward):
            stats['skipped_rows'] += 1
            continue
        
        province = normalize_text(str(province))
        new_ward = normalize_text(str(new_ward))
        
        # Parse old wards
        old_wards = parse_ward_list(str(old_wards_text))
        
        if not old_wards:
            # Nếu không có ward cũ, có thể ward mới = ward cũ
            old_wards = [new_ward]
        
        stats['total_new_wards'] += 1
        stats['total_old_wards'] += len(old_wards)
        
        # Create mapping: old_ward -> new_ward
        for old_ward in old_wards:
            key = old_ward  # Key là tên ward cũ
            mapping[key] = {
                'newWardName': new_ward,
                'provinceName': province,
                'oldWardName': old_ward,
            }
    
    print(f"\n✅ Processing complete!")
    print(f"   - Total rows: {stats['total_rows']}")
    print(f"   - New wards: {stats['total_new_wards']}")
    print(f"   - Old wards: {stats['total_old_wards']}")
    print(f"   - Skipped: {stats['skipped_rows']}")
    print(f"   - Mapping entries: {len(mapping)}")
    
    # Show examples
    print(f"\n📝 Examples (first 5):")
    for i, (old_ward, info) in enumerate(list(mapping.items())[:5]):
        print(f"   {i+1}. '{old_ward}' → '{info['newWardName']}' ({info['provinceName']})")
    
    # Generate TypeScript file
    print(f"\n📝 Generating TypeScript file...")
    
    ts_content = f'''/**
 * Ward Old-to-New Mapping
 * Auto-generated from FILE3.xlsx
 * Date: {datetime.now().isoformat()}
 * 
 * Mapping: Ward cũ (3 cấp) → Ward mới (2 cấp)
 * Total: {len(mapping)} mappings
 */

export interface WardMapping {{
  newWardName: string;
  provinceName: string;
  oldWardName: string;
}}

export const WARD_OLD_TO_NEW_MAPPING: Record<string, WardMapping> = {json.dumps(mapping, ensure_ascii=False, indent=2)};

/**
 * Helper function: Tìm ward mới từ ward cũ
 */
export function findNewWard(oldWardName: string): WardMapping | null {{
  return WARD_OLD_TO_NEW_MAPPING[oldWardName] || null;
}}

/**
 * Helper function: Lấy tất cả ward cũ của 1 ward mới
 */
export function findOldWards(newWardName: string): string[] {{
  return Object.values(WARD_OLD_TO_NEW_MAPPING)
    .filter(m => m.newWardName === newWardName)
    .map(m => m.oldWardName);
}}

/**
 * Statistics
 */
export const WARD_MAPPING_STATS = {{
  totalMappings: {len(mapping)},
  totalNewWards: {stats['total_new_wards']},
  totalOldWards: {stats['total_old_wards']},
  generatedAt: '{datetime.now().isoformat()}',
}};
'''
    
    # Write file
    OUTPUT_PATH.write_text(ts_content, encoding='utf-8')
    
    print(f"✅ Generated: {OUTPUT_PATH}")
    print(f"   Size: {OUTPUT_PATH.stat().st_size:,} bytes")
    
    print("\n" + "=" * 80)
    print("✅ DONE!")
    print("=" * 80)
    
    # Log để verify
    print(f"\n📊 To use in code:")
    print(f"   import {{ findNewWard }} from '@/features/provinces/ward-old-to-new-mapping';")
    print(f"   const newWard = findNewWard('Xã Đa Tốn');")
    print(f"   console.log(newWard);")

if __name__ == '__main__':
    main()
