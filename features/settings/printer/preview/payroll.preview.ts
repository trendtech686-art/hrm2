/**
 * Payroll Preview Data - Bảng lương
 * Dữ liệu mẫu cho preview mẫu in bảng lương
 */

import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PAYROLL_PREVIEW_DATA: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,
  
  // Thông tin bảng lương
  '{batch_code}': 'PL-2024-12-001',
  '{batch_title}': 'Bảng lương tháng 12/2024',
  '{batch_status}': 'Đã khóa',
  '{pay_period}': '12/2024',
  '{pay_period_start}': '01/12/2024',
  '{pay_period_end}': '31/12/2024',
  '{payroll_date}': '05/01/2025',
  '{reference_months}': '2024-12',
  '{created_on}': '02/01/2025',
  '{created_by}': 'Nguyễn Văn A',
  '{locked_on}': '05/01/2025',
  '{locked_by}': 'Trần Văn B',
  '{notes}': 'Bảng lương tháng 12/2024',
  
  // Tổng kết
  '{total_employees}': '15',
  '{total_gross}': '450,000,000',
  '{total_gross_text}': 'Bốn trăm năm mươi triệu đồng',
  '{total_earnings}': '500,000,000',
  '{total_deductions}': '30,000,000',
  '{total_contributions}': '20,000,000',
  '{total_net}': '450,000,000',
  '{total_net_text}': 'Bốn trăm năm mươi triệu đồng',
};

// Preview line items cho bảng lương
export const PAYROLL_PREVIEW_LINE_ITEMS: Record<string, string>[] = [
  {
    '{line_index}': '1',
    '{employee_code}': 'NV001',
    '{employee_name}': 'Nguyễn Văn A',
    '{department_name}': 'Kỹ thuật',
    '{earnings}': '35,000,000',
    '{deductions}': '2,000,000',
    '{contributions}': '1,500,000',
    '{net_pay}': '31,500,000',
  },
  {
    '{line_index}': '2',
    '{employee_code}': 'NV002',
    '{employee_name}': 'Trần Thị B',
    '{department_name}': 'Kinh doanh',
    '{earnings}': '28,000,000',
    '{deductions}': '1,500,000',
    '{contributions}': '1,200,000',
    '{net_pay}': '25,300,000',
  },
  {
    '{line_index}': '3',
    '{employee_code}': 'NV003',
    '{employee_name}': 'Lê Văn C',
    '{department_name}': 'Nhân sự',
    '{earnings}': '25,000,000',
    '{deductions}': '1,200,000',
    '{contributions}': '1,000,000',
    '{net_pay}': '22,800,000',
  },
];
