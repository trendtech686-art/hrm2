/**
 * Address Conversion Helper
 * 
 * Logic chuyển đổi địa chỉ 2 cấp → 3 cấp
 * Tìm các gợi ý District+Ward dựa trên Province+Ward input
 */

import { useProvinceStore } from '@/features/settings/provinces/store';
import type { Ward, District } from '@/features/settings/provinces/types';
import { asBusinessId } from '@/lib/id-types';

export type WardSuggestion = {
  ward: Ward;
  district: District;
  fullAddress: string;
  matchScore: number; // 0-100 (cao = match tốt)
};

/**
 * Tìm các ward gợi ý dựa trên input 2 cấp
 * 
 * Logic:
 * 1. Tìm xem wardName có chứa tên District không
 *    VD: "X. Gia Lâm" → Tìm "Huyện Gia Lâm"
 * 2. Nếu có → Lấy TẤT CẢ wards trong District đó
 * 3. Nếu không → Tìm wards có tên giống/gần giống
 * 
 * @example
 * findMatchingWards("101", "X. Gia Lâm")
 * // Returns: 25 suggestions (6 new + 19 old wards in Huyện Gia Lâm)
 */
export function findMatchingWards(
  provinceId: string,
  wardName: string
): WardSuggestion[] {
  const { 
    wards, 
    districts, 
    getDistrictsByProvinceId, 
    getWardsByDistrictId 
  } = useProvinceStore.getState();

  const suggestions: WardSuggestion[] = [];
  const businessProvinceId = asBusinessId(provinceId);
  
  // Normalize input
  const normalizedInput = normalizeText(wardName);
  
  // Extract core name (remove prefix like "Phường", "Xã", etc.)
  const coreWardName = normalizedInput
    .replace(/^(phuong|xa|thi tran|tt)\s+/i, '')
    .trim();
  
  // Step 1: Tìm TẤT CẢ wards có tên giống trong province
  // VD: "Xã Bát Tràng" → Tìm tất cả ward có tên "Bát Tràng" trong province
  for (const ward of wards) {
    // Chỉ tìm trong province hiện tại và phải có districtId (3 cấp)
    if (ward.provinceId !== businessProvinceId || !ward.districtId) continue;
    
    const normalizedWard = normalizeText(ward.name);
    const coreWardNameCompare = normalizedWard
      .replace(/^(phuong|xa|thi tran|tt)\s+/i, '')
      .trim();
    
    // Exact match với core name hoặc full match
    if (coreWardNameCompare === coreWardName || 
        normalizedWard === normalizedInput ||
        coreWardNameCompare.includes(coreWardName) ||
        coreWardName.includes(coreWardNameCompare)) {
      
      // Tìm district tương ứng
      const district = districts.find(d => d.id === ward.districtId);
      
      if (district) {
        suggestions.push({
          ward,
          district,
          fullAddress: `${ward.name}, ${district.name}`,
          matchScore: calculateMatchScore(wardName, ward.name, district.name, 'exact_match'),
        });
      }
    }
  }
  
  // Step 2: Nếu không tìm thấy exact match → Tìm district có tên giống wardName
  // VD: "Phường Hoàn Kiếm" → Tìm "Quận Hoàn Kiếm"
  if (suggestions.length === 0) {
    const provinceDistricts = getDistrictsByProvinceId(businessProvinceId);
    
    for (const district of provinceDistricts) {
      const normalizedDistrict = normalizeText(district.name);
      const coreDistrictName = normalizedDistrict
        .replace(/^(quan|huyen|thi xa|thanh pho|tp)\s+/i, '')
        .trim();
      
      // Check if wardName contains district name
      if (coreWardName.includes(coreDistrictName) || 
          coreDistrictName.includes(coreWardName) ||
          normalizedInput.includes(normalizedDistrict)) {
        
        // Lấy TẤT CẢ wards trong district này
        const districtWards = getWardsByDistrictId(district.id);
        
        for (const ward of districtWards) {
          suggestions.push({
            ward,
            district,
            fullAddress: `${ward.name}, ${district.name}`,
            matchScore: calculateMatchScore(wardName, ward.name, district.name, 'district_match'),
          });
        }
      }
    }
  }
  
  // Step 3: Nếu vẫn không tìm thấy → Fuzzy match
  if (suggestions.length === 0) {
    for (const ward of wards) {
      // Chỉ tìm trong province hiện tại
      if (ward.provinceId !== businessProvinceId) continue;
      
      const normalizedWard = normalizeText(ward.name);
      const coreWardNameCompare = normalizedWard
        .replace(/^(phuong|xa|thi tran|tt)\s+/i, '')
        .trim();
      
      // Fuzzy match với core name
      if (coreWardNameCompare.includes(coreWardName) || 
          coreWardName.includes(coreWardNameCompare) ||
          normalizedWard.includes(normalizedInput) || 
          normalizedInput.includes(normalizedWard)) {
        
        // Tìm district tương ứng
        const district = ward.districtId 
          ? districts.find(d => d.id === ward.districtId)
          : null;
        
        if (district) {
          suggestions.push({
            ward,
            district,
            fullAddress: `${ward.name}, ${district.name}`,
            matchScore: calculateMatchScore(wardName, ward.name, district.name, 'ward_match'),
          });
        }
      }
    }
  }
  
  // Sort by match score (cao → thấp)
  return suggestions.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Normalize text for matching
 * - Lowercase
 * - Remove accents (dấu)
 * - Remove special chars
 * - Trim whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove dấu
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim();
}

/**
 * Calculate match score (0-100)
 */
function calculateMatchScore(
  input: string,
  wardName: string,
  districtName: string,
  matchType: 'exact_match' | 'district_match' | 'ward_match'
): number {
  const normalizedInput = normalizeText(input);
  const normalizedWard = normalizeText(wardName);
  const normalizedDistrict = normalizeText(districtName);
  
  // Remove prefix để so sánh core name
  const coreInput = normalizedInput.replace(/^(phuong|xa|thi tran|tt)\s+/i, '').trim();
  const coreWard = normalizedWard.replace(/^(phuong|xa|thi tran|tt)\s+/i, '').trim();
  
  let score = 0;
  
  if (matchType === 'exact_match') {
    // Exact match → Điểm cao nhất (90-100)
    score = 90;
    
    // Bonus: Core name exact match
    if (coreWard === coreInput) {
      score = 100;
    } else if (normalizedWard === normalizedInput) {
      score = 95;
    }
  } else if (matchType === 'district_match') {
    // District match → Điểm cao (70-100)
    score = 70;
    
    // Bonus: Ward name cũng match
    if (normalizedWard.includes(normalizedInput)) {
      score += 20;
    }
    
    // Bonus: Exact match
    if (normalizedWard === normalizedInput) {
      score = 100;
    }
  } else {
    // Ward match → Điểm thấp hơn (30-60)
    score = 30;
    
    // Bonus: Match tốt hơn
    const matchLength = longestCommonSubstring(normalizedInput, normalizedWard);
    score += Math.min(30, (matchLength / normalizedInput.length) * 30);
  }
  
  return Math.min(100, score);
}

/**
 * Find longest common substring
 */
function longestCommonSubstring(str1: string, str2: string): number {
  let longest = 0;
  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str2.length; j++) {
      let len = 0;
      while (
        i + len < str1.length &&
        j + len < str2.length &&
        str1[i + len] === str2[j + len]
      ) {
        len++;
      }
      longest = Math.max(longest, len);
    }
  }
  return longest;
}

/**
 * Format gợi ý để hiển thị trong dialog
 */
export function formatSuggestion(suggestion: WardSuggestion): string {
  const { ward, district } = suggestion;
  const levelBadge = ward.level === 'new' ? '🆕' : ward.level === 'old' ? '📦' : '';
  
  return `${ward.name}, ${district.name} ${levelBadge}`;
}
