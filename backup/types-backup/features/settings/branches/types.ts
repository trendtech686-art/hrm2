import { SystemId, BusinessId } from '../../../lib/id-types';

export type Branch = {
  systemId: SystemId;
  id: BusinessId; // User-defined code, e.g., "HCM", "HN"
  name: string; // e.g., "Chi nhánh Hồ Chí Minh"
  address: string;
  phone: string;
  managerId?: SystemId | undefined; // links to Employee.systemId
  isDefault: boolean;
  
  // ✅ Địa chỉ 3 cấp (cho shipping integration)
  addressLevel?: '2-level' | '3-level' | undefined; // Chọn 2-cấp hoặc 3-cấp
  province?: string | undefined;        // "Hà Nội"
  provinceId?: string | undefined;      // "08"
  district?: string | undefined;        // "Quận Ba Đình" (chỉ cho 3-cấp)
  districtId?: number | undefined;      // 1 (chỉ cho 3-cấp)
  ward?: string | undefined;            // "Phường Phúc Xá"
  wardCode?: string | undefined;        // "1" (3-cấp) hoặc "10105001" (2-cấp)
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
