import type { SystemId, BusinessId } from '@/lib/id-types';

type AuditFields = {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type Province = AuditFields & {
  systemId: SystemId;
  id: BusinessId; // e.g., 01
  name: string; // e.g., Thành phố Hà Nội
};

export type District = AuditFields & {
  systemId: SystemId;
  id: number; // e.g., 10105 (TMS code)
  name: string; // e.g., Quận Hoàn Kiếm
  provinceId: BusinessId; // Link to Province.id, e.g., 01
  provinceName?: string;
};

export type Ward = AuditFields & {
  systemId: SystemId;
  id: string; // e.g., 10105001 (NEW) or OLD_000001 (OLD)
  name: string; // e.g., Phường Hoàn Kiếm
  provinceId: BusinessId; // Link to Province.id, e.g., 01
  provinceName?: string;
  districtId?: number; // Link to District.id, e.g., 10105 (optional for 2-level)
  districtName?: string;
  level?: '2-level' | '3-level' | 'new' | 'old'; // 2-level = Luật 2025, 3-level = Legacy, new/old = backward compat
};
