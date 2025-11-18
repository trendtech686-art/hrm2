import type { SystemId } from '../../../lib/id-config';

export type Branch = {
  systemId: SystemId;
  id: string; // User-defined code, e.g., "HCM", "HN"
  name: string; // e.g., "Chi nhánh Hồ Chí Minh"
  address: string;
  phone: string;
  managerId?: string; // links to Employee.systemId
  isDefault: boolean;
  
  // ✅ Địa chỉ 3 cấp (cho shipping integration)
  addressLevel?: '2-level' | '3-level'; // Chọn 2-cấp hoặc 3-cấp
  province?: string;        // "Hà Nội"
  provinceId?: string;      // "08"
  district?: string;        // "Quận Ba Đình" (chỉ cho 3-cấp)
  districtId?: number;      // 1 (chỉ cho 3-cấp)
  ward?: string;            // "Phường Phúc Xá"
  wardCode?: string;        // "1" (3-cấp) hoặc "10105001" (2-cấp)
};
