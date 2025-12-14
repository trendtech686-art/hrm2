/**
 * Address Lookup Helper for Import
 * 
 * Chuyển đổi tên địa chỉ thành ID để form edit có thể populate đúng dropdown
 * 
 * LƯU Ý QUAN TRỌNG:
 * - Dữ liệu 2-level: 34 tỉnh mới (provinces-data) + wards-2level-data
 * - Dữ liệu 3-level: 63 tỉnh cũ (wards-3level-data có provinceName riêng)
 * - Cần lookup từ WARD trước để lấy đúng provinceId/districtId từ ward data
 */

import { useProvinceStore } from '@/features/settings/provinces/store';
import type { EmployeeAddress, AddressInputLevel } from '@/features/employees/types';

// Common aliases for provinces
// KEY = name in provinces-data (TP HCM, Hà Nội, etc.)
// VALUES = all possible variants including 3-level names
const PROVINCE_ALIASES: Record<string, string[]> = {
  'TP HCM': [
    'tp hcm', 'tphcm', 'hcm', 'sai gon', 'saigon',
    'thanh pho ho chi minh', 'tp ho chi minh', 'ho chi minh',
    'thành phố hồ chí minh', // with diacritics for exact match
  ],
  'Hà Nội': [
    'ha noi', 'hanoi', 'hn',
    'thanh pho ha noi', 'tp ha noi',
    'thành phố hà nội',
  ],
  'Đà Nẵng': [
    'da nang', 'danang',
    'thanh pho da nang', 'tp da nang',
    'thành phố đà nẵng',
  ],
  'Hải Phòng': [
    'hai phong', 'haiphong', 'hp',
    'thanh pho hai phong', 'tp hai phong',
    'thành phố hải phòng',
  ],
  'Cần Thơ': [
    'can tho', 'cantho',
    'thanh pho can tho', 'tp can tho',
    'thành phố cần thơ',
  ],
};

/**
 * Normalize tên để so sánh (bỏ dấu, lowercase)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();
}

/**
 * So sánh 2 string đã normalize
 */
function matchText(a: string, b: string): boolean {
  return normalizeText(a) === normalizeText(b);
}

/**
 * Tìm tỉnh/thành phố theo tên
 */
export function findProvinceByName(provinceName: string): { id: string; name: string } | null {
  if (!provinceName) return null;
  
  const store = useProvinceStore.getState();
  const provinces = store.data;
  
  // Exact match first
  let found = provinces.find(p => p.name === provinceName);
  if (found) return { id: found.id, name: found.name };
  
  // Normalized match
  found = provinces.find(p => matchText(p.name, provinceName));
  if (found) return { id: found.id, name: found.name };
  
  // Try alias match
  const normalizedInput = normalizeText(provinceName);
  for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)) {
    if (aliases.some(alias => alias === normalizedInput || normalizedInput.includes(alias) || alias.includes(normalizedInput))) {
      found = provinces.find(p => p.name === standardName);
      if (found) return { id: found.id, name: found.name };
    }
  }
  
  // Partial match (contains) - last resort
  found = provinces.find(p => 
    normalizeText(p.name).includes(normalizedInput) || 
    normalizedInput.includes(normalizeText(p.name))
  );
  
  return found ? { id: found.id, name: found.name } : null;
}

/**
 * Remove common prefixes from district/ward names for better matching
 */
function removeCommonPrefixes(text: string): string {
  const prefixes = [
    'quan ', 'huyen ', 'thi xa ', 'thanh pho ', 'tp ',
    'phuong ', 'xa ', 'thi tran ', 'tt ',
  ];
  const normalized = normalizeText(text);
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      return normalized.slice(prefix.length);
    }
  }
  return normalized;
}

/**
 * Tìm quận/huyện theo tên và provinceId
 */
export function findDistrictByName(
  districtName: string, 
  provinceId: string
): { id: number; name: string } | null {
  if (!districtName || !provinceId) return null;
  
  const store = useProvinceStore.getState();
  const districts = store.districts.filter(d => d.provinceId === provinceId);
  
  // Exact match first
  let found = districts.find(d => d.name === districtName);
  if (found) return { id: found.id, name: found.name };
  
  // Normalized match
  found = districts.find(d => matchText(d.name, districtName));
  if (found) return { id: found.id, name: found.name };
  
  // Try matching without prefixes
  const inputWithoutPrefix = removeCommonPrefixes(districtName);
  found = districts.find(d => {
    const dbWithoutPrefix = removeCommonPrefixes(d.name);
    return dbWithoutPrefix === inputWithoutPrefix;
  });
  if (found) return { id: found.id, name: found.name };
  
  // Partial match - last resort
  const normalizedInput = normalizeText(districtName);
  found = districts.find(d => 
    normalizeText(d.name).includes(normalizedInput) || 
    normalizedInput.includes(normalizeText(d.name))
  );
  
  return found ? { id: found.id, name: found.name } : null;
}

/**
 * Tìm phường/xã theo tên, districtId và inputLevel
 */
export function findWardByName(
  wardName: string,
  provinceId: string,
  districtId: number | null,
  inputLevel: AddressInputLevel
): { id: string; name: string; districtId?: number; districtName?: string } | null {
  if (!wardName || !provinceId) return null;
  
  const store = useProvinceStore.getState();
  
  let wards = store.wards.filter(w => w.provinceId === provinceId);
  
  // Filter by level
  if (inputLevel === '3-level' && districtId) {
    wards = wards.filter(w => w.level === '3-level' && w.districtId === districtId);
  } else if (inputLevel === '2-level') {
    wards = wards.filter(w => w.level === '2-level');
  }
  
  // Exact match first
  let found = wards.find(w => w.name === wardName);
  if (found) {
    return { 
      id: found.id, 
      name: found.name,
      districtId: found.districtId,
      districtName: found.districtName,
    };
  }
  
  // Normalized match
  found = wards.find(w => matchText(w.name, wardName));
  if (found) {
    return { 
      id: found.id, 
      name: found.name,
      districtId: found.districtId,
      districtName: found.districtName,
    };
  }
  
  // Try matching without prefixes
  const inputWithoutPrefix = removeCommonPrefixes(wardName);
  found = wards.find(w => {
    const dbWithoutPrefix = removeCommonPrefixes(w.name);
    return dbWithoutPrefix === inputWithoutPrefix;
  });
  if (found) {
    return { 
      id: found.id, 
      name: found.name,
      districtId: found.districtId,
      districtName: found.districtName,
    };
  }
  
  // Partial match - last resort
  const normalizedInput = normalizeText(wardName);
  found = wards.find(w => 
    normalizeText(w.name).includes(normalizedInput) || 
    normalizedInput.includes(normalizeText(w.name))
  );
  
  return found ? { 
    id: found.id, 
    name: found.name,
    districtId: found.districtId,
    districtName: found.districtName,
  } : null;
}

/**
 * Lookup đầy đủ địa chỉ từ text sang EmployeeAddress với IDs
 * 
 * STRATEGY MỚI: Lookup từ WARD trước để lấy đúng provinceId/districtId
 * vì ward data có đủ thông tin về province và district
 * 
 * @param address - Partial address với text names
 * @returns EmployeeAddress hoàn chỉnh với IDs
 */
export function lookupAddressIds(address: Partial<EmployeeAddress> | null | undefined): EmployeeAddress | null {
  if (!address) return null;
  if (!address.street && !address.province && !address.ward) return null;
  
  const inputLevel = address.inputLevel || '3-level';
  const store = useProvinceStore.getState();
  
  console.log('[lookupAddressIds] Input address:', address);
  console.log('[lookupAddressIds] inputLevel:', inputLevel);
  
  let provinceId = address.provinceId || '';
  let provinceName = address.province || '';
  let districtId = address.districtId || 0;
  let districtName = address.district || '';
  let wardId = address.wardId || '';
  let wardName = address.ward || '';
  
  // === STRATEGY: Lookup từ ward trước (có đầy đủ thông tin) ===
  if (address.ward) {
    const allWards = store.wards;
    const normalizedWardInput = normalizeText(address.ward);
    const wardWithoutPrefix = removeCommonPrefixes(address.ward);
    
    // Filter wards by level
    const wardsOfLevel = allWards.filter(w => 
      inputLevel === '2-level' ? w.level === '2-level' : w.level === '3-level'
    );
    
    // Try to find ward matching name AND province/district context
    let foundWard = wardsOfLevel.find(w => {
      const nameMatch = w.name === address.ward || 
                       matchText(w.name, address.ward!) ||
                       removeCommonPrefixes(w.name) === wardWithoutPrefix;
      if (!nameMatch) return false;
      
      // If province name provided, check if it matches ward's province
      if (address.province) {
        const normalizedProvince = normalizeText(address.province);
        const wardProvince = normalizeText(w.provinceName || '');
        // Check various matching patterns
        if (!wardProvince.includes(normalizedProvince) && 
            !normalizedProvince.includes(wardProvince) &&
            !matchProvinceAlias(address.province, w.provinceName || '')) {
          return false;
        }
      }
      
      // If district name provided (3-level), check if it matches
      if (inputLevel === '3-level' && address.district && w.districtName) {
        const normalizedDistrict = normalizeText(address.district);
        const wardDistrict = normalizeText(w.districtName);
        const districtWithoutPrefix = removeCommonPrefixes(address.district);
        const wardDistrictWithoutPrefix = removeCommonPrefixes(w.districtName);
        
        if (!wardDistrict.includes(normalizedDistrict) && 
            !normalizedDistrict.includes(wardDistrict) &&
            wardDistrictWithoutPrefix !== districtWithoutPrefix) {
          return false;
        }
      }
      
      return true;
    });
    
    // If not found with context, try just by ward name
    if (!foundWard) {
      foundWard = wardsOfLevel.find(w => 
        w.name === address.ward || 
        matchText(w.name, address.ward!) ||
        removeCommonPrefixes(w.name) === wardWithoutPrefix
      );
    }
    
    if (foundWard) {
      console.log('[lookupAddressIds] Found ward:', foundWard);
      wardId = foundWard.id;
      wardName = foundWard.name;
      
      // IMPORTANT: Get provinceId from provinces-data (not from ward's provinceId)
      // because ward data might have different provinceId (e.g. "00" vs "24" for HCM)
      const provinceFromData = findProvinceByName(foundWard.provinceName || address.province || '');
      if (provinceFromData) {
        provinceId = provinceFromData.id;
        provinceName = provinceFromData.name;
      } else {
        // Fallback to ward's data if not found in provinces-data
        provinceId = foundWard.provinceId;
        provinceName = foundWard.provinceName || address.province || '';
      }
      
      if (foundWard.districtId) {
        districtId = foundWard.districtId;
        districtName = foundWard.districtName || address.district || '';
      }
    } else {
      console.log('[lookupAddressIds] Ward NOT FOUND for:', address.ward);
    }
  }
  
  // === Fallback: If no ward found, try province lookup ===
  if (!wardId && address.province) {
    const province = findProvinceByName(address.province);
    if (province) {
      provinceId = province.id;
      provinceName = province.name;
    }
    
    // Try district lookup if province found
    if (provinceId && address.district && inputLevel === '3-level') {
      const district = findDistrictByName(address.district, provinceId);
      if (district) {
        districtId = district.id;
        districtName = district.name;
      }
    }
  }
  
  console.log('[lookupAddressIds] Result:', { provinceId, provinceName, districtId, districtName, wardId, wardName });
  
  return {
    street: address.street || '',
    province: provinceName,
    provinceId: provinceId,
    district: districtName,
    districtId: districtId,
    ward: wardName,
    wardId: wardId,
    inputLevel: inputLevel,
  } as EmployeeAddress;
}

/**
 * Check if province names match (including aliases)
 */
function matchProvinceAlias(input: string, dbName: string): boolean {
  const normalizedInput = normalizeText(input);
  const normalizedDb = normalizeText(dbName);
  
  // Direct match
  if (normalizedInput === normalizedDb) return true;
  
  // Check aliases
  for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)) {
    const normalizedStandard = normalizeText(standardName);
    const inputIsAlias = aliases.some(a => a === normalizedInput || normalizedInput.includes(a));
    const dbIsStandard = normalizedDb === normalizedStandard || normalizedDb.includes(normalizedStandard);
    const dbIsAlias = aliases.some(a => normalizedDb.includes(a));
    
    if (inputIsAlias && (dbIsStandard || dbIsAlias)) return true;
    if (dbIsAlias && normalizedInput === normalizedStandard) return true;
  }
  
  return false;
}

/**
 * Post-process imported employee data để lookup address IDs
 * Gọi hàm này sau khi transform import row
 */
export function enrichEmployeeAddresses<T extends { 
  permanentAddress?: EmployeeAddress | null;
  temporaryAddress?: EmployeeAddress | null;
}>(data: Partial<T>): Partial<T> {
  const result = { ...data };
  
  console.log('[Address Lookup] Input:', {
    permanentAddress: data.permanentAddress,
    temporaryAddress: data.temporaryAddress,
  });
  
  if (data.permanentAddress) {
    const enriched = lookupAddressIds(data.permanentAddress);
    console.log('[Address Lookup] permanentAddress enriched:', enriched);
    if (enriched) {
      result.permanentAddress = enriched;
    }
  }
  
  if (data.temporaryAddress) {
    const enriched = lookupAddressIds(data.temporaryAddress);
    console.log('[Address Lookup] temporaryAddress enriched:', enriched);
    if (enriched) {
      result.temporaryAddress = enriched;
    }
  }
  
  return result;
}
