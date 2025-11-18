import type { ReceiptType } from './types.ts';

export const data: ReceiptType[] = [
  { systemId: 'RT000001', id: 'THANHTOAN', name: 'Thanh toán cho đơn hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#10b981' },
  { systemId: 'RT000002', id: 'DATCOC', name: 'Đối tác vận chuyển đặt cọc', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#3b82f6' },
  { systemId: 'RT000003', id: 'THUNO', name: 'Thu nợ đối tác vận chuyển', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#8b5cf6' },
  { systemId: 'RT000004', id: 'RVGN7', name: 'Thu nhập khác', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#06b6d4' },
  { systemId: 'RT000005', id: 'RVGN6', name: 'Tiền thưởng', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#f59e0b' },
  { systemId: 'RT000006', id: 'RVGN5', name: 'Tiền bồi thường', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#ef4444' },
  { systemId: 'RT000007', id: 'RVGN4', name: 'Cho thuê tài sản', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#14b8a6' },
  { systemId: 'RT000008', id: 'RVGN3', name: 'Nhượng bán, thanh lý tài sản', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#a855f7' },
  { systemId: 'RT000009', id: 'RVGN2', name: 'Thu nợ khách hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#ec4899' },
  { systemId: 'RT000010', id: 'TUDONG', name: 'Tự động', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: 'RT000011', id: 'NCCHT', name: 'Nhà cung cấp hoàn tiền', description: 'Ghi nhận khoản tiền NCC hoàn lại do hủy đơn, trả hàng...', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#0ea5e9' },
  { systemId: 'RT000012', id: 'DOISOATCOD', name: 'Đối soát COD', description: 'Ghi nhận tiền thu hộ COD từ đối tác vận chuyển.', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#22c55e' },
  { systemId: 'RT000013', id: 'THUBH', name: 'Thu tiền bảo hành', description: 'Thu thêm tiền từ khách hàng do chi phí bảo hành (không trừ vào đơn hàng)', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#f97316' },
  { systemId: 'RT000014', id: 'THUVAO_DONHANG', name: 'Thu bảo hành vào đơn hàng', description: 'Thu tiền bảo hành và trừ vào đơn hàng của khách', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#06b6d4' },
  { systemId: 'RT000015', id: 'CHIPHI_PHATSINH', name: 'Chi phí phát sinh', description: 'Thu chi phí phát sinh từ nhân viên do lỗi xử lý khiếu nại', isBusinessResult: false, createdAt: '2025-11-10', isActive: true, color: '#dc2626' },
];
