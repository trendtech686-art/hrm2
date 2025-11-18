import type { PaymentType } from './types.ts';

export const data: PaymentType[] = [
  { systemId: 'PT000001', id: 'PVGN18', name: 'Chi phí vận chuyển', description: '', isBusinessResult: true, createdAt: '2025-09-16', isActive: true, color: '#0ea5e9' },
  { systemId: 'PT000002', id: 'PVGN17', name: 'Chi phí văn phòng phẩm', description: '', isBusinessResult: true, createdAt: '2025-09-16', isActive: true, color: '#8b5cf6' },
  { systemId: 'PT000003', id: 'HOANTIEN', name: 'Hoàn tiền khách hàng', description: 'Ghi nhận các khoản hoàn tiền cho khách hàng do hủy đơn, trả hàng...', isBusinessResult: false, createdAt: '2025-09-16', isActive: true, color: '#ef4444' },
  { systemId: 'PT000004', id: 'THANHTOANDONNHAP', name: 'Thanh toán cho đơn nhập hàng', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#10b981' },
  { systemId: 'PT000014', id: 'HOANTIEN_BH', name: 'Hoàn tiền bảo hành', description: 'Hoàn tiền cho khách hàng do bảo hành sản phẩm (không trừ vào đơn hàng)', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#f97316' },
  { systemId: 'PT000015', id: 'TRAVAO_DONHANG', name: 'Trả bảo hành vào đơn hàng', description: 'Khách nhận sản phẩm bảo hành và đặt đơn mới, trừ tiền vào đơn hàng', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#06b6d4' },
  { systemId: 'PT000005', id: 'TRANO', name: 'Trả nợ đối tác vận chuyển', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#f59e0b' },
  { systemId: 'PT000006', id: 'PVGN15', name: 'Chi phí khác', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: 'PT000007', id: 'PVGN14', name: 'Chi phí sản xuất', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#14b8a6' },
  { systemId: 'PT000008', id: 'PVGN13', name: 'Chi phí nguyên - vật liệu', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#22c55e' },
  { systemId: 'PT000009', id: 'PVGN12', name: 'Chi phí sinh hoạt', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#ec4899' },
  { systemId: 'PT000010', id: 'PVGN11', name: 'Chi phí nhân công', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#3b82f6' },
  { systemId: 'PT000011', id: 'PVGN10', name: 'Chi phí bán hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#a855f7' },
  { systemId: 'PT000012', id: 'PVGN9', name: 'Chi phí quản lý cửa hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#06b6d4' },
  { systemId: 'PT000013', id: 'TUDONG', name: 'Tự động', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: 'PT000016', id: 'BUTRU_KHIEUNAI', name: 'Bù trừ khiếu nại', description: 'Chi phí bù trừ cho khách hàng do khiếu nại đơn hàng', isBusinessResult: false, createdAt: '2025-11-10', isActive: true, color: '#dc2626' },
];
