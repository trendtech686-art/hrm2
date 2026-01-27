/**
 * Seed dữ liệu mẫu cho 4 tab cài đặt Nhân viên:
 * 1. Quản lý Nghỉ phép (leaveTypes)
 * 2. Lương & Phúc lợi (salaryComponents)  
 * 3. Mẫu bảng lương (payrollTemplates)
 * 4. Loại phạt nhân viên (penaltyTypes)
 * 
 * Chạy: npx tsx scripts/seed-employee-settings.ts
 */

import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// =============================================
// 1. LOẠI NGHỈ PHÉP (Leave Types)
// =============================================
const leaveTypes = [
  {
    systemId: 'LVTYPE000001',
    id: 'NP001',
    name: 'Nghỉ phép năm',
    numberOfDays: 12,
    isPaid: true,
    requiresAttachment: false,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000002',
    id: 'NP002',
    name: 'Nghỉ ốm',
    numberOfDays: 30,
    isPaid: true,
    requiresAttachment: true,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000003',
    id: 'NP003',
    name: 'Nghỉ không lương',
    numberOfDays: 365,
    isPaid: false,
    requiresAttachment: false,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000004',
    id: 'NP004',
    name: 'Nghỉ thai sản',
    numberOfDays: 180,
    isPaid: true,
    requiresAttachment: true,
    applicableGender: 'Female' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000005',
    id: 'NP005',
    name: 'Nghỉ việc riêng có lương (kết hôn, tang...)',
    numberOfDays: 3,
    isPaid: true,
    requiresAttachment: false,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000006',
    id: 'NP006',
    name: 'Nghỉ chăm con ốm',
    numberOfDays: 20,
    isPaid: true,
    requiresAttachment: true,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000007',
    id: 'NP007',
    name: 'Nghỉ bù',
    numberOfDays: 30,
    isPaid: true,
    requiresAttachment: false,
    applicableGender: 'All' as const,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'LVTYPE000008',
    id: 'NP008',
    name: 'Nghỉ phép cha khi vợ sinh',
    numberOfDays: 5,
    isPaid: true,
    requiresAttachment: true,
    applicableGender: 'Male' as const,
    applicableDepartmentSystemIds: [],
  },
];

// =============================================
// 2. THÀNH PHẦN LƯƠNG (Salary Components)
// =============================================
const salaryComponents = [
  // === THU NHẬP (earning) ===
  {
    systemId: 'SALCOMP000001',
    id: 'TL001',
    name: 'Lương cơ bản',
    description: 'Lương cơ bản theo hợp đồng',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'baseSalary',
    taxable: true,
    partOfSocialInsurance: true,
    isActive: true,
    sortOrder: 1,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000002',
    id: 'TL002',
    name: 'Phụ cấp ăn trưa',
    description: 'Phụ cấp tiền ăn hàng tháng',
    category: 'earning' as const,
    type: 'fixed' as const,
    amount: 780000,
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 2,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000003',
    id: 'TL003',
    name: 'Phụ cấp xăng xe',
    description: 'Phụ cấp đi lại hàng tháng',
    category: 'earning' as const,
    type: 'fixed' as const,
    amount: 500000,
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 3,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000004',
    id: 'TL004',
    name: 'Phụ cấp điện thoại',
    description: 'Phụ cấp liên lạc công việc',
    category: 'earning' as const,
    type: 'fixed' as const,
    amount: 200000,
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 4,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000005',
    id: 'TL005',
    name: 'Phụ cấp chức vụ',
    description: 'Phụ cấp trách nhiệm quản lý',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'positionAllowance',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 5,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000006',
    id: 'TL006',
    name: 'Phụ cấp thâm niên',
    description: 'Thưởng theo số năm làm việc',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'yearsOfService * 200000',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 6,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000007',
    id: 'TL007',
    name: 'Phụ cấp độc hại',
    description: 'Cho công việc đặc thù',
    category: 'earning' as const,
    type: 'fixed' as const,
    amount: 500000,
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 7,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000008',
    id: 'TL008',
    name: 'Thưởng chuyên cần',
    description: 'Thưởng đi làm đầy đủ không nghỉ',
    category: 'earning' as const,
    type: 'fixed' as const,
    amount: 500000,
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 8,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000009',
    id: 'TL009',
    name: 'Thưởng KPI',
    description: 'Thưởng theo kết quả công việc',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'kpiBonus',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 9,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000010',
    id: 'TL010',
    name: 'Làm thêm ngày thường',
    description: 'Tiền làm thêm giờ ngày thường (150%)',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'otHoursWeekday * hourlyRate * 1.5',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 10,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000020',
    id: 'TL020',
    name: 'Làm thêm cuối tuần',
    description: 'Tiền làm thêm giờ cuối tuần (200%)',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'otHoursWeekend * hourlyRate * 2',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 11,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000021',
    id: 'TL021',
    name: 'Làm thêm ngày lễ',
    description: 'Tiền làm thêm giờ ngày lễ (300%)',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'otHoursHoliday * hourlyRate * 3',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 12,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000011',
    id: 'TL011',
    name: 'Thưởng doanh số',
    description: 'Hoa hồng bán hàng',
    category: 'earning' as const,
    type: 'formula' as const,
    formula: 'salesCommission',
    taxable: true,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 13,
    applicableDepartmentSystemIds: [],
  },

  // === KHẤU TRỪ (deduction) ===
  {
    systemId: 'SALCOMP000012',
    id: 'TL012',
    name: 'Khấu trừ đi trễ',
    description: 'Trừ tiền đi làm muộn',
    category: 'deduction' as const,
    type: 'formula' as const,
    formula: 'latePenalty',
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 20,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000013',
    id: 'TL013',
    name: 'Khấu trừ về sớm',
    description: 'Trừ tiền về trước giờ',
    category: 'deduction' as const,
    type: 'formula' as const,
    formula: 'earlyLeavePenalty',
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 21,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000014',
    id: 'TL014',
    name: 'Tạm ứng lương',
    description: 'Khấu trừ tiền tạm ứng',
    category: 'deduction' as const,
    type: 'formula' as const,
    formula: 'salaryAdvance',
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 22,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000015',
    id: 'TL015',
    name: 'Khấu trừ kỷ luật',
    description: 'Các khoản phạt vi phạm',
    category: 'deduction' as const,
    type: 'formula' as const,
    formula: 'penaltyDeduction',
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 23,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000019',
    id: 'TL019',
    name: 'Thuế TNCN',
    description: 'Thuế thu nhập cá nhân',
    category: 'deduction' as const,
    type: 'formula' as const,
    formula: 'personalIncomeTax',
    taxable: false,
    partOfSocialInsurance: false,
    isActive: true,
    sortOrder: 24,
    applicableDepartmentSystemIds: [],
  },

  // === ĐÓNG GÓP BẢO HIỂM (contribution) ===
  {
    systemId: 'SALCOMP000016',
    id: 'TL016',
    name: 'BHXH (người lao động)',
    description: 'Bảo hiểm xã hội - phần người lao động đóng (8%)',
    category: 'contribution' as const,
    type: 'formula' as const,
    formula: 'socialInsuranceSalary * 0.08',
    taxable: false,
    partOfSocialInsurance: true,
    isActive: true,
    sortOrder: 30,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000017',
    id: 'TL017',
    name: 'BHYT (người lao động)',
    description: 'Bảo hiểm y tế - phần người lao động đóng (1.5%)',
    category: 'contribution' as const,
    type: 'formula' as const,
    formula: 'socialInsuranceSalary * 0.015',
    taxable: false,
    partOfSocialInsurance: true,
    isActive: true,
    sortOrder: 31,
    applicableDepartmentSystemIds: [],
  },
  {
    systemId: 'SALCOMP000018',
    id: 'TL018',
    name: 'BHTN (người lao động)',
    description: 'Bảo hiểm thất nghiệp - phần người lao động đóng (1%)',
    category: 'contribution' as const,
    type: 'formula' as const,
    formula: 'socialInsuranceSalary * 0.01',
    taxable: false,
    partOfSocialInsurance: true,
    isActive: true,
    sortOrder: 32,
    applicableDepartmentSystemIds: [],
  },
];

// =============================================
// 3. MẪU BẢNG LƯƠNG (Payroll Templates)
// =============================================
const payrollTemplates = [
  {
    systemId: 'PAYTPL000001',
    id: 'PT001',
    name: 'Mẫu lương cơ bản',
    description: 'Dành cho nhân viên thử việc hoặc lương đơn giản',
    componentSystemIds: ['SALCOMP000001'],
    isDefault: false,
  },
  {
    systemId: 'PAYTPL000002',
    id: 'PT002',
    name: 'Mẫu lương nhân viên văn phòng',
    description: 'Dành cho nhân viên văn phòng với đầy đủ phụ cấp',
    componentSystemIds: [
      'SALCOMP000001', // Lương cơ bản
      'SALCOMP000002', // Phụ cấp ăn trưa
      'SALCOMP000003', // Phụ cấp xăng xe
      'SALCOMP000004', // Phụ cấp điện thoại
      'SALCOMP000006', // Phụ cấp thâm niên
      'SALCOMP000008', // Thưởng chuyên cần
      'SALCOMP000009', // Thưởng KPI
      'SALCOMP000010', // Làm thêm ngày thường
      'SALCOMP000020', // Làm thêm cuối tuần
      'SALCOMP000021', // Làm thêm ngày lễ
      'SALCOMP000012', // Khấu trừ đi trễ
      'SALCOMP000014', // Tạm ứng lương
      'SALCOMP000016', // BHXH
      'SALCOMP000017', // BHYT
      'SALCOMP000018', // BHTN
      'SALCOMP000019', // Thuế TNCN
    ],
    isDefault: true,
  },
  {
    systemId: 'PAYTPL000003',
    id: 'PT003',
    name: 'Mẫu lương quản lý',
    description: 'Dành cho cấp quản lý với phụ cấp chức vụ',
    componentSystemIds: [
      'SALCOMP000001', // Lương cơ bản
      'SALCOMP000002', // Phụ cấp ăn trưa
      'SALCOMP000003', // Phụ cấp xăng xe
      'SALCOMP000004', // Phụ cấp điện thoại
      'SALCOMP000005', // Phụ cấp chức vụ
      'SALCOMP000006', // Phụ cấp thâm niên
      'SALCOMP000008', // Thưởng chuyên cần
      'SALCOMP000009', // Thưởng KPI
      'SALCOMP000010', // Làm thêm ngày thường
      'SALCOMP000020', // Làm thêm cuối tuần
      'SALCOMP000021', // Làm thêm ngày lễ
      'SALCOMP000014', // Tạm ứng lương
      'SALCOMP000016', // BHXH
      'SALCOMP000017', // BHYT
      'SALCOMP000018', // BHTN
      'SALCOMP000019', // Thuế TNCN
    ],
    isDefault: false,
  },
  {
    systemId: 'PAYTPL000004',
    id: 'PT004',
    name: 'Mẫu lương kinh doanh',
    description: 'Dành cho nhân viên sales với thưởng doanh số',
    componentSystemIds: [
      'SALCOMP000001', // Lương cơ bản
      'SALCOMP000002', // Phụ cấp ăn trưa
      'SALCOMP000003', // Phụ cấp xăng xe
      'SALCOMP000004', // Phụ cấp điện thoại
      'SALCOMP000006', // Phụ cấp thâm niên
      'SALCOMP000008', // Thưởng chuyên cần
      'SALCOMP000009', // Thưởng KPI
      'SALCOMP000011', // Thưởng doanh số
      'SALCOMP000010', // Làm thêm ngày thường
      'SALCOMP000012', // Khấu trừ đi trễ
      'SALCOMP000014', // Tạm ứng lương
      'SALCOMP000016', // BHXH
      'SALCOMP000017', // BHYT
      'SALCOMP000018', // BHTN
      'SALCOMP000019', // Thuế TNCN
    ],
    isDefault: false,
  },
  {
    systemId: 'PAYTPL000005',
    id: 'PT005',
    name: 'Mẫu lương kho vận',
    description: 'Dành cho nhân viên kho với phụ cấp độc hại',
    componentSystemIds: [
      'SALCOMP000001', // Lương cơ bản
      'SALCOMP000002', // Phụ cấp ăn trưa
      'SALCOMP000003', // Phụ cấp xăng xe
      'SALCOMP000007', // Phụ cấp độc hại
      'SALCOMP000006', // Phụ cấp thâm niên
      'SALCOMP000008', // Thưởng chuyên cần
      'SALCOMP000010', // Làm thêm ngày thường
      'SALCOMP000020', // Làm thêm cuối tuần
      'SALCOMP000021', // Làm thêm ngày lễ
      'SALCOMP000012', // Khấu trừ đi trễ
      'SALCOMP000014', // Tạm ứng lương
      'SALCOMP000016', // BHXH
      'SALCOMP000017', // BHYT
      'SALCOMP000018', // BHTN
      'SALCOMP000019', // Thuế TNCN
    ],
    isDefault: false,
  },
];

// =============================================
// 4. LOẠI PHẠT NHÂN VIÊN (Penalty Types)
// =============================================
const penaltyTypes = [
  // === CHẤM CÔNG ===
  {
    systemId: 'PENTYPE000001',
    id: 'PHAT001',
    name: 'Đi muộn dưới 10 phút',
    description: 'Đi làm muộn từ 5-10 phút',
    defaultAmount: 20000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 1,
  },
  {
    systemId: 'PENTYPE000002',
    id: 'PHAT002',
    name: 'Đi muộn 10-30 phút',
    description: 'Đi làm muộn từ 10-30 phút',
    defaultAmount: 50000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 2,
  },
  {
    systemId: 'PENTYPE000003',
    id: 'PHAT003',
    name: 'Đi muộn trên 30 phút',
    description: 'Đi làm muộn trên 30 phút',
    defaultAmount: 100000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 3,
  },
  {
    systemId: 'PENTYPE000004',
    id: 'PHAT004',
    name: 'Về sớm không phép',
    description: 'Về trước giờ quy định không xin phép',
    defaultAmount: 50000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 4,
  },
  {
    systemId: 'PENTYPE000005',
    id: 'PHAT005',
    name: 'Nghỉ không phép',
    description: 'Nghỉ làm không báo trước, không lý do',
    defaultAmount: 200000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 5,
  },
  {
    systemId: 'PENTYPE000006',
    id: 'PHAT006',
    name: 'Quên chấm công',
    description: 'Không chấm công khi vào/ra',
    defaultAmount: 30000,
    category: 'attendance' as const,
    isActive: true,
    sortOrder: 6,
  },

  // === KHIẾU NẠI ===
  {
    systemId: 'PENTYPE000007',
    id: 'PHAT007',
    name: 'Đóng gói sai hàng',
    description: 'Gửi sai sản phẩm cho khách',
    defaultAmount: 100000,
    category: 'complaint' as const,
    isActive: true,
    sortOrder: 10,
  },
  {
    systemId: 'PENTYPE000008',
    id: 'PHAT008',
    name: 'Thiếu hàng trong đơn',
    description: 'Đóng thiếu sản phẩm trong đơn hàng',
    defaultAmount: 50000,
    category: 'complaint' as const,
    isActive: true,
    sortOrder: 11,
  },
  {
    systemId: 'PENTYPE000009',
    id: 'PHAT009',
    name: 'Đóng gói không đúng quy cách',
    description: 'Đóng gói không theo tiêu chuẩn',
    defaultAmount: 30000,
    category: 'complaint' as const,
    isActive: true,
    sortOrder: 12,
  },
  {
    systemId: 'PENTYPE000010',
    id: 'PHAT010',
    name: 'Hàng hư hỏng do kho',
    description: 'Sản phẩm hư do bảo quản sai',
    defaultAmount: 0,
    category: 'complaint' as const,
    isActive: true,
    sortOrder: 13,
  },
  {
    systemId: 'PENTYPE000011',
    id: 'PHAT011',
    name: 'Phàn nàn dịch vụ khách hàng',
    description: 'Khách hàng không hài lòng về thái độ phục vụ',
    defaultAmount: 100000,
    category: 'complaint' as const,
    isActive: true,
    sortOrder: 14,
  },

  // === HIỆU SUẤT ===
  {
    systemId: 'PENTYPE000012',
    id: 'PHAT012',
    name: 'Không hoàn thành KPI',
    description: 'Không đạt chỉ tiêu công việc được giao',
    defaultAmount: 0,
    category: 'performance' as const,
    isActive: true,
    sortOrder: 20,
  },
  {
    systemId: 'PENTYPE000013',
    id: 'PHAT013',
    name: 'Làm việc cá nhân trong giờ',
    description: 'Sử dụng thời gian làm việc cho mục đích cá nhân',
    defaultAmount: 50000,
    category: 'performance' as const,
    isActive: true,
    sortOrder: 21,
  },
  {
    systemId: 'PENTYPE000014',
    id: 'PHAT014',
    name: 'Báo cáo chậm trễ',
    description: 'Nộp báo cáo không đúng deadline',
    defaultAmount: 30000,
    category: 'performance' as const,
    isActive: true,
    sortOrder: 22,
  },

  // === KHÁC ===
  {
    systemId: 'PENTYPE000015',
    id: 'PHAT015',
    name: 'Vi phạm quy định trang phục',
    description: 'Không mặc đồng phục hoặc trang phục không phù hợp',
    defaultAmount: 20000,
    category: 'other' as const,
    isActive: true,
    sortOrder: 30,
  },
  {
    systemId: 'PENTYPE000016',
    id: 'PHAT016',
    name: 'Hút thuốc sai nơi quy định',
    description: 'Hút thuốc trong khu vực cấm',
    defaultAmount: 50000,
    category: 'other' as const,
    isActive: true,
    sortOrder: 31,
  },
  {
    systemId: 'PENTYPE000017',
    id: 'PHAT017',
    name: 'Để lộ thông tin công ty',
    description: 'Tiết lộ thông tin nội bộ ra bên ngoài',
    defaultAmount: 500000,
    category: 'other' as const,
    isActive: true,
    sortOrder: 32,
  },
  {
    systemId: 'PENTYPE000018',
    id: 'PHAT018',
    name: 'Gây mất đoàn kết',
    description: 'Hành vi gây chia rẽ trong team',
    defaultAmount: 100000,
    category: 'other' as const,
    isActive: true,
    sortOrder: 33,
  },
];

// =============================================
// MAIN SEED FUNCTION
// =============================================
async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu Employee Settings...\n');

  // 1. Seed Employee Settings (leaveTypes, salaryComponents)
  console.log('📝 Đang cập nhật Employee Settings (leaveTypes, salaryComponents)...');
  
  const employeeSettingsValue = {
    workStartTime: '08:30',
    workEndTime: '18:00',
    lunchBreakDuration: 90,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:30',
    workingDays: [1, 2, 3, 4, 5, 6],
    workShifts: [],
    otHourlyRate: 25000,
    otRateWeekend: 1.5,
    otRateHoliday: 3,
    allowedLateMinutes: 5,
    latePenaltyTiers: [
      { fromMinutes: 5, toMinutes: 10, amount: 20000 },
      { fromMinutes: 10, toMinutes: 30, amount: 50000 },
      { fromMinutes: 30, toMinutes: 60, amount: 100000 },
      { fromMinutes: 60, toMinutes: null, amount: 200000 },
    ],
    earlyLeavePenaltyTiers: [
      { fromMinutes: 5, toMinutes: 10, amount: 20000 },
      { fromMinutes: 10, toMinutes: 30, amount: 50000 },
      { fromMinutes: 30, toMinutes: 60, amount: 100000 },
      { fromMinutes: 60, toMinutes: null, amount: 200000 },
    ],
    leaveTypes: leaveTypes,
    baseAnnualLeaveDays: 12,
    annualLeaveSeniorityBonus: {
      years: 5,
      additionalDays: 1,
    },
    allowRollover: true,
    rolloverExpirationDate: '03-31',
    salaryComponents: salaryComponents,
    payrollCycle: 'monthly',
    payday: 5,
    payrollLockDate: 5,
    insuranceRates: {
      socialInsurance: { employeeRate: 8, employerRate: 17.5 },
      healthInsurance: { employeeRate: 1.5, employerRate: 3 },
      unemploymentInsurance: { employeeRate: 1, employerRate: 1 },
      insuranceSalaryCap: 46800000,
      baseSalaryReference: 2340000,
    },
    taxSettings: {
      personalDeduction: 11000000,
      dependentDeduction: 4400000,
      taxBrackets: [
        { fromAmount: 0, toAmount: 5000000, rate: 5 },
        { fromAmount: 5000000, toAmount: 10000000, rate: 10 },
        { fromAmount: 10000000, toAmount: 18000000, rate: 15 },
        { fromAmount: 18000000, toAmount: 32000000, rate: 20 },
        { fromAmount: 32000000, toAmount: 52000000, rate: 25 },
        { fromAmount: 52000000, toAmount: 80000000, rate: 30 },
        { fromAmount: 80000000, toAmount: null, rate: 35 },
      ],
    },
    minimumWage: {
      region1: 4960000,
      region2: 4410000,
      region3: 3860000,
      region4: 3450000,
    },
    standardWorkDays: 26,
    mealAllowancePerDay: 30000,
  };

  await prisma.setting.upsert({
    where: {
      key_group: {
        key: 'employee-settings',
        group: 'hrm',
      },
    },
    update: {
      value: employeeSettingsValue,
      updatedAt: new Date(),
    },
    create: {
      systemId: `SET_EMP_${Date.now()}`,
      key: 'employee-settings',
      group: 'hrm',
      type: 'json',
      category: 'hrm',
      value: employeeSettingsValue,
      description: 'Employee management settings',
    },
  });
  console.log(`  ✅ Employee Settings: ${leaveTypes.length} loại nghỉ phép, ${salaryComponents.length} thành phần lương`);

  // 2. Seed Penalty Types
  console.log('\n📝 Đang seed Loại phạt nhân viên...');
  for (const penaltyType of penaltyTypes) {
    await prisma.penaltyTypeSetting.upsert({
      where: { systemId: penaltyType.systemId },
      update: {
        id: penaltyType.id,
        name: penaltyType.name,
        description: penaltyType.description,
        defaultAmount: penaltyType.defaultAmount,
        category: penaltyType.category,
        isActive: penaltyType.isActive,
        sortOrder: penaltyType.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        systemId: penaltyType.systemId,
        id: penaltyType.id,
        name: penaltyType.name,
        description: penaltyType.description,
        defaultAmount: penaltyType.defaultAmount,
        category: penaltyType.category,
        isActive: penaltyType.isActive,
        sortOrder: penaltyType.sortOrder,
      },
    });
  }
  console.log(`  ✅ Penalty Types: ${penaltyTypes.length} loại phạt`);

  // 3. Seed Payroll Templates - Lưu vào Setting table dạng JSON
  console.log('\n📝 Đang seed Mẫu bảng lương...');
  await prisma.setting.upsert({
    where: {
      key_group: {
        key: 'payroll-templates',
        group: 'hrm',
      },
    },
    update: {
      value: payrollTemplates,
      updatedAt: new Date(),
    },
    create: {
      systemId: `SET_PAYTPL_${Date.now()}`,
      key: 'payroll-templates',
      group: 'hrm',
      type: 'json',
      category: 'hrm',
      value: payrollTemplates,
      description: 'Payroll templates configuration',
    },
  });
  console.log(`  ✅ Payroll Templates: ${payrollTemplates.length} mẫu bảng lương`);

  console.log('\n✨ Seed hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Tổng kết:');
  console.log(`  📋 Loại nghỉ phép: ${leaveTypes.length}`);
  console.log(`  💰 Thành phần lương: ${salaryComponents.length}`);
  console.log(`  📄 Mẫu bảng lương: ${payrollTemplates.length}`);
  console.log(`  ⚠️  Loại phạt: ${penaltyTypes.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
