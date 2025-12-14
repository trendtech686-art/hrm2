import { TemplateType, TemplateVariable } from '../types';

// Import all variable files
import { DON_BAN_HANG_VARIABLES } from './don-ban-hang';
import { DON_DAT_HANG_NHAP_VARIABLES } from './don-dat-hang-nhap';
import { DON_DOI_TRA_HANG_VARIABLES } from './don-doi-tra-hang';
import { DON_NHAP_HANG_VARIABLES } from './don-nhap-hang';
import { DON_TRA_HANG_VARIABLES } from './don-tra-hang';
import { NHAN_GIAO_HANG_VARIABLES } from './nhan-giao-hang';
import { PHIEU_BAN_GIAO_VARIABLES } from './phieu-ban-giao';
import { PHIEU_BAO_HANH_VARIABLES } from './phieu-bao-hanh';
import { PHIEU_CHI_VARIABLES } from './phieu-chi';
import { PHIEU_CHUYEN_HANG_VARIABLES } from './phieu-chuyen-hang';
import { PHIEU_DON_TAM_TINH_VARIABLES } from './phieu-don-tam-tinh';
import { PHIEU_DONG_GOI_VARIABLES } from './phieu-dong-goi';
import { PHIEU_GIAO_HANG_VARIABLES } from './phieu-giao-hang';
import { PHIEU_HUONG_DAN_DONG_GOI_VARIABLES } from './phieu-huong-dan-dong-goi';
import { PHIEU_KIEM_HANG_VARIABLES } from './phieu-kiem-hang';
import { PHIEU_NHAP_KHO_VARIABLES } from './phieu-nhap-kho';
import { PHIEU_THU_VARIABLES } from './phieu-thu';
import { PHIEU_TONG_KET_BAN_HANG_VARIABLES } from './phieu-tong-ket-ban-hang';
import { PHIEU_TRA_HANG_NCC_VARIABLES } from './phieu-tra-hang-ncc';
import { PHIEU_XAC_NHAN_HOAN_VARIABLES } from './phieu-xac-nhan-hoan';
import { PHIEU_YEU_CAU_BAO_HANH_VARIABLES } from './phieu-yeu-cau-bao-hanh';
import { PHIEU_YEU_CAU_DONG_GOI_VARIABLES } from './phieu-yeu-cau-dong-goi';
import { PHIEU_KHIEU_NAI_VARIABLES } from './phieu-khieu-nai';
import { PHIEU_PHAT_VARIABLES } from './phieu-phat';
import { PHIEU_DIEU_CHINH_GIA_VON_VARIABLES } from './phieu-dieu-chinh-gia-von';
import { TEM_PHU_SAN_PHAM_VARIABLES } from './tem-phu-san-pham';
import { BANG_LUONG_VARIABLES, PHIEU_LUONG_VARIABLES, BANG_LUONG_LINE_ITEM_VARIABLES, PHIEU_LUONG_COMPONENT_VARIABLES } from './bang-luong';
import { BANG_CHAM_CONG_VARIABLES, BANG_CHAM_CONG_LINE_ITEM_VARIABLES, CHI_TIET_CHAM_CONG_VARIABLES, CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES } from './bang-cham-cong';

// Re-export TemplateVariable type
export type { TemplateVariable } from '../types';

// Map template types to their specific variables
export const TEMPLATE_VARIABLES: Record<TemplateType, TemplateVariable[]> = {
  'order': DON_BAN_HANG_VARIABLES,
  'quote': PHIEU_DON_TAM_TINH_VARIABLES,
  'sales-return': DON_DOI_TRA_HANG_VARIABLES,
  'packing': PHIEU_DONG_GOI_VARIABLES,
  'delivery': PHIEU_GIAO_HANG_VARIABLES,
  'shipping-label': NHAN_GIAO_HANG_VARIABLES,
  'product-label': TEM_PHU_SAN_PHAM_VARIABLES,
  'purchase-order': DON_DAT_HANG_NHAP_VARIABLES,
  'stock-in': PHIEU_NHAP_KHO_VARIABLES,
  'stock-transfer': PHIEU_CHUYEN_HANG_VARIABLES,
  'inventory-check': PHIEU_KIEM_HANG_VARIABLES,
  'receipt': PHIEU_THU_VARIABLES,
  'payment': PHIEU_CHI_VARIABLES,
  'warranty': PHIEU_BAO_HANH_VARIABLES,
  'supplier-return': PHIEU_TRA_HANG_NCC_VARIABLES,
  'complaint': PHIEU_KHIEU_NAI_VARIABLES,
  'penalty': PHIEU_PHAT_VARIABLES,
  'leave': PHIEU_PHAT_VARIABLES, // TODO: Create dedicated PHIEU_NGHI_PHEP_VARIABLES
  'cost-adjustment': PHIEU_DIEU_CHINH_GIA_VON_VARIABLES,
  'handover': PHIEU_BAN_GIAO_VARIABLES,
  'payroll': BANG_LUONG_VARIABLES,
  'payslip': PHIEU_LUONG_VARIABLES,
  'attendance': BANG_CHAM_CONG_VARIABLES,
};

// Additional variable exports for extended template types (not in main TEMPLATE_TYPES)
export const EXTENDED_TEMPLATE_VARIABLES = {
  'don-nhap-hang': DON_NHAP_HANG_VARIABLES,
  'don-tra-hang': DON_TRA_HANG_VARIABLES,
  'phieu-ban-giao': PHIEU_BAN_GIAO_VARIABLES,
  'phieu-xac-nhan-hoan': PHIEU_XAC_NHAN_HOAN_VARIABLES,
  'phieu-tong-ket-ban-hang': PHIEU_TONG_KET_BAN_HANG_VARIABLES,
  'phieu-huong-dan-dong-goi': PHIEU_HUONG_DAN_DONG_GOI_VARIABLES,
  'phieu-yeu-cau-dong-goi': PHIEU_YEU_CAU_DONG_GOI_VARIABLES,
  'phieu-yeu-cau-bao-hanh': PHIEU_YEU_CAU_BAO_HANH_VARIABLES,
  'bang-luong': BANG_LUONG_VARIABLES,
  'phieu-luong': PHIEU_LUONG_VARIABLES,
  'bang-cham-cong': BANG_CHAM_CONG_VARIABLES,
  'chi-tiet-cham-cong': CHI_TIET_CHAM_CONG_VARIABLES,
};

// Helper function to get variables for a template type
export function getVariablesForTemplateType(type: TemplateType): TemplateVariable[] {
  return TEMPLATE_VARIABLES[type] || [];
}

// Helper function to get grouped variables for a template type
export function getGroupedVariablesForTemplateType(type: TemplateType): Record<string, TemplateVariable[]> {
  const variables = getVariablesForTemplateType(type);
  return variables.reduce((acc, variable) => {
    const group = variable.group || 'Khác';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(variable);
    return acc;
  }, {} as Record<string, TemplateVariable[]>);
}

// Re-export individual variable arrays for direct import if needed
export {
  DON_BAN_HANG_VARIABLES,
  DON_DAT_HANG_NHAP_VARIABLES,
  DON_DOI_TRA_HANG_VARIABLES,
  DON_NHAP_HANG_VARIABLES,
  DON_TRA_HANG_VARIABLES,
  NHAN_GIAO_HANG_VARIABLES,
  PHIEU_BAN_GIAO_VARIABLES,
  PHIEU_BAO_HANH_VARIABLES,
  PHIEU_CHI_VARIABLES,
  PHIEU_CHUYEN_HANG_VARIABLES,
  PHIEU_DON_TAM_TINH_VARIABLES,
  PHIEU_DONG_GOI_VARIABLES,
  PHIEU_GIAO_HANG_VARIABLES,
  PHIEU_HUONG_DAN_DONG_GOI_VARIABLES,
  PHIEU_KIEM_HANG_VARIABLES,
  PHIEU_NHAP_KHO_VARIABLES,
  PHIEU_THU_VARIABLES,
  PHIEU_TONG_KET_BAN_HANG_VARIABLES,
  PHIEU_TRA_HANG_NCC_VARIABLES,
  PHIEU_XAC_NHAN_HOAN_VARIABLES,
  PHIEU_YEU_CAU_BAO_HANH_VARIABLES,
  PHIEU_YEU_CAU_DONG_GOI_VARIABLES,
  PHIEU_KHIEU_NAI_VARIABLES,
  PHIEU_PHAT_VARIABLES,
  TEM_PHU_SAN_PHAM_VARIABLES,
  // Bảng lương
  BANG_LUONG_VARIABLES,
  PHIEU_LUONG_VARIABLES,
  BANG_LUONG_LINE_ITEM_VARIABLES,
  PHIEU_LUONG_COMPONENT_VARIABLES,
  // Bảng chấm công
  BANG_CHAM_CONG_VARIABLES,
  BANG_CHAM_CONG_LINE_ITEM_VARIABLES,
  CHI_TIET_CHAM_CONG_VARIABLES,
  CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES,
};
