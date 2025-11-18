import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { ReceiptType } from './types.ts';

export const data: ReceiptType[] = [
  { systemId: asSystemId('RT000001'), id: asBusinessId('THANHTOAN'), name: 'Thanh toán cho đơn hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#10b981' },
  { systemId: asSystemId('RT000002'), id: asBusinessId('DATCOC'), name: 'Đối tác vận chuyển đặt cọc', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#3b82f6' },
  { systemId: asSystemId('RT000003'), id: asBusinessId('THUNO'), name: 'Thu nợ đối tác vận chuyển', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#8b5cf6' },
  { systemId: asSystemId('RT000004'), id: asBusinessId('RVGN7'), name: 'Thu nhập khác', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#06b6d4' },
  { systemId: asSystemId('RT000005'), id: asBusinessId('RVGN6'), name: 'Tiền thưởng', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#f59e0b' },
  { systemId: asSystemId('RT000006'), id: asBusinessId('RVGN5'), name: 'Tiền bồi thường', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#ef4444' },
  { systemId: asSystemId('RT000007'), id: asBusinessId('RVGN4'), name: 'Cho thuê tài sản', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#14b8a6' },
  { systemId: asSystemId('RT000008'), id: asBusinessId('RVGN3'), name: 'Nhượng bán, thanh lý tài sản', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#a855f7' },
  { systemId: asSystemId('RT000009'), id: asBusinessId('RVGN2'), name: 'Thu nợ khách hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#ec4899' },
  { systemId: asSystemId('RT000010'), id: asBusinessId('TUDONG'), name: 'Tự động', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: asSystemId('RT000011'), id: asBusinessId('NCCHT'), name: 'Nhà cung cấp hoàn tiền', description: 'Ghi nhận khoản tiền NCC hoàn lại do hủy đơn, trả hàng...', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#0ea5e9' },
  { systemId: asSystemId('RT000012'), id: asBusinessId('DOISOATCOD'), name: 'Đối soát COD', description: 'Ghi nhận tiền thu hộ COD từ đối tác vận chuyển.', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#22c55e' },
  { systemId: asSystemId('RT000013'), id: asBusinessId('THUBH'), name: 'Thu tiền bảo hành', description: 'Thu thêm tiền từ khách hàng do chi phí bảo hành (không trừ vào đơn hàng)', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#f97316' },
  { systemId: asSystemId('RT000014'), id: asBusinessId('THUVAO_DONHANG'), name: 'Thu bảo hành vào đơn hàng', description: 'Thu tiền bảo hành và trừ vào đơn hàng của khách', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#06b6d4' },
  { systemId: asSystemId('RT000015'), id: asBusinessId('CHIPHI_PHATSINH'), name: 'Chi phí phát sinh', description: 'Thu chi phí phát sinh từ nhân viên do lỗi xử lý khiếu nại', isBusinessResult: false, createdAt: '2025-11-10', isActive: true, color: '#dc2626' },
];
