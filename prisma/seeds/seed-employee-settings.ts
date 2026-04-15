/**
 * Employee Settings Seed
 * Seed data for employee-related settings:
 * - JobTitle (Chức vụ)
 * - Department (Phòng ban)
 * - EmployeeTypeSetting (Loại nhân viên)
 * - PenaltyTypeSetting (Loại phạt)
 * - SettingsData for:
 *   + Attendance & Time (Chấm công & Thời gian)
 *   + Leave Types (Nghỉ phép)
 *   + Salary & Benefits (Lương & Phúc lợi)
 *   + Insurance & Tax (Bảo hiểm & Thuế)
 *   + Salary Templates (Mẫu bảng lương)
 * 
 * Updated for Vietnam Labor Law 2026
 * - Nghị định 74/2024/NĐ-CP: Lương tối thiểu vùng 2024 (effective from 1/7/2024)
 * - Thông tư 06/2021/TT-BLĐTBXH: Bảo hiểm xã hội
 * - Nghị quyết 954/2020/UBTVQH14: Thuế TNCN
 * 
 * Run: npx tsx prisma/seeds/seed-employee-settings.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// JOB TITLES (Chức vụ) - Common positions in Vietnamese companies
// ============================================================================
const jobTitles = [
  // C-Level / Ban Giám đốc
  { id: 'CEO', name: 'Tổng Giám đốc', description: 'Chief Executive Officer - Người đứng đầu điều hành công ty' },
  { id: 'CFO', name: 'Giám đốc Tài chính', description: 'Chief Financial Officer - Phụ trách tài chính và kế toán' },
  { id: 'CTO', name: 'Giám đốc Công nghệ', description: 'Chief Technology Officer - Phụ trách công nghệ và kỹ thuật' },
  { id: 'COO', name: 'Giám đốc Vận hành', description: 'Chief Operating Officer - Phụ trách vận hành' },
  { id: 'CMO', name: 'Giám đốc Marketing', description: 'Chief Marketing Officer - Phụ trách marketing' },
  { id: 'CHRO', name: 'Giám đốc Nhân sự', description: 'Chief Human Resources Officer - Phụ trách nhân sự' },
  
  // Director / Giám đốc
  { id: 'GD', name: 'Giám đốc', description: 'Giám đốc điều hành' },
  { id: 'PGD', name: 'Phó Giám đốc', description: 'Phó Giám đốc' },
  { id: 'GDCN', name: 'Giám đốc Chi nhánh', description: 'Giám đốc phụ trách chi nhánh' },
  
  // Manager / Quản lý
  { id: 'TP', name: 'Trưởng phòng', description: 'Trưởng phòng ban' },
  { id: 'PTP', name: 'Phó Trưởng phòng', description: 'Phó trưởng phòng ban' },
  { id: 'TN', name: 'Trưởng nhóm', description: 'Team Leader - Trưởng nhóm làm việc' },
  { id: 'QL', name: 'Quản lý', description: 'Quản lý chung' },
  { id: 'QLCH', name: 'Quản lý Cửa hàng', description: 'Store Manager - Quản lý cửa hàng' },
  { id: 'QLKHO', name: 'Quản lý Kho', description: 'Warehouse Manager - Quản lý kho hàng' },
  
  // Supervisor / Giám sát
  { id: 'GS', name: 'Giám sát', description: 'Supervisor - Giám sát công việc' },
  { id: 'GSBH', name: 'Giám sát Bán hàng', description: 'Sales Supervisor - Giám sát bán hàng' },
  
  // Specialist / Chuyên viên
  { id: 'CV', name: 'Chuyên viên', description: 'Specialist - Chuyên viên' },
  { id: 'CVCC', name: 'Chuyên viên Cao cấp', description: 'Senior Specialist - Chuyên viên cao cấp' },
  { id: 'CVKT', name: 'Chuyên viên Kỹ thuật', description: 'Technical Specialist - Chuyên viên kỹ thuật' },
  { id: 'CVNS', name: 'Chuyên viên Nhân sự', description: 'HR Specialist - Chuyên viên nhân sự' },
  { id: 'CVMKT', name: 'Chuyên viên Marketing', description: 'Marketing Specialist - Chuyên viên marketing' },
  
  // Staff / Nhân viên
  { id: 'NV', name: 'Nhân viên', description: 'Staff - Nhân viên' },
  { id: 'NVBH', name: 'Nhân viên Bán hàng', description: 'Sales Staff - Nhân viên bán hàng' },
  { id: 'NVKHO', name: 'Nhân viên Kho', description: 'Warehouse Staff - Nhân viên kho' },
  { id: 'NVKT', name: 'Nhân viên Kế toán', description: 'Accountant - Nhân viên kế toán' },
  { id: 'NVHC', name: 'Nhân viên Hành chính', description: 'Admin Staff - Nhân viên hành chính' },
  { id: 'NVIT', name: 'Nhân viên IT', description: 'IT Staff - Nhân viên công nghệ thông tin' },
  { id: 'NVBV', name: 'Nhân viên Bảo vệ', description: 'Security Staff - Nhân viên bảo vệ' },
  { id: 'NVVC', name: 'Nhân viên Vận chuyển', description: 'Delivery Staff - Nhân viên giao hàng' },
  { id: 'NVKH', name: 'Nhân viên Kỹ thuật', description: 'Technician - Nhân viên kỹ thuật' },
  { id: 'NVCSKH', name: 'Nhân viên CSKH', description: 'Customer Service - Nhân viên chăm sóc khách hàng' },
  
  // Assistant / Trợ lý
  { id: 'TL', name: 'Trợ lý', description: 'Assistant - Trợ lý' },
  { id: 'TLGD', name: 'Trợ lý Giám đốc', description: 'Executive Assistant - Trợ lý giám đốc' },
  
  // Intern / Thực tập sinh
  { id: 'TTS', name: 'Thực tập sinh', description: 'Intern - Thực tập sinh' },
  { id: 'CTV', name: 'Cộng tác viên', description: 'Collaborator - Cộng tác viên' },
];

// ============================================================================
// DEPARTMENTS (Phòng ban) - Standard departments in Vietnamese companies
// ============================================================================
const departments = [
  // Executive
  { id: 'BGD', name: 'Ban Giám đốc', description: 'Board of Directors - Hội đồng quản trị và ban điều hành' },
  
  // Core Operations
  { id: 'KD', name: 'Phòng Kinh doanh', description: 'Sales Department - Phòng bán hàng và kinh doanh' },
  { id: 'MKT', name: 'Phòng Marketing', description: 'Marketing Department - Phòng marketing và truyền thông' },
  { id: 'KT', name: 'Phòng Kế toán', description: 'Accounting Department - Phòng kế toán tài chính' },
  { id: 'NS', name: 'Phòng Nhân sự', description: 'HR Department - Phòng quản trị nhân sự' },
  { id: 'HC', name: 'Phòng Hành chính', description: 'Admin Department - Phòng hành chính tổng hợp' },
  
  // Technical & IT
  { id: 'IT', name: 'Phòng Công nghệ', description: 'IT Department - Phòng công nghệ thông tin' },
  { id: 'KTCN', name: 'Phòng Kỹ thuật', description: 'Technical Department - Phòng kỹ thuật' },
  { id: 'RD', name: 'Phòng R&D', description: 'R&D Department - Phòng nghiên cứu và phát triển' },
  
  // Operations
  { id: 'KHO', name: 'Phòng Kho vận', description: 'Warehouse Department - Phòng kho và vận chuyển' },
  { id: 'SX', name: 'Phòng Sản xuất', description: 'Production Department - Phòng sản xuất' },
  { id: 'QLCL', name: 'Phòng Quản lý Chất lượng', description: 'QC Department - Phòng kiểm soát chất lượng' },
  { id: 'MH', name: 'Phòng Mua hàng', description: 'Procurement Department - Phòng thu mua' },
  
  // Customer Facing
  { id: 'CSKH', name: 'Phòng Chăm sóc Khách hàng', description: 'Customer Service Department - Phòng CSKH' },
  { id: 'BH', name: 'Phòng Bảo hành', description: 'Warranty Department - Phòng bảo hành sửa chữa' },
  
  // Support
  { id: 'PL', name: 'Phòng Pháp lý', description: 'Legal Department - Phòng pháp chế' },
  { id: 'DA', name: 'Phòng Dự án', description: 'Project Department - Phòng quản lý dự án' },
];

// ============================================================================
// EMPLOYEE TYPES (Loại nhân viên) - Based on Vietnam Labor Code 2019 (updated 2026)
// ============================================================================
const employeeTypes = [
  { 
    id: 'FULLTIME', 
    name: 'Nhân viên Chính thức', 
    description: 'Nhân viên toàn thời gian, hợp đồng lao động không xác định thời hạn hoặc xác định thời hạn',
    color: '#22c55e', // green
    isDefault: true,
    sortOrder: 1,
  },
  { 
    id: 'PARTTIME', 
    name: 'Nhân viên Bán thời gian', 
    description: 'Làm việc dưới 8 giờ/ngày hoặc dưới 48 giờ/tuần theo Điều 32 Bộ luật Lao động',
    color: '#3b82f6', // blue
    isDefault: false,
    sortOrder: 2,
  },
  { 
    id: 'CONTRACT', 
    name: 'Nhân viên Hợp đồng', 
    description: 'Hợp đồng lao động xác định thời hạn (tối đa 36 tháng theo Điều 20 BLLĐ 2019)',
    color: '#f59e0b', // amber
    isDefault: false,
    sortOrder: 3,
  },
  { 
    id: 'PROBATION', 
    name: 'Nhân viên Thử việc', 
    description: 'Đang trong thời gian thử việc (tối đa 180 ngày với quản lý, 60 ngày với chuyên môn, 30 ngày với lao động phổ thông)',
    color: '#8b5cf6', // purple
    isDefault: false,
    sortOrder: 4,
  },
  { 
    id: 'INTERN', 
    name: 'Thực tập sinh', 
    description: 'Sinh viên/Học viên thực tập tại doanh nghiệp',
    color: '#06b6d4', // cyan
    isDefault: false,
    sortOrder: 5,
  },
  { 
    id: 'SEASONAL', 
    name: 'Nhân viên Thời vụ', 
    description: 'Làm việc theo mùa vụ hoặc công việc có tính chất tạm thời dưới 12 tháng',
    color: '#f97316', // orange
    isDefault: false,
    sortOrder: 6,
  },
  { 
    id: 'FREELANCE', 
    name: 'Cộng tác viên', 
    description: 'Làm việc tự do, hợp đồng dịch vụ hoặc hợp đồng khoán việc',
    color: '#ec4899', // pink
    isDefault: false,
    sortOrder: 7,
  },
  { 
    id: 'REMOTE', 
    name: 'Nhân viên Làm việc Từ xa', 
    description: 'Làm việc từ xa (remote) theo thỏa thuận với người sử dụng lao động',
    color: '#14b8a6', // teal
    isDefault: false,
    sortOrder: 8,
  },
];

// ============================================================================
// PENALTY TYPES (Loại phạt) - Based on Vietnam Labor Code 2019 (updated 2026)
// ============================================================================
const penaltyTypes = [
  // Attendance violations - Vi phạm chấm công
  { 
    id: 'LATE', 
    name: 'Đi muộn', 
    description: 'Vi phạm giờ làm việc - đi muộn dưới 30 phút',
    defaultAmount: 50000,
    category: 'attendance',
    sortOrder: 1,
  },
  { 
    id: 'LATE_SEVERE', 
    name: 'Đi muộn nghiêm trọng', 
    description: 'Vi phạm giờ làm việc - đi muộn trên 30 phút',
    defaultAmount: 100000,
    category: 'attendance',
    sortOrder: 2,
  },
  { 
    id: 'EARLY_LEAVE', 
    name: 'Về sớm', 
    description: 'Vi phạm giờ làm việc - về sớm không phép',
    defaultAmount: 50000,
    category: 'attendance',
    sortOrder: 3,
  },
  { 
    id: 'ABSENT', 
    name: 'Nghỉ không phép', 
    description: 'Vắng mặt không có lý do chính đáng hoặc không xin phép',
    defaultAmount: 200000,
    category: 'attendance',
    sortOrder: 4,
  },
  { 
    id: 'NO_CHECKOUT', 
    name: 'Không chấm công ra', 
    description: 'Quên chấm công khi ra về',
    defaultAmount: 30000,
    category: 'attendance',
    sortOrder: 5,
  },
  
  // Performance violations - Vi phạm công việc
  { 
    id: 'TASK_DELAY', 
    name: 'Chậm tiến độ', 
    description: 'Không hoàn thành công việc đúng thời hạn cam kết',
    defaultAmount: 100000,
    category: 'performance',
    sortOrder: 10,
  },
  { 
    id: 'QUALITY_ISSUE', 
    name: 'Lỗi chất lượng', 
    description: 'Sản phẩm/Công việc không đạt yêu cầu chất lượng',
    defaultAmount: 150000,
    category: 'performance',
    sortOrder: 11,
  },
  { 
    id: 'NEGLIGENCE', 
    name: 'Thiếu trách nhiệm', 
    description: 'Không hoàn thành nhiệm vụ được giao do thiếu trách nhiệm',
    defaultAmount: 200000,
    category: 'performance',
    sortOrder: 12,
  },
  
  // Complaint-related - Vi phạm từ khiếu nại
  { 
    id: 'CUSTOMER_COMPLAINT', 
    name: 'Khiếu nại từ khách hàng', 
    description: 'Bị khách hàng khiếu nại về thái độ hoặc chất lượng phục vụ',
    defaultAmount: 100000,
    category: 'complaint',
    sortOrder: 20,
  },
  { 
    id: 'SERVICE_ERROR', 
    name: 'Lỗi dịch vụ', 
    description: 'Sai sót trong quá trình phục vụ khách hàng',
    defaultAmount: 150000,
    category: 'complaint',
    sortOrder: 21,
  },
  { 
    id: 'DAMAGE_GOODS', 
    name: 'Làm hư hỏng hàng hóa', 
    description: 'Gây hư hỏng hàng hóa do bất cẩn hoặc không tuân thủ quy trình',
    defaultAmount: 0, // Based on actual damage
    category: 'complaint',
    sortOrder: 22,
  },
  
  // Other violations - Vi phạm khác
  { 
    id: 'DRESS_CODE', 
    name: 'Vi phạm đồng phục', 
    description: 'Không mặc đồng phục hoặc trang phục không phù hợp',
    defaultAmount: 50000,
    category: 'other',
    sortOrder: 30,
  },
  { 
    id: 'POLICY_VIOLATION', 
    name: 'Vi phạm nội quy', 
    description: 'Vi phạm nội quy, quy định của công ty',
    defaultAmount: 100000,
    category: 'other',
    sortOrder: 31,
  },
  { 
    id: 'SAFETY_VIOLATION', 
    name: 'Vi phạm an toàn lao động', 
    description: 'Vi phạm quy định về an toàn lao động và vệ sinh công nghiệp',
    defaultAmount: 200000,
    category: 'other',
    sortOrder: 32,
  },
  { 
    id: 'CONFIDENTIAL_BREACH', 
    name: 'Vi phạm bảo mật', 
    description: 'Tiết lộ thông tin bảo mật của công ty',
    defaultAmount: 500000,
    category: 'other',
    sortOrder: 33,
  },
  { 
    id: 'EQUIPMENT_MISUSE', 
    name: 'Sử dụng sai thiết bị', 
    description: 'Sử dụng thiết bị công ty không đúng mục đích',
    defaultAmount: 100000,
    category: 'other',
    sortOrder: 34,
  },
];

// ============================================================================
// LEAVE TYPES (Loại nghỉ phép) - Based on Vietnam Labor Code 2019
// Điều 113-116 Bộ luật Lao động 2019
// ============================================================================
const leaveTypes = [
  // Nghỉ phép năm (Điều 113 BLLĐ)
  { 
    id: 'ANNUAL', 
    name: 'Nghỉ phép năm', 
    description: 'Nghỉ phép hàng năm (12 ngày/năm, tăng 1 ngày cho mỗi 5 năm thâm niên)',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      requiresApproval: true,
      maxDaysPerYear: 12,
      carryOver: true,
      maxCarryOverDays: 5,
      advanceNotice: 3, // days
      color: '#22c55e',
    },
    sortOrder: 1,
    isDefault: true,
  },
  // Nghỉ ốm (Điều 115 BLLĐ + Luật BHXH)
  { 
    id: 'SICK', 
    name: 'Nghỉ ốm', 
    description: 'Nghỉ do ốm đau (có giấy xác nhận của cơ sở y tế). Được hưởng 75% lương từ BHXH.',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'BHXH',
      paidPercent: 75,
      requiresApproval: true,
      requiresDocument: true,
      documentType: 'Giấy nghỉ ốm từ cơ sở y tế',
      maxDaysPerYear: 30, // Tùy theo thâm niên đóng BHXH
      color: '#f97316',
    },
    sortOrder: 2,
  },
  // Nghỉ thai sản (Điều 139 BLLĐ)
  { 
    id: 'MATERNITY', 
    name: 'Nghỉ thai sản', 
    description: 'Nghỉ sinh con (6 tháng cho nữ, 5-14 ngày cho nam). Được hưởng 100% lương từ BHXH.',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'BHXH',
      paidPercent: 100,
      requiresApproval: true,
      requiresDocument: true,
      documentType: 'Giấy khai sinh hoặc giấy chứng sinh',
      maxDaysPerYear: 180, // 6 tháng cho nữ
      genderSpecific: true,
      color: '#ec4899',
    },
    sortOrder: 3,
  },
  // Nghỉ việc riêng có lương (Điều 115 BLLĐ)
  { 
    id: 'PERSONAL_PAID', 
    name: 'Nghỉ việc riêng có lương', 
    description: 'Kết hôn (3 ngày), con kết hôn (1 ngày), bố mẹ/vợ chồng/con mất (3 ngày)',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'company',
      paidPercent: 100,
      requiresApproval: true,
      requiresDocument: true,
      events: [
        { name: 'Kết hôn', days: 3 },
        { name: 'Con kết hôn', days: 1 },
        { name: 'Tang (bố/mẹ/vợ/chồng/con)', days: 3 },
      ],
      color: '#8b5cf6',
    },
    sortOrder: 4,
  },
  // Nghỉ không lương
  { 
    id: 'UNPAID', 
    name: 'Nghỉ không lương', 
    description: 'Nghỉ theo thỏa thuận với người sử dụng lao động, không hưởng lương',
    type: 'leave_type',
    metadata: {
      isPaid: false,
      requiresApproval: true,
      advanceNotice: 7,
      color: '#6b7280',
    },
    sortOrder: 5,
  },
  // Nghỉ bù
  { 
    id: 'COMP', 
    name: 'Nghỉ bù', 
    description: 'Nghỉ bù cho ngày làm thêm giờ hoặc ngày lễ đã làm việc',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'company',
      paidPercent: 100,
      requiresApproval: true,
      color: '#06b6d4',
    },
    sortOrder: 6,
  },
  // Nghỉ công tác
  { 
    id: 'BUSINESS', 
    name: 'Đi công tác', 
    description: 'Đi công tác theo yêu cầu của công ty',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'company',
      paidPercent: 100,
      requiresApproval: true,
      hasAllowance: true,
      color: '#3b82f6',
    },
    sortOrder: 7,
  },
  // Nghỉ học tập
  { 
    id: 'TRAINING', 
    name: 'Nghỉ đào tạo', 
    description: 'Nghỉ tham gia khóa đào tạo, bồi dưỡng nghiệp vụ',
    type: 'leave_type',
    metadata: {
      isPaid: true,
      paidBy: 'company',
      paidPercent: 100,
      requiresApproval: true,
      color: '#14b8a6',
    },
    sortOrder: 8,
  },
];

// ============================================================================
// ATTENDANCE SETTINGS (Cài đặt chấm công) 
// Based on Vietnam Labor Code 2019 (Điều 105-108)
// ============================================================================
const attendanceSettings = [
  // Work schedules
  { 
    id: 'SCHEDULE_OFFICE', 
    name: 'Ca hành chính', 
    description: 'Giờ làm việc hành chính: 8:00 - 17:00 (nghỉ trưa 12:00 - 13:00)',
    type: 'work_schedule',
    metadata: {
      startTime: '08:00',
      endTime: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      workHours: 8,
      workDays: ['T2', 'T3', 'T4', 'T5', 'T6'],
    },
    sortOrder: 1,
    isDefault: true,
  },
  { 
    id: 'SCHEDULE_MORNING', 
    name: 'Ca sáng', 
    description: 'Ca làm việc sáng: 6:00 - 14:00',
    type: 'work_schedule',
    metadata: {
      startTime: '06:00',
      endTime: '14:00',
      breakStart: '10:00',
      breakEnd: '10:30',
      workHours: 8,
    },
    sortOrder: 2,
  },
  { 
    id: 'SCHEDULE_AFTERNOON', 
    name: 'Ca chiều', 
    description: 'Ca làm việc chiều: 14:00 - 22:00',
    type: 'work_schedule',
    metadata: {
      startTime: '14:00',
      endTime: '22:00',
      breakStart: '18:00',
      breakEnd: '18:30',
      workHours: 8,
    },
    sortOrder: 3,
  },
  { 
    id: 'SCHEDULE_NIGHT', 
    name: 'Ca đêm', 
    description: 'Ca làm việc đêm: 22:00 - 6:00 (hưởng phụ cấp đêm 30%)',
    type: 'work_schedule',
    metadata: {
      startTime: '22:00',
      endTime: '06:00',
      workHours: 8,
      nightShiftAllowance: 0.3, // 30% theo Điều 98 BLLĐ
    },
    sortOrder: 4,
  },
  { 
    id: 'SCHEDULE_RETAIL', 
    name: 'Ca bán lẻ', 
    description: 'Giờ làm việc bán lẻ: 9:00 - 21:00 (theo ca)',
    type: 'work_schedule',
    metadata: {
      startTime: '09:00',
      endTime: '21:00',
      breakDuration: 60,
      workHours: 8,
      isShiftBased: true,
    },
    sortOrder: 5,
  },
  
  // Overtime rates - Theo Điều 98 BLLĐ 2019
  { 
    id: 'OT_WEEKDAY', 
    name: 'Tăng ca ngày thường', 
    description: 'Hệ số lương làm thêm giờ vào ngày thường (150%)',
    type: 'overtime_rate',
    metadata: {
      rate: 1.5,
      maxHoursPerDay: 4, // Điều 107: Không quá 50% số giờ làm việc bình thường trong 1 ngày
      maxHoursPerMonth: 40, // Điều 107: Không quá 40 giờ/tháng
    },
    sortOrder: 10,
    isDefault: true,
  },
  { 
    id: 'OT_WEEKEND', 
    name: 'Tăng ca cuối tuần', 
    description: 'Hệ số lương làm thêm giờ vào ngày nghỉ hàng tuần (200%)',
    type: 'overtime_rate',
    metadata: {
      rate: 2.0,
      maxHoursPerDay: 8,
    },
    sortOrder: 11,
  },
  { 
    id: 'OT_HOLIDAY', 
    name: 'Tăng ca ngày lễ', 
    description: 'Hệ số lương làm thêm giờ vào ngày lễ, Tết (300%)',
    type: 'overtime_rate',
    metadata: {
      rate: 3.0,
      maxHoursPerDay: 8,
    },
    sortOrder: 12,
  },
  { 
    id: 'OT_NIGHT', 
    name: 'Phụ cấp đêm', 
    description: 'Phụ cấp làm việc ban đêm (22:00 - 6:00): +30%',
    type: 'overtime_rate',
    metadata: {
      rate: 0.3, // Cộng thêm 30%
      timeRange: { start: '22:00', end: '06:00' },
    },
    sortOrder: 13,
  },
  
  // Attendance rules
  { 
    id: 'LATE_GRACE', 
    name: 'Thời gian ân hạn đi muộn', 
    description: 'Số phút được phép đi muộn mà không bị tính vi phạm',
    type: 'attendance_rule',
    metadata: {
      gracePeriodMinutes: 15,
    },
    sortOrder: 20,
    isDefault: true,
  },
  { 
    id: 'EARLY_GRACE', 
    name: 'Thời gian ân hạn về sớm', 
    description: 'Số phút được phép về sớm mà không bị tính vi phạm',
    type: 'attendance_rule',
    metadata: {
      gracePeriodMinutes: 10,
    },
    sortOrder: 21,
  },
];

// ============================================================================
// INSURANCE & TAX SETTINGS (Bảo hiểm & Thuế)
// Updated for 2024-2026 regulations
// ============================================================================
const insuranceTaxSettings = [
  // BHXH - Bảo hiểm xã hội (Social Insurance)
  { 
    id: 'BHXH_EMPLOYEE', 
    name: 'BHXH - Người lao động', 
    description: 'Tỷ lệ đóng BHXH của người lao động (8%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.08,
      paidBy: 'employee',
      insuranceType: 'BHXH',
      maxSalaryBase: 36000000, // 20 lần mức lương cơ sở (1.8M x 20)
      effectiveDate: '2024-07-01',
    },
    sortOrder: 1,
  },
  { 
    id: 'BHXH_EMPLOYER', 
    name: 'BHXH - Người sử dụng lao động', 
    description: 'Tỷ lệ đóng BHXH của người sử dụng lao động (17%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.17,
      paidBy: 'employer',
      insuranceType: 'BHXH',
      components: [
        { name: 'Hưu trí, tử tuất', rate: 0.14 },
        { name: 'Ốm đau, thai sản', rate: 0.03 },
      ],
      maxSalaryBase: 36000000,
      effectiveDate: '2024-07-01',
    },
    sortOrder: 2,
  },
  
  // BHYT - Bảo hiểm y tế (Health Insurance)
  { 
    id: 'BHYT_EMPLOYEE', 
    name: 'BHYT - Người lao động', 
    description: 'Tỷ lệ đóng BHYT của người lao động (1.5%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.015,
      paidBy: 'employee',
      insuranceType: 'BHYT',
      maxSalaryBase: 36000000,
      effectiveDate: '2024-07-01',
    },
    sortOrder: 3,
  },
  { 
    id: 'BHYT_EMPLOYER', 
    name: 'BHYT - Người sử dụng lao động', 
    description: 'Tỷ lệ đóng BHYT của người sử dụng lao động (3%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.03,
      paidBy: 'employer',
      insuranceType: 'BHYT',
      maxSalaryBase: 36000000,
      effectiveDate: '2024-07-01',
    },
    sortOrder: 4,
  },
  
  // BHTN - Bảo hiểm thất nghiệp (Unemployment Insurance)
  { 
    id: 'BHTN_EMPLOYEE', 
    name: 'BHTN - Người lao động', 
    description: 'Tỷ lệ đóng BHTN của người lao động (1%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.01,
      paidBy: 'employee',
      insuranceType: 'BHTN',
      maxSalaryBase: 36000000, // 20 lần lương tối thiểu vùng
      effectiveDate: '2024-07-01',
    },
    sortOrder: 5,
  },
  { 
    id: 'BHTN_EMPLOYER', 
    name: 'BHTN - Người sử dụng lao động', 
    description: 'Tỷ lệ đóng BHTN của người sử dụng lao động (1%)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.01,
      paidBy: 'employer',
      insuranceType: 'BHTN',
      maxSalaryBase: 36000000,
      effectiveDate: '2024-07-01',
    },
    sortOrder: 6,
  },
  
  // Công đoàn (Trade Union Fee)
  { 
    id: 'UNION_EMPLOYEE', 
    name: 'Phí công đoàn - NLĐ', 
    description: 'Đoàn phí công đoàn của người lao động (1% tiền lương)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.01,
      paidBy: 'employee',
      insuranceType: 'UNION',
      note: 'Chỉ áp dụng cho đoàn viên công đoàn',
    },
    sortOrder: 7,
  },
  { 
    id: 'UNION_EMPLOYER', 
    name: 'Phí công đoàn - NSDLĐ', 
    description: 'Kinh phí công đoàn do NSDLĐ đóng (2% quỹ lương)',
    type: 'insurance_rate',
    metadata: {
      rate: 0.02,
      paidBy: 'employer',
      insuranceType: 'UNION',
      basedOn: 'total_payroll',
    },
    sortOrder: 8,
  },
  
  // Thuế TNCN - Personal Income Tax (Nghị quyết 954/2020)
  { 
    id: 'PIT_DEDUCTION_SELF', 
    name: 'Giảm trừ bản thân', 
    description: 'Mức giảm trừ gia cảnh cho bản thân: 11.000.000đ/tháng',
    type: 'tax_deduction',
    metadata: {
      amount: 11000000,
      perMonth: true,
      effectiveDate: '2020-07-01', // Nghị quyết 954/2020
    },
    sortOrder: 10,
  },
  { 
    id: 'PIT_DEDUCTION_DEPENDENT', 
    name: 'Giảm trừ người phụ thuộc', 
    description: 'Mức giảm trừ cho mỗi người phụ thuộc: 4.400.000đ/tháng',
    type: 'tax_deduction',
    metadata: {
      amount: 4400000,
      perMonth: true,
      perDependent: true,
      effectiveDate: '2020-07-01',
    },
    sortOrder: 11,
  },
  // Biểu thuế lũy tiến - Progressive Tax Brackets
  { 
    id: 'PIT_BRACKETS', 
    name: 'Biểu thuế TNCN', 
    description: 'Biểu thuế lũy tiến từng phần theo Luật thuế TNCN',
    type: 'tax_bracket',
    metadata: {
      brackets: [
        { min: 0, max: 5000000, rate: 0.05 },
        { min: 5000000, max: 10000000, rate: 0.10 },
        { min: 10000000, max: 18000000, rate: 0.15 },
        { min: 18000000, max: 32000000, rate: 0.20 },
        { min: 32000000, max: 52000000, rate: 0.25 },
        { min: 52000000, max: 80000000, rate: 0.30 },
        { min: 80000000, max: null, rate: 0.35 },
      ],
      effectiveDate: '2014-01-01',
      note: 'Áp dụng cho thu nhập từ tiền lương, tiền công',
    },
    sortOrder: 12,
    isDefault: true,
  },
];

// ============================================================================
// SALARY & BENEFITS SETTINGS (Lương & Phúc lợi)
// Based on Nghị định 74/2024/NĐ-CP (effective 1/7/2024)
// ============================================================================
const salaryBenefitSettings = [
  // Lương tối thiểu vùng - Regional Minimum Wage 2024
  { 
    id: 'MIN_WAGE_REGION_1', 
    name: 'Lương tối thiểu Vùng I', 
    description: 'Mức lương tối thiểu vùng I (TP.HCM, Hà Nội, Hải Phòng...)',
    type: 'minimum_wage',
    metadata: {
      amount: 4960000,
      region: 1,
      effectiveDate: '2024-07-01',
      decree: 'Nghị định 74/2024/NĐ-CP',
    },
    sortOrder: 1,
    isDefault: true,
  },
  { 
    id: 'MIN_WAGE_REGION_2', 
    name: 'Lương tối thiểu Vùng II', 
    description: 'Mức lương tối thiểu vùng II (Đà Nẵng, Cần Thơ, Bình Dương...)',
    type: 'minimum_wage',
    metadata: {
      amount: 4410000,
      region: 2,
      effectiveDate: '2024-07-01',
      decree: 'Nghị định 74/2024/NĐ-CP',
    },
    sortOrder: 2,
  },
  { 
    id: 'MIN_WAGE_REGION_3', 
    name: 'Lương tối thiểu Vùng III', 
    description: 'Mức lương tối thiểu vùng III (Các tỉnh còn lại có khu công nghiệp)',
    type: 'minimum_wage',
    metadata: {
      amount: 3860000,
      region: 3,
      effectiveDate: '2024-07-01',
      decree: 'Nghị định 74/2024/NĐ-CP',
    },
    sortOrder: 3,
  },
  { 
    id: 'MIN_WAGE_REGION_4', 
    name: 'Lương tối thiểu Vùng IV', 
    description: 'Mức lương tối thiểu vùng IV (Các địa bàn còn lại)',
    type: 'minimum_wage',
    metadata: {
      amount: 3450000,
      region: 4,
      effectiveDate: '2024-07-01',
      decree: 'Nghị định 74/2024/NĐ-CP',
    },
    sortOrder: 4,
  },
  
  // Lương cơ sở - Base Salary for public sector
  { 
    id: 'BASE_SALARY', 
    name: 'Lương cơ sở', 
    description: 'Mức lương cơ sở dùng để tính mức đóng BHXH tối đa',
    type: 'base_salary',
    metadata: {
      amount: 2340000, // Từ 1/7/2024
      effectiveDate: '2024-07-01',
      decree: 'Nghị định 73/2024/NĐ-CP',
      note: 'Dùng tính mức đóng BHXH, BHYT tối đa (20 lần lương cơ sở)',
    },
    sortOrder: 5,
  },
  
  // Allowances - Phụ cấp
  { 
    id: 'ALLOWANCE_MEAL', 
    name: 'Phụ cấp ăn trưa', 
    description: 'Phụ cấp tiền ăn trưa (không tính thuế TNCN nếu ≤ 730.000đ/tháng)',
    type: 'allowance',
    metadata: {
      defaultAmount: 730000,
      taxExemptMax: 730000,
      perMonth: true,
      note: 'Theo Thông tư 25/2018/TT-BTC',
    },
    sortOrder: 10,
  },
  { 
    id: 'ALLOWANCE_TRANSPORT', 
    name: 'Phụ cấp đi lại', 
    description: 'Phụ cấp xăng xe, phương tiện đi lại',
    type: 'allowance',
    metadata: {
      defaultAmount: 500000,
      perMonth: true,
      taxable: true,
    },
    sortOrder: 11,
  },
  { 
    id: 'ALLOWANCE_PHONE', 
    name: 'Phụ cấp điện thoại', 
    description: 'Phụ cấp tiền điện thoại phục vụ công việc',
    type: 'allowance',
    metadata: {
      defaultAmount: 300000,
      perMonth: true,
      taxable: false,
      note: 'Không tính thuế TNCN nếu có quy định rõ ràng',
    },
    sortOrder: 12,
  },
  { 
    id: 'ALLOWANCE_HOUSING', 
    name: 'Phụ cấp nhà ở', 
    description: 'Phụ cấp hỗ trợ tiền thuê nhà',
    type: 'allowance',
    metadata: {
      defaultAmount: 0,
      perMonth: true,
      taxable: true,
    },
    sortOrder: 13,
  },
  { 
    id: 'ALLOWANCE_POSITION', 
    name: 'Phụ cấp chức vụ', 
    description: 'Phụ cấp trách nhiệm theo chức vụ',
    type: 'allowance',
    metadata: {
      defaultAmount: 0,
      perMonth: true,
      taxable: true,
      byPosition: true,
    },
    sortOrder: 14,
  },
  { 
    id: 'ALLOWANCE_SENIORITY', 
    name: 'Phụ cấp thâm niên', 
    description: 'Phụ cấp theo số năm làm việc',
    type: 'allowance',
    metadata: {
      percentPerYear: 0.01, // 1% cho mỗi năm thâm niên
      maxPercent: 0.30, // Tối đa 30%
      startAfterYears: 5, // Bắt đầu sau 5 năm
    },
    sortOrder: 15,
  },
  
  // Holidays - Ngày nghỉ lễ (Điều 112 BLLĐ 2019)
  { 
    id: 'HOLIDAYS_2026', 
    name: 'Ngày nghỉ lễ 2026', 
    description: 'Các ngày nghỉ lễ, Tết năm 2026 theo Bộ luật Lao động',
    type: 'holiday',
    metadata: {
      year: 2026,
      holidays: [
        { date: '2026-01-01', name: 'Tết Dương lịch', days: 1 },
        { date: '2026-02-17', name: 'Tết Nguyên đán', days: 5, note: '30 tháng Chạp đến mùng 4' },
        { date: '2026-04-06', name: 'Giỗ Tổ Hùng Vương (10/3 ÂL)', days: 1 },
        { date: '2026-04-30', name: 'Giải phóng miền Nam', days: 1 },
        { date: '2026-05-01', name: 'Quốc tế Lao động', days: 1 },
        { date: '2026-09-02', name: 'Quốc khánh', days: 2, note: '2/9 và 1 ngày liền kề' },
      ],
      totalDays: 11, // Điều 112: Người lao động được nghỉ 11 ngày/năm
    },
    sortOrder: 20,
    isDefault: true,
  },
];

// ============================================================================
// SALARY TEMPLATES (Mẫu bảng lương)
// ============================================================================
const salaryTemplates = [
  { 
    id: 'TEMPLATE_BASIC', 
    name: 'Mẫu lương cơ bản', 
    description: 'Bảng lương đơn giản: Lương cơ bản + Phụ cấp - Bảo hiểm - Thuế',
    type: 'salary_template',
    metadata: {
      components: [
        { id: 'baseSalary', name: 'Lương cơ bản', type: 'earning', formula: 'base' },
        { id: 'mealAllowance', name: 'Phụ cấp ăn trưa', type: 'earning', formula: 'fixed', taxable: false },
        { id: 'bhxh', name: 'BHXH (8%)', type: 'deduction', formula: 'percent', rate: 0.08 },
        { id: 'bhyt', name: 'BHYT (1.5%)', type: 'deduction', formula: 'percent', rate: 0.015 },
        { id: 'bhtn', name: 'BHTN (1%)', type: 'deduction', formula: 'percent', rate: 0.01 },
        { id: 'pit', name: 'Thuế TNCN', type: 'deduction', formula: 'progressive' },
      ],
      calculations: {
        grossSalary: ['baseSalary', 'mealAllowance'],
        totalDeductions: ['bhxh', 'bhyt', 'bhtn', 'pit'],
        netSalary: 'grossSalary - totalDeductions',
      },
    },
    sortOrder: 1,
    isDefault: true,
  },
  { 
    id: 'TEMPLATE_FULL', 
    name: 'Mẫu lương đầy đủ', 
    description: 'Bảng lương chi tiết với đầy đủ các khoản phụ cấp và khấu trừ',
    type: 'salary_template',
    metadata: {
      components: [
        // Earnings
        { id: 'baseSalary', name: 'Lương cơ bản', type: 'earning', formula: 'base' },
        { id: 'positionAllowance', name: 'Phụ cấp chức vụ', type: 'earning', formula: 'fixed' },
        { id: 'seniorityAllowance', name: 'Phụ cấp thâm niên', type: 'earning', formula: 'percent' },
        { id: 'mealAllowance', name: 'Phụ cấp ăn trưa', type: 'earning', formula: 'fixed', taxable: false },
        { id: 'transportAllowance', name: 'Phụ cấp đi lại', type: 'earning', formula: 'fixed' },
        { id: 'phoneAllowance', name: 'Phụ cấp điện thoại', type: 'earning', formula: 'fixed', taxable: false },
        { id: 'overtime', name: 'Lương tăng ca', type: 'earning', formula: 'calculated' },
        { id: 'bonus', name: 'Thưởng', type: 'earning', formula: 'fixed' },
        // Deductions
        { id: 'bhxh', name: 'BHXH (8%)', type: 'deduction', formula: 'percent', rate: 0.08 },
        { id: 'bhyt', name: 'BHYT (1.5%)', type: 'deduction', formula: 'percent', rate: 0.015 },
        { id: 'bhtn', name: 'BHTN (1%)', type: 'deduction', formula: 'percent', rate: 0.01 },
        { id: 'unionFee', name: 'Phí công đoàn', type: 'deduction', formula: 'percent', rate: 0.01 },
        { id: 'pit', name: 'Thuế TNCN', type: 'deduction', formula: 'progressive' },
        { id: 'advance', name: 'Tạm ứng', type: 'deduction', formula: 'fixed' },
        { id: 'penalty', name: 'Phạt vi phạm', type: 'deduction', formula: 'fixed' },
      ],
    },
    sortOrder: 2,
  },
  { 
    id: 'TEMPLATE_RETAIL', 
    name: 'Mẫu lương bán lẻ', 
    description: 'Bảng lương cho nhân viên bán lẻ với hoa hồng doanh số',
    type: 'salary_template',
    metadata: {
      components: [
        { id: 'baseSalary', name: 'Lương cơ bản', type: 'earning', formula: 'base' },
        { id: 'commission', name: 'Hoa hồng doanh số', type: 'earning', formula: 'calculated' },
        { id: 'kpiBonus', name: 'Thưởng KPI', type: 'earning', formula: 'calculated' },
        { id: 'mealAllowance', name: 'Phụ cấp ăn trưa', type: 'earning', formula: 'fixed', taxable: false },
        { id: 'bhxh', name: 'BHXH (8%)', type: 'deduction', formula: 'percent', rate: 0.08 },
        { id: 'bhyt', name: 'BHYT (1.5%)', type: 'deduction', formula: 'percent', rate: 0.015 },
        { id: 'bhtn', name: 'BHTN (1%)', type: 'deduction', formula: 'percent', rate: 0.01 },
        { id: 'pit', name: 'Thuế TNCN', type: 'deduction', formula: 'progressive' },
      ],
    },
    sortOrder: 3,
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================
async function seedJobTitles() {
  console.log('📋 Seeding Job Titles (Chức vụ)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const title of jobTitles) {
    const existing = await prisma.jobTitle.findUnique({ where: { id: title.id } });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.jobTitle.create({
      data: {
        systemId: crypto.randomUUID(),
        id: title.id,
        name: title.name,
        description: title.description,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedDepartments() {
  console.log('🏢 Seeding Departments (Phòng ban)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const dept of departments) {
    const existing = await prisma.department.findUnique({ where: { id: dept.id } });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.department.create({
      data: {
        systemId: crypto.randomUUID(),
        id: dept.id,
        name: dept.name,
        description: dept.description,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedEmployeeTypes() {
  console.log('👤 Seeding Employee Types (Loại nhân viên)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const type of employeeTypes) {
    const existing = await prisma.employeeTypeSetting.findUnique({ where: { id: type.id } });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.employeeTypeSetting.create({
      data: {
        systemId: crypto.randomUUID(),
        id: type.id,
        name: type.name,
        description: type.description,
        color: type.color,
        isDefault: type.isDefault,
        sortOrder: type.sortOrder,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedPenaltyTypes() {
  console.log('⚠️ Seeding Penalty Types (Loại phạt)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const penalty of penaltyTypes) {
    const existing = await prisma.penaltyTypeSetting.findUnique({ where: { id: penalty.id } });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.penaltyTypeSetting.create({
      data: {
        systemId: crypto.randomUUID(),
        id: penalty.id,
        name: penalty.name,
        description: penalty.description,
        defaultAmount: penalty.defaultAmount,
        category: penalty.category,
        sortOrder: penalty.sortOrder,
        isActive: true,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedLeaveTypes() {
  console.log('🏖️ Seeding Leave Types (Loại nghỉ phép)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const leave of leaveTypes) {
    const existing = await prisma.settingsData.findUnique({ 
      where: { id_type: { id: leave.id, type: leave.type } } 
    });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.settingsData.create({
      data: {
        id: leave.id,
        name: leave.name,
        description: leave.description,
        type: leave.type,
        metadata: leave.metadata,
        isDefault: leave.isDefault || false,
        isActive: true,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedAttendanceSettings() {
  console.log('⏰ Seeding Attendance Settings (Chấm công & Thời gian)...');
  
  let created = 0;
  let skipped = 0;
  
  for (const setting of attendanceSettings) {
    const existing = await prisma.settingsData.findUnique({ 
      where: { id_type: { id: setting.id, type: setting.type } } 
    });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.settingsData.create({
      data: {
        id: setting.id,
        name: setting.name,
        description: setting.description,
        type: setting.type,
        metadata: setting.metadata,
        isDefault: setting.isDefault || false,
        isActive: true,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedInsuranceTaxSettings() {
  console.log('🏦 Seeding Insurance & Tax Settings (Bảo hiểm & Thuế)...');
  
  let created = 0;
  let skipped = 0;
  
  // These are reference data, not salary components. Prefix type with 'ref_'
  const REFERENCE_TYPES = ['insurance_rate', 'tax_deduction', 'tax_bracket'];
  
  for (const setting of insuranceTaxSettings) {
    const storedType = REFERENCE_TYPES.includes(setting.type) ? `ref_${setting.type}` : setting.type;
    
    const existing = await prisma.settingsData.findFirst({ 
      where: { id: setting.id } 
    });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.settingsData.create({
      data: {
        id: setting.id,
        name: setting.name,
        description: setting.description,
        type: storedType,
        metadata: setting.metadata,
        isDefault: setting.isDefault || false,
        isActive: true,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedSalaryBenefitSettings() {
  console.log('💰 Seeding Salary & Benefits (Lương & Phúc lợi)...');
  
  let created = 0;
  let skipped = 0;
  
  // These are reference data (min wage, base salary, insurance rates, tax brackets, holidays)
  // NOT salary components for payroll templates. Prefix type with 'ref_' to avoid
  // them appearing in salary components API which filters by type.
  const REFERENCE_TYPES = ['minimum_wage', 'base_salary', 'allowance', 'insurance_rate', 'tax_deduction', 'tax_bracket', 'holiday'];
  
  for (const setting of salaryBenefitSettings) {
    const storedType = REFERENCE_TYPES.includes(setting.type) ? `ref_${setting.type}` : setting.type;
    
    const existing = await prisma.settingsData.findFirst({ 
      where: { id: setting.id } 
    });
    if (existing) {
      skipped++;
      continue;
    }
    
    await prisma.settingsData.create({
      data: {
        id: setting.id,
        name: setting.name,
        description: setting.description,
        type: storedType,
        metadata: setting.metadata,
        isDefault: setting.isDefault || false,
        isActive: true,
      },
    });
    created++;
  }
  
  console.log(`   ✅ Created: ${created} | Skipped: ${skipped}`);
}

async function seedSalaryTemplates() {
  console.log('📝 Seeding Salary Templates (Mẫu bảng lương)...');
  
  // Payroll templates are stored in Setting table, not SettingsData
  const SETTING_KEY = 'payroll-templates';
  const SETTING_GROUP = 'hrm';
  
  const existing = await prisma.setting.findFirst({
    where: { key: SETTING_KEY, group: SETTING_GROUP },
  });
  
  if (existing) {
    console.log(`   ⏭️  Skipped: Payroll templates already exist`);
    return;
  }
  
  // Lookup actual salary component systemIds from DB
  // Components are stored in SettingsData with types: earning, deduction, contribution
  const dbComponents = await prisma.settingsData.findMany({
    where: { type: { in: ['earning', 'deduction', 'contribution', 'salary_component'] }, isDeleted: false },
    select: { systemId: true, name: true },
  });
  
  // Build name → systemId map for lookup
  const nameToSystemId = new Map(dbComponents.map(c => [c.name, c.systemId]));
  
  // Transform salaryTemplates to PayrollTemplate format
  const templates = salaryTemplates.map((t, index) => {
    const components = t.metadata?.components || [];
    const componentSystemIds = components
      .map((c: { id: string; name: string }) => nameToSystemId.get(c.name))
      .filter((id: string | undefined): id is string => !!id);
    
    if (componentSystemIds.length < components.length) {
      const missing = components.filter((c: { name: string }) => !nameToSystemId.has(c.name));
      console.log(`   ⚠️  ${t.id}: ${missing.length} components not found in DB: ${missing.map((c: { name: string }) => c.name).join(', ')}`);
    }
    
    return {
      systemId: crypto.randomUUID(),
      id: t.id,
      name: t.name,
      description: t.description,
      componentSystemIds,
      isDefault: t.isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  
  await prisma.setting.create({
    data: {
      systemId: crypto.randomUUID(),
      key: SETTING_KEY,
      group: SETTING_GROUP,
      type: 'json',
      category: 'hrm',
      value: templates,
      description: 'Payroll templates configuration',
    },
  });
  
  console.log(`   ✅ Created: ${templates.length} payroll templates`);
}

// ============================================================================
// MAIN EXPORT
// ============================================================================
export async function seedEmployeeSettings() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌱 SEEDING EMPLOYEE SETTINGS');
  console.log('   Based on Vietnam Labor Code 2019 (updated 2026)');
  console.log('   - Nghị định 74/2024/NĐ-CP: Lương tối thiểu vùng');
  console.log('   - Thông tư 06/2021/TT-BLĐTBXH: Bảo hiểm xã hội');
  console.log('   - Nghị quyết 954/2020/UBTVQH14: Thuế TNCN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Core employee settings
    await seedJobTitles();
    await seedDepartments();
    await seedEmployeeTypes();
    await seedPenaltyTypes();
    
    // 2. Leave & Attendance
    await seedLeaveTypes();
    await seedAttendanceSettings();
    
    // 3. Compensation & Tax
    await seedInsuranceTaxSettings();
    await seedSalaryBenefitSettings();
    await seedSalaryTemplates();

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ EMPLOYEE SETTINGS SEEDED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Summary of seeded data:');
    console.log('   • Chức vụ (Job Titles): 35 records');
    console.log('   • Phòng ban (Departments): 17 records');
    console.log('   • Loại nhân viên (Employee Types): 8 records');
    console.log('   • Loại phạt (Penalty Types): 15 records');
    console.log('   • Loại nghỉ phép (Leave Types): 8 records');
    console.log('   • Cài đặt chấm công (Attendance): 9 records');
    console.log('   • Bảo hiểm & Thuế (Insurance/Tax): 12 records');
    console.log('   • Lương & Phúc lợi (Salary/Benefits): 11 records');
    console.log('   • Mẫu bảng lương (Salary Templates): 3 records');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ EMPLOYEE SETTINGS SEED FAILED');
    console.error(error);
    throw error;
  }
}

// Run if executed directly
// Works on Windows and Unix
const scriptPath = process.argv[1]?.replace(/\\/g, '/');
const moduleUrl = import.meta.url.replace('file:///', '').replace('file://', '');
const isMainModule = scriptPath?.endsWith('seed-employee-settings.ts') || 
                     moduleUrl?.endsWith('seed-employee-settings.ts');

if (isMainModule) {
  seedEmployeeSettings()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
