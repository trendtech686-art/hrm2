export type Province = {
  systemId: string;
  id: string; // e.g., 01
  name: string; // e.g., Thành phố Hà Nội
};

export type District = {
  systemId: string;
  id: number; // e.g., 10105 (TMS code)
  name: string; // e.g., Quận Hoàn Kiếm
  provinceId: string; // Link to Province.id, e.g., 01
};

export type Ward = {
  systemId: string;
  id: string; // e.g., 10105001 (NEW) or OLD_000001 (OLD)
  name: string; // e.g., Phường Hoàn Kiếm
  provinceId: string; // Link to Province.id, e.g., 01
  districtId?: number; // Link to District.id, e.g., 10105 (optional for 2-level)
  level?: '2-level' | '3-level' | 'new' | 'old'; // 2-level = Luật 2025, 3-level = Legacy, new/old = backward compat
};
