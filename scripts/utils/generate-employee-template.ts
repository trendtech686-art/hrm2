/**
 * Script tạo file template Excel mẫu cho import nhân viên
 * Chạy: npx tsx scripts/generate-employee-template.ts
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Import data địa chỉ
import { PROVINCES_DATA } from '@/features/settings/provinces/provinces-data';
import { DISTRICTS_DATA } from '@/features/settings/provinces/districts-data';
import { WARDS_2LEVEL_DATA } from '@/features/settings/provinces/wards-2level-data';
import { WARDS_3LEVEL_DATA } from '@/features/settings/provinces/wards-3level-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Danh sách các cột trong file import
// ĐỊA CHỈ NHÂN VIÊN: Sử dụng hệ thống 2 cấp (Tỉnh/TP → Phường/Xã)
// - Địa chỉ thường trú: Nơi đăng ký hộ khẩu
// - Địa chỉ tạm trú: Nơi đang sinh sống (có thể trống)
const columns = [
  // Thông tin cơ bản
  'Mã nhân viên (*)',
  'Họ và tên (*)',
  'Giới tính',
  'Ngày sinh',
  'Nơi sinh',
  'Quốc tịch',
  'Tôn giáo',
  'Tình trạng hôn nhân',
  
  // Thông tin đăng nhập
  'Email công ty',
  'Mật khẩu',
  'Vai trò hệ thống (*Mặc định: employee)',
  
  // Giấy tờ tùy thân
  'CMND/CCCD',
  'Ngày cấp CMND/CCCD',
  'Nơi cấp CMND/CCCD',
  'Mã số thuế cá nhân',
  'Số sổ BHXH',
  
  // Liên hệ
  'Email cá nhân',
  'Số điện thoại',
  
  // ===== ĐỊA CHỈ THƯỜNG TRÚ (hệ thống 2 cấp) =====
  'Tỉnh/TP thường trú',          // Chọn từ DS Tỉnh-TP
  'Phường/Xã thường trú',        // Chọn từ DS Phường-Xã (2 cấp)
  'Số nhà, đường thường trú',    // Số nhà, tên đường
  
  // ===== ĐỊA CHỈ TẠM TRÚ (hệ thống 2 cấp - có thể để trống) =====
  'Tỉnh/TP tạm trú',
  'Phường/Xã tạm trú',
  'Số nhà, đường tạm trú',
  
  // Liên hệ khẩn cấp
  'Người liên hệ khẩn cấp',
  'SĐT khẩn cấp',
  
  // Công việc
  'Mã phòng ban',
  'Tên phòng ban',
  'Bộ phận',
  'Mã chức vụ',
  'Tên chức vụ',
  'Chức danh',
  'Loại nhân viên',
  'Trạng thái làm việc (*Mặc định: Đang làm việc)',
  'Trạng thái (*Mặc định: active)',
  'Ngày tuyển dụng',
  'Ngày bắt đầu làm việc',
  'Mã chi nhánh',
  
  // Hợp đồng
  'Ngày kết thúc thử việc',
  'Số hợp đồng',
  'Loại hợp đồng',
  'Ngày bắt đầu HĐ',
  'Ngày kết thúc HĐ',
  
  // Thời gian làm việc
  'Số giờ/ngày (*Mặc định: 8)',
  'Số ngày/tuần (*Mặc định: 5)',
  'Ca làm việc',
  
  // Lương
  'Lương cơ bản',
  'Lương đóng BHXH',
  'Phụ cấp chức vụ',
  'Phụ cấp ăn trưa',
  'Phụ cấp khác',
  'Số người phụ thuộc',
  
  // Ngân hàng
  'Số tài khoản',
  'Ngân hàng',
  'Chi nhánh',
  
  // Nghỉ phép
  'Số ngày phép còn',
  'Số ngày đã nghỉ (*Mặc định: 0)',
  
  // Khác
  'Kỹ năng',
  'Chứng chỉ',
  'Mã quản lý trực tiếp',
  'Trình độ học vấn',
  'Chuyên ngành',
  'Năm tốt nghiệp',
  'Trường',
  'Ghi chú',
];

// Dữ liệu mẫu - 3 nhân viên
const sampleData = [
  {
    // NV1: Có cả địa chỉ thường trú và tạm trú
    'Mã nhân viên (*)': 'NV000010',
    'Họ và tên (*)': 'Nguyễn Văn An',
    'Giới tính': 'Nam',
    'Ngày sinh': '1990-05-15',
    'Nơi sinh': 'Hà Nội',
    'Quốc tịch': 'Việt Nam',
    'Tôn giáo': 'Không',
    'Tình trạng hôn nhân': 'Đã kết hôn',
    'Email công ty': 'nguyenvanan@company.com',
    'Mật khẩu': '123456',
    'Vai trò hệ thống (*Mặc định: employee)': 'employee',
    'CMND/CCCD': '012345678901',
    'Ngày cấp CMND/CCCD': '2020-01-15',
    'Nơi cấp CMND/CCCD': 'CA TP Hà Nội',
    'Mã số thuế cá nhân': '0123456789',
    'Số sổ BHXH': '1234567890',
    'Email cá nhân': 'nguyenvanan@gmail.com',
    'Số điện thoại': '0901234567',
    // ĐỊA CHỈ THƯỜNG TRÚ
    'Tỉnh/TP thường trú': 'Hà Nội',
    'Phường/Xã thường trú': 'Phường Điện Biên',
    'Số nhà, đường thường trú': '123 Đường ABC',
    // ĐỊA CHỈ TẠM TRÚ
    'Tỉnh/TP tạm trú': 'Hà Nội',
    'Phường/Xã tạm trú': 'Phường Cống Vị',
    'Số nhà, đường tạm trú': '456 Đường XYZ',
    'Người liên hệ khẩn cấp': 'Nguyễn Văn Bảo',
    'SĐT khẩn cấp': '0901111222',
    'Mã phòng ban': 'PB001',
    'Tên phòng ban': 'Phòng Kinh doanh',
    'Bộ phận': 'Kinh doanh',
    'Mã chức vụ': 'CV001',
    'Tên chức vụ': 'Trưởng phòng',
    'Chức danh': 'Trưởng phòng Kinh doanh',
    'Loại nhân viên': 'Chính thức',
    'Trạng thái làm việc (*Mặc định: Đang làm việc)': 'Đang làm việc',
    'Trạng thái (*Mặc định: active)': 'active',
    'Ngày tuyển dụng': '2020-01-01',
    'Ngày bắt đầu làm việc': '2020-01-15',
    'Mã chi nhánh': '',
    'Ngày kết thúc thử việc': '2020-03-15',
    'Số hợp đồng': 'HD-2020-001',
    'Loại hợp đồng': 'Vô thời hạn',
    'Ngày bắt đầu HĐ': '2020-04-01',
    'Ngày kết thúc HĐ': '',
    'Số giờ/ngày (*Mặc định: 8)': '8',
    'Số ngày/tuần (*Mặc định: 5)': '5',
    'Ca làm việc': 'Hành chính',
    'Lương cơ bản': '25000000',
    'Lương đóng BHXH': '18000000',
    'Phụ cấp chức vụ': '5000000',
    'Phụ cấp ăn trưa': '730000',
    'Phụ cấp khác': '1000000',
    'Số người phụ thuộc': '2',
    'Số tài khoản': '0123456789012',
    'Ngân hàng': 'Vietcombank',
    'Chi nhánh': 'CN Hà Nội',
    'Số ngày phép còn': '12',
    'Số ngày đã nghỉ (*Mặc định: 0)': '3',
    'Kỹ năng': 'Excel, PowerPoint, Quản lý dự án',
    'Chứng chỉ': 'PMP, IELTS 7.0',
    'Mã quản lý trực tiếp': '',
    'Trình độ học vấn': 'Đại học',
    'Chuyên ngành': 'Quản trị kinh doanh',
    'Năm tốt nghiệp': '2012',
    'Trường': 'Đại học Kinh tế Quốc dân',
    'Ghi chú': 'Nhân viên xuất sắc',
  },
  {
    // NV2: Chỉ có địa chỉ thường trú (địa chỉ tạm trú để trống)
    'Mã nhân viên (*)': 'NV000011',
    'Họ và tên (*)': 'Trần Thị Bình',
    'Giới tính': 'Nữ',
    'Ngày sinh': '1995-08-20',
    'Nơi sinh': 'TP Hồ Chí Minh',
    'Quốc tịch': 'Việt Nam',
    'Tôn giáo': 'Phật giáo',
    'Tình trạng hôn nhân': 'Độc thân',
    'Email công ty': 'tranthibinh@company.com',
    'Mật khẩu': '123456',
    'Vai trò hệ thống (*Mặc định: employee)': 'employee',
    'CMND/CCCD': '079095012345',
    'Ngày cấp CMND/CCCD': '2021-06-10',
    'Nơi cấp CMND/CCCD': 'CA TP HCM',
    'Mã số thuế cá nhân': '',
    'Số sổ BHXH': '',
    'Email cá nhân': 'tranthibinh@gmail.com',
    'Số điện thoại': '0912345678',
    // ĐỊA CHỈ THƯỜNG TRÚ
    'Tỉnh/TP thường trú': 'TP Hồ Chí Minh',
    'Phường/Xã thường trú': 'Phường Bến Nghé',
    'Số nhà, đường thường trú': '456 Đường Nguyễn Huệ',
    // ĐỊA CHỈ TẠM TRÚ - Để trống (cùng nơi thường trú)
    'Tỉnh/TP tạm trú': '',
    'Phường/Xã tạm trú': '',
    'Số nhà, đường tạm trú': '',
    'Người liên hệ khẩn cấp': 'Trần Thị Hoa',
    'SĐT khẩn cấp': '0902222333',
    'Mã phòng ban': 'PB002',
    'Tên phòng ban': 'Phòng Nhân sự',
    'Bộ phận': 'Nhân sự',
    'Mã chức vụ': 'CV002',
    'Tên chức vụ': 'Nhân viên',
    'Chức danh': 'Chuyên viên Nhân sự',
    'Loại nhân viên': 'Chính thức',
    'Trạng thái làm việc (*Mặc định: Đang làm việc)': 'Đang làm việc',
    'Trạng thái (*Mặc định: active)': 'active',
    'Ngày tuyển dụng': '2022-05-01',
    'Ngày bắt đầu làm việc': '2022-05-15',
    'Mã chi nhánh': '',
    'Ngày kết thúc thử việc': '2022-07-15',
    'Số hợp đồng': 'HD-2022-015',
    'Loại hợp đồng': '1 năm',
    'Ngày bắt đầu HĐ': '2022-08-01',
    'Ngày kết thúc HĐ': '2023-07-31',
    'Số giờ/ngày (*Mặc định: 8)': '8',
    'Số ngày/tuần (*Mặc định: 5)': '5',
    'Ca làm việc': 'Hành chính',
    'Lương cơ bản': '15000000',
    'Lương đóng BHXH': '10000000',
    'Phụ cấp chức vụ': '',
    'Phụ cấp ăn trưa': '730000',
    'Phụ cấp khác': '',
    'Số người phụ thuộc': '0',
    'Số tài khoản': '9876543210123',
    'Ngân hàng': 'Techcombank',
    'Chi nhánh': 'CN Quận 1',
    'Số ngày phép còn': '12',
    'Số ngày đã nghỉ (*Mặc định: 0)': '0',
    'Kỹ năng': 'Tuyển dụng, Đào tạo',
    'Chứng chỉ': '',
    'Mã quản lý trực tiếp': 'NV001',
    'Trình độ học vấn': 'Đại học',
    'Chuyên ngành': 'Quản trị Nhân sự',
    'Năm tốt nghiệp': '2017',
    'Trường': 'Đại học Kinh tế TP.HCM',
    'Ghi chú': '',
  },
  {
    // NV3: Có cả 2 địa chỉ (ở khác nơi thường trú)
    'Mã nhân viên (*)': 'NV000012',
    'Họ và tên (*)': 'Lê Hoàng Cường',
    'Giới tính': 'Nam',
    'Ngày sinh': '1988-12-01',
    'Nơi sinh': 'Đà Nẵng',
    'Quốc tịch': 'Việt Nam',
    'Tôn giáo': '',
    'Tình trạng hôn nhân': 'Đã kết hôn',
    'Email công ty': 'lehoangcuong@company.com',
    'Mật khẩu': '123456',
    'Vai trò hệ thống (*Mặc định: employee)': 'manager',
    'CMND/CCCD': '048092123456',
    'Ngày cấp CMND/CCCD': '2019-03-20',
    'Nơi cấp CMND/CCCD': 'CA TP Đà Nẵng',
    'Mã số thuế cá nhân': '8123456789',
    'Số sổ BHXH': '1234509876543',
    'Email cá nhân': 'lehoangcuong@gmail.com',
    'Số điện thoại': '0923456789',
    // ĐỊA CHỈ THƯỜNG TRÚ (quê Đà Nẵng)
    'Tỉnh/TP thường trú': 'Đà Nẵng',
    'Phường/Xã thường trú': 'Phường Hải Châu 1',
    'Số nhà, đường thường trú': '789 Đường Nguyễn Văn Linh',
    // ĐỊA CHỈ TẠM TRÚ (làm việc tại Hà Nội)
    'Tỉnh/TP tạm trú': 'Hà Nội',
    'Phường/Xã tạm trú': 'Phường Trung Hòa',
    'Số nhà, đường tạm trú': '15 Ngõ 12 Trung Kính',
    'Người liên hệ khẩn cấp': 'Lê Thị Mai',
    'SĐT khẩn cấp': '0903333444',
    'Mã phòng ban': 'PB003',
    'Tên phòng ban': 'Phòng Kỹ thuật',
    'Bộ phận': 'Kỹ thuật',
    'Mã chức vụ': 'CV003',
    'Tên chức vụ': 'Giám đốc',
    'Chức danh': 'Giám đốc Kỹ thuật',
    'Loại nhân viên': 'Chính thức',
    'Trạng thái làm việc (*Mặc định: Đang làm việc)': 'Đang làm việc',
    'Trạng thái (*Mặc định: active)': 'active',
    'Ngày tuyển dụng': '2015-06-01',
    'Ngày bắt đầu làm việc': '2015-06-15',
    'Mã chi nhánh': '',
    'Ngày kết thúc thử việc': '2015-08-15',
    'Số hợp đồng': 'HD-2015-008',
    'Loại hợp đồng': 'Vô thời hạn',
    'Ngày bắt đầu HĐ': '2015-09-01',
    'Ngày kết thúc HĐ': '',
    'Số giờ/ngày (*Mặc định: 8)': '8',
    'Số ngày/tuần (*Mặc định: 5)': '5',
    'Ca làm việc': 'Hành chính',
    'Lương cơ bản': '45000000',
    'Lương đóng BHXH': '29800000',
    'Phụ cấp chức vụ': '10000000',
    'Phụ cấp ăn trưa': '730000',
    'Phụ cấp khác': '5000000',
    'Số người phụ thuộc': '3',
    'Số tài khoản': '1234509876543',
    'Ngân hàng': 'BIDV',
    'Chi nhánh': 'CN Đà Nẵng',
    'Số ngày phép còn': '15',
    'Số ngày đã nghỉ (*Mặc định: 0)': '5',
    'Kỹ năng': 'Java, Python, AWS, Docker',
    'Chứng chỉ': 'AWS Solutions Architect, PMP',
    'Mã quản lý trực tiếp': '',
    'Trình độ học vấn': 'Thạc sĩ',
    'Chuyên ngành': 'Khoa học Máy tính',
    'Năm tốt nghiệp': '2012',
    'Trường': 'Đại học Bách khoa Đà Nẵng',
    'Ghi chú': 'Thành viên ban lãnh đạo',
  },
];

// Tạo workbook
const wb = XLSX.utils.book_new();

// Tạo worksheet với headers
const ws = XLSX.utils.json_to_sheet(sampleData, {
  header: columns,
});

// Set column widths
const colWidths = columns.map((col) => {
  const headerWidth = col.length;
  // Find max data width for this column
  const dataWidths = sampleData.map(row => {
    const value = row[col as keyof typeof row];
    return value ? String(value).length : 0;
  });
  const maxDataWidth = Math.max(...dataWidths, 0);
  return { wch: Math.max(headerWidth, maxDataWidth) + 2 };
});
ws['!cols'] = colWidths;

// Thêm worksheet vào workbook
XLSX.utils.book_append_sheet(wb, ws, 'Nhân viên');

// Tạo worksheet hướng dẫn
const guideData = [
  ['HƯỚNG DẪN IMPORT NHÂN VIÊN'],
  [''],
  ['1. CÁC CỘT BẮT BUỘC:'],
  ['   - Mã nhân viên (*): Mã định danh duy nhất của nhân viên'],
  ['   - Họ và tên (*): Họ tên đầy đủ'],
  [''],
  ['2. ĐỊA CHỈ NHÂN VIÊN (Hệ thống 2 cấp):'],
  [''],
  ['   ★ ĐỊA CHỈ THƯỜNG TRÚ (bắt buộc):'],
  ['      - Tỉnh/TP thường trú: Chọn từ sheet DS Tỉnh-TP'],
  ['      - Phường/Xã thường trú: Chọn từ sheet DS Phường-Xã (2 cấp)'],
  ['      - Số nhà, đường thường trú: Nhập số nhà, tên đường'],
  [''],
  ['   ★ ĐỊA CHỈ TẠM TRÚ (tùy chọn):'],
  ['      - Tỉnh/TP tạm trú'],
  ['      - Phường/Xã tạm trú'],
  ['      - Số nhà, đường tạm trú'],
  ['      - Có thể để trống nếu trùng với địa chỉ thường trú'],
  [''],
  ['   VÍ DỤ TRONG FILE MẪU:'],
  ['   - NV1: Có cả địa chỉ thường trú và tạm trú (Hà Nội)'],
  ['   - NV2: Chỉ có địa chỉ thường trú (TP HCM)'],
  ['   - NV3: Thường trú Đà Nẵng, tạm trú Hà Nội'],
  [''],
  ['3. CÁC CỘT CÓ GIÁ TRỊ MẶC ĐỊNH:'],
  ['   - Vai trò hệ thống: employee'],
  ['   - Trạng thái làm việc: Đang làm việc'],
  ['   - Trạng thái: active'],
  ['   - Số giờ/ngày: 8'],
  ['   - Số ngày/tuần: 5'],
  ['   - Số ngày đã nghỉ: 0'],
  [''],
  ['4. ĐỊNH DẠNG NGÀY:'],
  ['   - Sử dụng định dạng: YYYY-MM-DD (ví dụ: 2023-01-15)'],
  ['   - Hoặc định dạng ngày của Excel'],
  [''],
  ['5. CHẾ ĐỘ IMPORT:'],
  ['   - Chỉ thêm mới: Bỏ qua nếu mã NV đã tồn tại'],
  ['   - Chỉ cập nhật: Chỉ cập nhật NV đã có'],
  ['   - Thêm mới + Cập nhật: Cập nhật nếu có, thêm mới nếu chưa có'],
  [''],
  ['6. LƯU Ý:'],
  ['   - Các dòng lỗi sẽ được bỏ qua, chỉ import dòng hợp lệ'],
  ['   - Có thể để trống các cột không bắt buộc'],
  ['   - Mật khẩu sẽ không được export để bảo mật'],
  ['   - Hệ thống tự động lookup mã từ tên địa chỉ'],
];

const guideWs = XLSX.utils.aoa_to_sheet(guideData);
guideWs['!cols'] = [{ wch: 80 }];
XLSX.utils.book_append_sheet(wb, guideWs, 'Hướng dẫn');

// ============================================
// SHEET DANH MỤC ĐỊA CHỈ
// ============================================

// Sheet Tỉnh/Thành phố
const provinceSheetData = [
  ['MÃ TỈNH', 'TÊN TỈNH/THÀNH PHỐ'],
  ...PROVINCES_DATA.map(p => [p.id, p.name])
];
const provinceWs = XLSX.utils.aoa_to_sheet(provinceSheetData);
provinceWs['!cols'] = [{ wch: 10 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, provinceWs, 'DS Tỉnh-TP');

// Sheet Quận/Huyện (3-level) - group by province
const districtSheetData: string[][] = [
  ['MÃ TỈNH', 'TÊN TỈNH/TP', 'MÃ QUẬN/HUYỆN', 'TÊN QUẬN/HUYỆN']
];

// Group districts by province
const districtsByProvince = new Map<string, typeof DISTRICTS_DATA>();
DISTRICTS_DATA.forEach(d => {
  const provinceId = String(d.provinceId);
  if (!districtsByProvince.has(provinceId)) {
    districtsByProvince.set(provinceId, []);
  }
  districtsByProvince.get(provinceId)!.push(d);
});

// Add districts sorted by province
PROVINCES_DATA.forEach(province => {
  const districts = districtsByProvince.get(province.id) || [];
  districts.forEach(d => {
    districtSheetData.push([
      province.id,
      province.name,
      String(d.id),
      d.name
    ]);
  });
});

const districtWs = XLSX.utils.aoa_to_sheet(districtSheetData);
districtWs['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, districtWs, 'DS Quận-Huyện (3 cấp)');

// Sheet Phường/Xã 2-level - group by province
const ward2LevelSheetData: string[][] = [
  ['MÃ TỈNH', 'TÊN TỈNH/TP', 'MÃ PHƯỜNG/XÃ', 'TÊN PHƯỜNG/XÃ']
];

// Group 2-level wards by province
const wards2ByProvince = new Map<string, typeof WARDS_2LEVEL_DATA>();
WARDS_2LEVEL_DATA.forEach(w => {
  const provinceId = String(w.provinceId);
  if (!wards2ByProvince.has(provinceId)) {
    wards2ByProvince.set(provinceId, []);
  }
  wards2ByProvince.get(provinceId)!.push(w);
});

// Add wards sorted by province
PROVINCES_DATA.forEach(province => {
  const wards = wards2ByProvince.get(province.id) || [];
  wards.forEach(w => {
    ward2LevelSheetData.push([
      province.id,
      province.name,
      w.id,
      w.name
    ]);
  });
});

const ward2LevelWs = XLSX.utils.aoa_to_sheet(ward2LevelSheetData);
ward2LevelWs['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, ward2LevelWs, 'DS Phường-Xã (2 cấp)');

// Sheet Phường/Xã 3-level - group by district
const ward3LevelSheetData: string[][] = [
  ['MÃ TỈNH', 'TÊN TỈNH/TP', 'MÃ QUẬN/HUYỆN', 'TÊN QUẬN/HUYỆN', 'MÃ PHƯỜNG/XÃ', 'TÊN PHƯỜNG/XÃ']
];

// Group 3-level wards by district
const wards3ByDistrict = new Map<number, typeof WARDS_3LEVEL_DATA>();
WARDS_3LEVEL_DATA.forEach(w => {
  if (!wards3ByDistrict.has(w.districtId)) {
    wards3ByDistrict.set(w.districtId, []);
  }
  wards3ByDistrict.get(w.districtId)!.push(w);
});

// Add wards sorted by province -> district
PROVINCES_DATA.forEach(province => {
  const districts = districtsByProvince.get(province.id) || [];
  districts.forEach(district => {
    const wards = wards3ByDistrict.get(district.id) || [];
    wards.forEach(w => {
      ward3LevelSheetData.push([
        province.id,
        province.name,
        String(district.id),
        district.name,
        w.id,
        w.name
      ]);
    });
  });
});

const ward3LevelWs = XLSX.utils.aoa_to_sheet(ward3LevelSheetData);
ward3LevelWs['!cols'] = [
  { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 30 }
];
XLSX.utils.book_append_sheet(wb, ward3LevelWs, 'DS Phường-Xã (3 cấp)');

// Tạo thư mục nếu chưa có
const templatesDir = path.join(__dirname, '..', 'public', 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Lưu file
const outputPath = path.join(templatesDir, 'Mau_Import_NhanVien.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Đã tạo file mẫu: ${outputPath}`);
console.log(`📊 Số cột: ${columns.length}`);
console.log(`📝 Số dòng mẫu: ${sampleData.length}`);
console.log('');
console.log('Các sheet trong file:');
console.log('1. Nhân viên - Sheet chính để nhập dữ liệu');
console.log('2. Hướng dẫn - Hướng dẫn chi tiết');
console.log(`3. DS Tỉnh-TP - ${PROVINCES_DATA.length} tỉnh/thành phố`);
console.log(`4. DS Quận-Huyện (3 cấp) - ${DISTRICTS_DATA.length} quận/huyện`);
console.log(`5. DS Phường-Xã (2 cấp) - ${WARDS_2LEVEL_DATA.length} phường/xã`);
console.log(`6. DS Phường-Xã (3 cấp) - ${WARDS_3LEVEL_DATA.length} phường/xã`);
console.log('');
console.log('Các nhóm cột:');
console.log('- Thông tin cơ bản: 8 cột');
console.log('- Thông tin đăng nhập: 3 cột');
console.log('- Giấy tờ tùy thân: 5 cột');
console.log('- Liên hệ: 2 cột');
console.log('- Địa chỉ thường trú: 3 cột (Tỉnh/TP, Phường/Xã, Số nhà đường)');
console.log('- Địa chỉ tạm trú: 3 cột (Tỉnh/TP, Phường/Xã, Số nhà đường)');
console.log('- Liên hệ khẩn cấp: 2 cột');
console.log('- Công việc: 12 cột');
console.log('- Hợp đồng: 5 cột');
console.log('- Thời gian làm việc: 3 cột');
console.log('- Lương: 6 cột');
console.log('- Ngân hàng: 3 cột');
console.log('- Nghỉ phép: 2 cột');
console.log('- Khác: 8 cột');
console.log('');
console.log('📍 Địa chỉ nhân viên sử dụng hệ thống 2 cấp (Tỉnh/TP → Phường/Xã)');
