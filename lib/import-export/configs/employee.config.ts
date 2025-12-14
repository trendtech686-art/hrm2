import type { Employee } from '@/features/employees/types';
import type { ImportExportConfig, FieldConfig } from '../types';
import { enrichEmployeeAddresses } from '../address-lookup';

/**
 * Parse địa chỉ từ template mới
 * Cấu trúc địa chỉ nhân viên (hệ thống 2 cấp):
 * - Địa chỉ thường trú: Tỉnh/TP thường trú, Phường/Xã thường trú, Số nhà đường thường trú
 * - Địa chỉ tạm trú: Tỉnh/TP tạm trú, Phường/Xã tạm trú, Số nhà đường tạm trú
 */

type AddressType = 'permanent' | 'temporary';

interface ParsedAddress {
  type: AddressType;
  province: string;
  ward: string;
  street: string;
}

function parseEmployeeAddresses(rawRow: Record<string, unknown>): ParsedAddress[] {
  const addresses: ParsedAddress[] = [];
  
  // Địa chỉ thường trú
  const permanentProvince = rawRow['Tỉnh/TP thường trú'];
  const permanentWard = rawRow['Phường/Xã thường trú'];
  const permanentStreet = rawRow['Số nhà, đường thường trú'];
  
  if (permanentProvince || permanentWard || permanentStreet) {
    addresses.push({
      type: 'permanent',
      province: String(permanentProvince || ''),
      ward: String(permanentWard || ''),
      street: String(permanentStreet || ''),
    });
  }
  
  // Địa chỉ tạm trú
  const temporaryProvince = rawRow['Tỉnh/TP tạm trú'];
  const temporaryWard = rawRow['Phường/Xã tạm trú'];
  const temporaryStreet = rawRow['Số nhà, đường tạm trú'];
  
  if (temporaryProvince || temporaryWard || temporaryStreet) {
    addresses.push({
      type: 'temporary',
      province: String(temporaryProvince || ''),
      ward: String(temporaryWard || ''),
      street: String(temporaryStreet || ''),
    });
  }
  
  return addresses;
}

/**
 * Normalize raw row từ template
 * Convert địa chỉ thường trú/tạm trú thành permanentAddress/temporaryAddress
 */
function normalizeEmployeeRawRow(rawRow: Record<string, unknown>): Record<string, unknown> {
  const result = { ...rawRow };
  
  const parsedAddresses = parseEmployeeAddresses(rawRow);
  
  for (const addr of parsedAddresses) {
    if (addr.type === 'permanent') {
      // Địa chỉ thường trú -> permanentAddress
      result['__permanentAddress__'] = {
        province: addr.province,
        ward: addr.ward,
        street: addr.street,
        inputLevel: '2-level' as const,
      };
    } else if (addr.type === 'temporary') {
      // Địa chỉ tạm trú -> temporaryAddress
      result['__temporaryAddress__'] = {
        province: addr.province,
        ward: addr.ward,
        street: addr.street,
        inputLevel: '2-level' as const,
      };
    }
  }
  
  return result;
}

// Field definitions cho Employee - ĐẦY ĐỦ tất cả fields
// CHỈ BẮT BUỘC: id (Mã nhân viên) và fullName (Họ và tên)
const employeeFields: FieldConfig<Employee>[] = [
  // ===== THÔNG TIN CƠ BẢN =====
  {
    key: 'id',
    label: 'Mã nhân viên (*)',
    required: true,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'NV001',
  },
  {
    key: 'fullName',
    label: 'Họ và tên (*)',
    required: true,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Nguyễn Văn A',
  },
  {
    key: 'gender',
    label: 'Giới tính',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'male',
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
    required: false,
    type: 'date',
    exportGroup: 'Thông tin cơ bản',
    example: '1990-01-15',
  },
  {
    key: 'placeOfBirth',
    label: 'Nơi sinh',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Hà Nội',
  },
  {
    key: 'nationality',
    label: 'Quốc tịch',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Việt Nam',
  },
  {
    key: 'religion',
    label: 'Tôn giáo',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Không',
  },
  {
    key: 'maritalStatus',
    label: 'Tình trạng hôn nhân',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'single',
  },
  {
    key: 'avatar',
    label: 'Ảnh đại diện',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    hidden: true,
  },

  // ===== THÔNG TIN ĐĂNG NHẬP =====
  {
    key: 'workEmail',
    label: 'Email công ty',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin đăng nhập',
    example: 'nguyenvana@company.com',
    validator: (value: unknown) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value)) || 'Email không hợp lệ';
    },
  },
  {
    key: 'password',
    label: 'Mật khẩu',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin đăng nhập',
    example: '********',
    hidden: true, // Không export mật khẩu
  },
  {
    key: 'role',
    label: 'Vai trò hệ thống (*Mặc định: employee)',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin đăng nhập',
    example: 'employee',
    defaultValue: 'employee',
  },

  // ===== GIẤY TỜ TÙY THÂN =====
  {
    key: 'nationalId',
    label: 'CMND/CCCD',
    required: false,
    type: 'string',
    exportGroup: 'Giấy tờ tùy thân',
    example: '012345678901',
  },
  {
    key: 'nationalIdIssueDate',
    label: 'Ngày cấp CMND/CCCD',
    required: false,
    type: 'date',
    exportGroup: 'Giấy tờ tùy thân',
    example: '2020-01-15',
  },
  {
    key: 'nationalIdIssuePlace',
    label: 'Nơi cấp CMND/CCCD',
    required: false,
    type: 'string',
    exportGroup: 'Giấy tờ tùy thân',
    example: 'CA TP Hà Nội',
  },
  {
    key: 'personalTaxId',
    label: 'Mã số thuế cá nhân',
    required: false,
    type: 'string',
    exportGroup: 'Giấy tờ tùy thân',
    example: '0123456789',
  },
  {
    key: 'socialInsuranceNumber',
    label: 'Số sổ BHXH',
    required: false,
    type: 'string',
    exportGroup: 'Giấy tờ tùy thân',
    example: '1234567890',
  },

  // ===== LIÊN HỆ =====
  {
    key: 'personalEmail',
    label: 'Email cá nhân',
    required: false,
    type: 'string',
    exportGroup: 'Liên hệ',
    example: 'nguyenvana@gmail.com',
    validator: (value: unknown) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value)) || 'Email không hợp lệ';
    },
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    required: false,
    type: 'string',
    exportGroup: 'Liên hệ',
    example: '0901234567',
  },
  
  // ===== ĐỊA CHỈ THƯỜNG TRÚ (hệ thống 2 cấp) =====
  {
    key: 'permanentAddress.province',
    label: 'Tỉnh/TP thường trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ thường trú',
    example: 'Hà Nội',
  },
  {
    key: 'permanentAddress.ward',
    label: 'Phường/Xã thường trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ thường trú',
    example: 'Phường Điện Biên',
  },
  {
    key: 'permanentAddress.street',
    label: 'Số nhà, đường thường trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ thường trú',
    example: '123 Đường ABC',
  },

  // ===== ĐỊA CHỈ TẠM TRÚ (hệ thống 2 cấp) =====
  {
    key: 'temporaryAddress.province',
    label: 'Tỉnh/TP tạm trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ tạm trú',
    example: 'Hà Nội',
  },
  {
    key: 'temporaryAddress.ward',
    label: 'Phường/Xã tạm trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ tạm trú',
    example: 'Phường Cống Vị',
  },
  {
    key: 'temporaryAddress.street',
    label: 'Số nhà, đường tạm trú',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ tạm trú',
    example: '456 Đường XYZ',
  },

  // ===== LIÊN HỆ KHẨN CẤP =====
  {
    key: 'emergencyContactName',
    label: 'Người liên hệ khẩn cấp',
    required: false,
    type: 'string',
    exportGroup: 'Liên hệ khẩn cấp',
    example: 'Nguyễn Văn B',
  },
  {
    key: 'emergencyContactPhone',
    label: 'SĐT khẩn cấp',
    required: false,
    type: 'string',
    exportGroup: 'Liên hệ khẩn cấp',
    example: '0908765432',
  },

  // ===== CÔNG VIỆC =====
  {
    key: 'departmentId',
    label: 'Mã phòng ban',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'PB001',
  },
  {
    key: 'departmentName',
    label: 'Tên phòng ban',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Phòng Kinh doanh',
  },
  {
    key: 'department',
    label: 'Bộ phận',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Kinh doanh',
  },
  {
    key: 'positionId',
    label: 'Mã chức vụ',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'CV001',
  },
  {
    key: 'positionName',
    label: 'Tên chức vụ',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Trưởng phòng',
  },
  {
    key: 'jobTitle',
    label: 'Chức danh',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Nhân viên kinh doanh',
  },
  {
    key: 'employeeType',
    label: 'Loại nhân viên',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Chính thức',
  },
  {
    key: 'employmentStatus',
    label: 'Trạng thái làm việc (*Mặc định: Đang làm việc)',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'Đang làm việc',
    defaultValue: 'Đang làm việc',
  },
  {
    key: 'status',
    label: 'Trạng thái (*Mặc định: active)',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'active',
    defaultValue: 'active',
  },
  {
    key: 'hireDate',
    label: 'Ngày tuyển dụng',
    required: false,
    type: 'date',
    exportGroup: 'Công việc',
    example: '2023-01-01',
  },
  {
    key: 'startDate',
    label: 'Ngày bắt đầu làm việc',
    required: false,
    type: 'date',
    exportGroup: 'Công việc',
    example: '2023-01-15',
  },
  {
    key: 'endDate',
    label: 'Ngày kết thúc',
    required: false,
    type: 'date',
    exportGroup: 'Công việc',
    example: '',
  },
  {
    key: 'terminationDate',
    label: 'Ngày nghỉ việc',
    required: false,
    type: 'date',
    exportGroup: 'Công việc',
    example: '',
  },
  {
    key: 'reasonForLeaving',
    label: 'Lý do nghỉ việc',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: '',
  },
  {
    key: 'branchSystemId',
    label: 'Mã chi nhánh',
    required: false,
    type: 'string',
    exportGroup: 'Công việc',
    example: 'CN001',
  },

  // ===== THỬ VIỆC & HỢP ĐỒNG =====
  {
    key: 'probationEndDate',
    label: 'Ngày kết thúc thử việc',
    required: false,
    type: 'date',
    exportGroup: 'Thử việc & Hợp đồng',
    example: '2023-03-31',
  },
  {
    key: 'contractNumber',
    label: 'Số hợp đồng',
    required: false,
    type: 'string',
    exportGroup: 'Thử việc & Hợp đồng',
    example: 'HD-2023-001',
  },
  {
    key: 'contractType',
    label: 'Loại hợp đồng',
    required: false,
    type: 'string',
    exportGroup: 'Thử việc & Hợp đồng',
    example: 'definite',
  },
  {
    key: 'contractStartDate',
    label: 'Ngày bắt đầu HĐ',
    required: false,
    type: 'date',
    exportGroup: 'Thử việc & Hợp đồng',
    example: '2023-04-01',
  },
  {
    key: 'contractEndDate',
    label: 'Ngày kết thúc HĐ',
    required: false,
    type: 'date',
    exportGroup: 'Thử việc & Hợp đồng',
    example: '2024-03-31',
  },

  // ===== THỜI GIAN LÀM VIỆC =====
  {
    key: 'workingHoursPerDay',
    label: 'Số giờ/ngày (*Mặc định: 8)',
    required: false,
    type: 'number',
    exportGroup: 'Thời gian làm việc',
    example: '8',
    defaultValue: 8,
  },
  {
    key: 'workingDaysPerWeek',
    label: 'Số ngày/tuần (*Mặc định: 5)',
    required: false,
    type: 'number',
    exportGroup: 'Thời gian làm việc',
    example: '5',
    defaultValue: 5,
  },
  {
    key: 'shiftType',
    label: 'Ca làm việc',
    required: false,
    type: 'string',
    exportGroup: 'Thời gian làm việc',
    example: 'day',
  },

  // ===== LƯƠNG & THU NHẬP =====
  {
    key: 'baseSalary',
    label: 'Lương cơ bản',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '15000000',
  },
  {
    key: 'socialInsuranceSalary',
    label: 'Lương đóng BHXH',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '10000000',
  },
  {
    key: 'positionAllowance',
    label: 'Phụ cấp chức vụ',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '2000000',
  },
  {
    key: 'mealAllowance',
    label: 'Phụ cấp ăn trưa',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '730000',
  },
  {
    key: 'otherAllowances',
    label: 'Phụ cấp khác',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '500000',
  },
  {
    key: 'numberOfDependents',
    label: 'Số người phụ thuộc',
    required: false,
    type: 'number',
    exportGroup: 'Lương & Thu nhập',
    example: '1',
  },

  // ===== NGÂN HÀNG =====
  {
    key: 'bankAccountNumber',
    label: 'Số tài khoản',
    required: false,
    type: 'string',
    exportGroup: 'Ngân hàng',
    example: '1234567890123',
  },
  {
    key: 'bankName',
    label: 'Ngân hàng',
    required: false,
    type: 'string',
    exportGroup: 'Ngân hàng',
    example: 'Vietcombank',
  },
  {
    key: 'bankBranch',
    label: 'Chi nhánh',
    required: false,
    type: 'string',
    exportGroup: 'Ngân hàng',
    example: 'CN Hà Nội',
  },

  // ===== NGHỈ PHÉP =====
  {
    key: 'annualLeaveBalance',
    label: 'Số ngày phép còn',
    required: false,
    type: 'number',
    exportGroup: 'Nghỉ phép',
    example: '12',
  },
  {
    key: 'leaveTaken',
    label: 'Số ngày đã nghỉ (*Mặc định: 0)',
    required: false,
    type: 'number',
    exportGroup: 'Nghỉ phép',
    example: '3',
    defaultValue: 0,
  },
  {
    key: 'paidLeaveTaken',
    label: 'Nghỉ phép có lương',
    required: false,
    type: 'number',
    exportGroup: 'Nghỉ phép',
    example: '2',
  },
  {
    key: 'unpaidLeaveTaken',
    label: 'Nghỉ phép không lương',
    required: false,
    type: 'number',
    exportGroup: 'Nghỉ phép',
    example: '1',
  },
  {
    key: 'annualLeaveTaken',
    label: 'Nghỉ phép năm đã dùng',
    required: false,
    type: 'number',
    exportGroup: 'Nghỉ phép',
    example: '5',
  },

  // ===== ĐÁNH GIÁ =====
  {
    key: 'performanceRating',
    label: 'Đánh giá hiệu suất',
    required: false,
    type: 'number',
    exportGroup: 'Đánh giá',
    example: '4',
  },
  {
    key: 'lastReviewDate',
    label: 'Ngày đánh giá gần nhất',
    required: false,
    type: 'date',
    exportGroup: 'Đánh giá',
    example: '2023-12-15',
  },
  {
    key: 'nextReviewDate',
    label: 'Ngày đánh giá tiếp theo',
    required: false,
    type: 'date',
    exportGroup: 'Đánh giá',
    example: '2024-06-15',
  },

  // ===== KỸ NĂNG & CHỨNG CHỈ =====
  {
    key: 'skills',
    label: 'Kỹ năng',
    required: false,
    type: 'string',
    exportGroup: 'Kỹ năng & Chứng chỉ',
    example: 'Excel, PowerPoint, Quản lý dự án',
    transform: (value) => {
      if (Array.isArray(value)) return value.join(', ');
      return value;
    },
    reverseTransform: (value) => {
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(Boolean);
      }
      return value;
    },
  },
  {
    key: 'certifications',
    label: 'Chứng chỉ',
    required: false,
    type: 'string',
    exportGroup: 'Kỹ năng & Chứng chỉ',
    example: 'PMP, IELTS 7.0',
    transform: (value) => {
      if (Array.isArray(value)) return value.join(', ');
      return value;
    },
    reverseTransform: (value) => {
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(Boolean);
      }
      return value;
    },
  },

  // ===== SƠ ĐỒ TỔ CHỨC =====
  {
    key: 'managerId',
    label: 'Mã quản lý trực tiếp',
    required: false,
    type: 'string',
    exportGroup: 'Sơ đồ tổ chức',
    example: 'NV000',
  },

  // ===== HỌC VẤN =====
  {
    key: 'educationLevel',
    label: 'Trình độ học vấn',
    required: false,
    type: 'string',
    exportGroup: 'Học vấn',
    example: 'Đại học',
  },
  {
    key: 'major',
    label: 'Chuyên ngành',
    required: false,
    type: 'string',
    exportGroup: 'Học vấn',
    example: 'Quản trị kinh doanh',
  },
  {
    key: 'graduationYear',
    label: 'Năm tốt nghiệp',
    required: false,
    type: 'number',
    exportGroup: 'Học vấn',
    example: '2018',
  },
  {
    key: 'school',
    label: 'Trường',
    required: false,
    type: 'string',
    exportGroup: 'Học vấn',
    example: 'Đại học Kinh tế Quốc dân',
  },

  // ===== GHI CHÚ =====
  {
    key: 'notes',
    label: 'Ghi chú',
    required: false,
    type: 'string',
    exportGroup: 'Khác',
    example: '',
  },

  // ===== DỮ LIỆU HỆ THỐNG (hidden, không import) =====
  {
    key: 'systemId',
    label: 'System ID',
    required: false,
    type: 'string',
    exportGroup: 'Hệ thống',
    hidden: true, // Không hiển thị khi import
  },
  {
    key: 'avatarUrl',
    label: 'URL ảnh đại diện',
    required: false,
    type: 'string',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'updatedAt',
    label: 'Ngày cập nhật',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
];

/**
 * Post-transform để xử lý địa chỉ thường trú và tạm trú
 * Được tạo bởi normalizeEmployeeRawRow từ các cột:
 * - __permanentAddress__: Địa chỉ thường trú
 * - __temporaryAddress__: Địa chỉ tạm trú
 */
function processEmployeeAddresses(row: Partial<Employee>): Partial<Employee> {
  const result = { ...row };
  const rawData = row as Record<string, unknown>;
  
  // Xử lý địa chỉ thường trú
  const permanentRaw = rawData['__permanentAddress__'] as {
    province?: string;
    ward?: string;
    street?: string;
    inputLevel?: '2-level' | '3-level';
  } | undefined;
  
  if (permanentRaw && (permanentRaw.province || permanentRaw.ward || permanentRaw.street)) {
    // Enrich with IDs using address lookup
    const enriched = enrichEmployeeAddresses({
      permanentAddress: {
        province: permanentRaw.province || '',
        ward: permanentRaw.ward || '',
        street: permanentRaw.street || '',
        inputLevel: permanentRaw.inputLevel || '2-level',
      } as Employee['permanentAddress'],
    });
    
    if (enriched.permanentAddress) {
      result.permanentAddress = enriched.permanentAddress;
    }
    
    // Remove temporary field
    delete (result as Record<string, unknown>)['__permanentAddress__'];
  }
  
  // Xử lý địa chỉ tạm trú
  const temporaryRaw = rawData['__temporaryAddress__'] as {
    province?: string;
    ward?: string;
    street?: string;
    inputLevel?: '2-level' | '3-level';
  } | undefined;
  
  if (temporaryRaw && (temporaryRaw.province || temporaryRaw.ward || temporaryRaw.street)) {
    // Enrich with IDs using address lookup
    const enriched = enrichEmployeeAddresses({
      temporaryAddress: {
        province: temporaryRaw.province || '',
        ward: temporaryRaw.ward || '',
        street: temporaryRaw.street || '',
        inputLevel: temporaryRaw.inputLevel || '2-level',
      } as Employee['temporaryAddress'],
    });
    
    if (enriched.temporaryAddress) {
      result.temporaryAddress = enriched.temporaryAddress;
    }
    
    // Remove temporary field
    delete (result as Record<string, unknown>)['__temporaryAddress__'];
  }
  
  return result;
}

export const employeeConfig: ImportExportConfig<Employee> = {
  entityType: 'employees',
  entityDisplayName: 'Nhân viên',
  fields: employeeFields,
  upsertKey: 'id', // Dùng mã nhân viên để đối chiếu khi UPDATE
  templateFileName: 'mau-import-nhan-vien.xlsx',
  
  // Pre-transform: Normalize raw row từ template mới (merge 2-level/3-level columns)
  preTransformRawRow: normalizeEmployeeRawRow,
  
  // Post-transform: Process addresses and lookup IDs
  postTransformRow: processEmployeeAddresses,
};

// Re-export with old names for backward compatibility
export const employeeImportExportConfig = employeeConfig;
export { employeeFields };

export default employeeConfig;
