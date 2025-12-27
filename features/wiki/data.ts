import type { WikiArticle } from '@/lib/types/prisma-extended';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: WikiArticle[] = [
  {
    systemId: asSystemId('WIKI000001'),
    id: asBusinessId('WIKI000001'),
    title: 'Quy định nghỉ phép năm 2025',
    content: `
# Quy định về việc nghỉ phép năm

## 1. Số ngày nghỉ phép
- Mỗi nhân viên chính thức có 12 ngày nghỉ phép/năm.
- Cứ mỗi 5 năm làm việc, nhân viên được cộng thêm 1 ngày phép theo quy định của Luật Lao động.

## 2. Quy trình xin nghỉ
- Nhân viên cần tạo đơn xin nghỉ phép trên hệ thống HRM.
- Đơn phải được tạo trước ngày nghỉ ít nhất 3 ngày làm việc (không tính T7, CN).
- Các trường hợp khẩn cấp (ốm đau, tai nạn, gia đình có việc hiếu) cần báo trực tiếp cho quản lý và bổ sung đơn sau.

## 3. Các lưu ý
- Phép năm không được quy đổi thành tiền mặt, trừ trường hợp nghỉ việc.
- Phép tồn từ năm trước sẽ được chuyển sang năm sau và có giá trị sử dụng đến hết ngày 31/03 của năm sau.
    `,
    category: 'Quy định & Chính sách',
    tags: ['nghỉ phép', 'chính sách', 'nhân sự'],
    author: 'Phạm Thị Dung',
    ...buildSeedAuditFields({
      createdAt: '2025-01-15T08:00:00Z',
      updatedAt: '2025-02-01T08:00:00Z',
      createdBy: asSystemId('EMP000010'),
      updatedBy: asSystemId('EMP000010'),
    }),
  },
  {
    systemId: asSystemId('WIKI000002'),
    id: asBusinessId('WIKI000002'),
    title: 'Hướng dẫn sử dụng hệ thống CRM',
    content: `
# Hướng dẫn sử dụng hệ thống CRM

## 1. Đăng nhập
- Truy cập vào địa chỉ: [https://crm.acme.corp](https://crm.acme.corp)
- Sử dụng email và mật khẩu công ty đã cấp.

## 2. Quản lý khách hàng
- Để thêm khách hàng mới, vào mục "Khách hàng" và nhấn nút "Thêm mới".
- Điền đầy đủ thông tin bắt buộc.
- Luôn cập nhật trạng thái tương tác với khách hàng sau mỗi cuộc gọi/email.

## 3. Tạo báo giá & Đơn hàng
- Từ trang chi tiết khách hàng, chọn "Tạo báo giá".
- Thêm các sản phẩm/dịch vụ và lưu lại.
- Sau khi khách hàng xác nhận, chuyển báo giá thành đơn hàng.
    `,
    category: 'Hướng dẫn & Quy trình',
    tags: ['crm', 'kinh doanh', 'hướng dẫn'],
    author: 'Trần Thị Bình',
    ...buildSeedAuditFields({
      createdAt: '2025-03-10T08:00:00Z',
      updatedAt: '2025-05-20T08:00:00Z',
      createdBy: asSystemId('EMP000012'),
      updatedBy: asSystemId('EMP000012'),
    }),
  },
    {
    systemId: asSystemId('WIKI000003'),
    id: asBusinessId('WIKI000003'),
    title: 'Chính sách làm việc từ xa',
    content: `
# Chính sách làm việc từ xa (Remote Work)

## 1. Đối tượng áp dụng
- Nhân viên thuộc các bộ phận Kỹ thuật, Marketing có thể đăng ký làm việc từ xa.
- Các bộ phận khác sẽ được xem xét theo từng trường hợp cụ thể.

## 2. Yêu cầu
- Nhân viên phải đảm bảo có không gian làm việc yên tĩnh và kết nối internet ổn định.
- Phải tham gia đầy đủ các cuộc họp online và báo cáo công việc hàng ngày.
- Giờ làm việc vẫn tuân thủ theo quy định chung của công ty (8:30 - 17:30).

## 3. Đăng ký
- Gửi email đăng ký cho Trưởng phòng và phòng Nhân sự.
- Đăng ký sẽ được duyệt dựa trên hiệu suất công việc và tính chất công việc.
    `,
    category: 'Quy định & Chính sách',
    tags: ['remote', 'work from home', 'chính sách'],
    author: 'Phạm Thị Dung',
    ...buildSeedAuditFields({
      createdAt: '2025-06-01T08:00:00Z',
      updatedAt: '2025-06-05T08:00:00Z',
      createdBy: asSystemId('EMP000010'),
      updatedBy: asSystemId('EMP000014'),
    }),
  },
];
