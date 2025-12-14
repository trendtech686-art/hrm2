/**
 * Ward to District Mapping
 * Auto-generated from FB0CA300.xlsx
 * 
 * Mục đích: Tự động điền District khi user chỉ nhập Province + Ward
 * 
 * Cách dùng:
 * - User chọn 2 cấp: Hà Nội → Phường Phúc Xá
 * - Hệ thống tra wardId → districtId
 * - Tự động điền: "Quận Ba Đình" (10101)
 */

import { asBusinessId, type BusinessId, type SystemId } from '@/lib/id-types';

export type WardDistrictMapping = {
  wardId: string;        // "10101001"
  wardName: string;      // "Phường Phúc Xá"
  districtId: number;    // 10101
  districtName: string;  // "Quận Ba Đình"
  provinceId: BusinessId;    // "01"
  provinceName: string;  // "Thành phố Hà Nội"
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type WardDistrictDataInput = Omit<WardDistrictMapping, 'provinceId'> & {
  provinceId: BusinessId | string | number;
};

/**
 * Lấy thông tin district từ wardId
 * 
 * @example
 * const info = getDistrictByWardId("10101001");
 * // Returns: { districtId: 10101, districtName: "Quận Ba Đình", ... }
 */
export function getDistrictByWardId(wardId: string): WardDistrictMapping | null {
  // TODO: Load from store or DB
  return wardDistrictMap.get(wardId) || null;
}

/**
 * Tự động điền district khi user chọn ward
 * 
 * @example
 * const address = autoFillDistrict({
 *   provinceId: "01",
 *   wardId: "10101001"
 * });
 * // Returns: { provinceId: "01", districtId: 10101, wardId: "10101001", ... }
 */
export function autoFillDistrict(input: {
  provinceId: string;
  provinceName: string;
  wardId: string;
  wardName: string;
}): {
  // 2-level (user input)
  provinceId: string;
  provinceName: string;
  wardId: string;
  wardName: string;
  // 3-level (auto-filled)
  districtId: number;
  districtName: string;
} {
  const mapping = getDistrictByWardId(input.wardId);
  
  if (!mapping) {
    throw new Error(`Không tìm thấy quận/huyện cho phường/xã: ${input.wardName}`);
  }
  
  return {
    provinceId: input.provinceId,
    provinceName: input.provinceName,
    wardId: input.wardId,
    wardName: input.wardName,
    districtId: mapping.districtId,
    districtName: mapping.districtName,
  };
}

// Import data từ file đã generate
import { WARD_DISTRICT_DATA } from './ward-district-data';

// In-memory cache
const wardDistrictMap = new Map<string, WardDistrictMapping>();

/**
 * Load mapping data from Excel import
 * Auto-loads 3,321 records on module initialization
 */
export function loadWardDistrictMapping(data?: ReadonlyArray<WardDistrictDataInput>) {
  wardDistrictMap.clear();
  const dataToLoad = data || WARD_DISTRICT_DATA;
  dataToLoad.forEach(item => {
    const provinceId = asBusinessId(
      typeof item.provinceId === 'number'
        ? item.provinceId.toString().padStart(2, '0')
        : item.provinceId
    );

    const normalized: WardDistrictMapping = {
      wardId: item.wardId,
      wardName: item.wardName,
      districtId: item.districtId,
      districtName: item.districtName,
      provinceId,
      provinceName: item.provinceName,
      ...(item.createdAt ? { createdAt: item.createdAt } : {}),
      ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}),
      ...(item.createdBy ? { createdBy: item.createdBy } : {}),
      ...(item.updatedBy ? { updatedBy: item.updatedBy } : {}),
    };

    wardDistrictMap.set(normalized.wardId, normalized);
  });
  console.log(`✅ Loaded ${wardDistrictMap.size} ward-district mappings`);
}

// Auto-load on import
loadWardDistrictMapping();

/**
 * Kiểm tra xem ward có thuộc district không
 */
export function isWardInDistrict(wardId: string, districtId: number): boolean {
  const mapping = getDistrictByWardId(wardId);
  return mapping?.districtId === districtId;
}
