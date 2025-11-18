import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PaymentType } from './types.ts';

export const data: PaymentType[] = [
  { systemId: asSystemId('PT000001'), id: asBusinessId('PVGN18'), name: 'Chi phí vận chuyển', description: '', isBusinessResult: true, createdAt: '2025-09-16', isActive: true, color: '#0ea5e9' },
  { systemId: asSystemId('PT000002'), id: asBusinessId('PVGN17'), name: 'Chi phí văn phòng phẩm', description: '', isBusinessResult: true, createdAt: '2025-09-16', isActive: true, color: '#8b5cf6' },
  { systemId: asSystemId('PT000003'), id: asBusinessId('HOANTIEN'), name: 'Hoàn tiền khách hàng', description: 'Ghi nhận các khoản hoàn tiền cho khách hàng do hủy đơn, trả hàng...', isBusinessResult: false, createdAt: '2025-09-16', isActive: true, color: '#ef4444' },
  { systemId: asSystemId('PT000004'), id: asBusinessId('THANHTOANDONNHAP'), name: 'Thanh toán cho đơn nhập hàng', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#10b981' },
  { systemId: asSystemId('PT000014'), id: asBusinessId('HOANTIEN_BH'), name: 'Hoàn tiền bảo hành', description: 'Hoàn tiền cho khách hàng do bảo hành sản phẩm (không trừ vào đơn hàng)', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#f97316' },
  { systemId: asSystemId('PT000015'), id: asBusinessId('TRAVAO_DONHANG'), name: 'Trả bảo hành vào đơn hàng', description: 'Khách nhận sản phẩm bảo hành và đặt đơn mới, trừ tiền vào đơn hàng', isBusinessResult: false, createdAt: '2025-11-09', isActive: true, color: '#06b6d4' },
  { systemId: asSystemId('PT000005'), id: asBusinessId('TRANO'), name: 'Trả nợ đối tác vận chuyển', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#f59e0b' },
  { systemId: asSystemId('PT000006'), id: asBusinessId('PVGN15'), name: 'Chi phí khác', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: asSystemId('PT000007'), id: asBusinessId('PVGN14'), name: 'Chi phí sản xuất', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#14b8a6' },
  { systemId: asSystemId('PT000008'), id: asBusinessId('PVGN13'), name: 'Chi phí nguyên - vật liệu', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#22c55e' },
  { systemId: asSystemId('PT000009'), id: asBusinessId('PVGN12'), name: 'Chi phí sinh hoạt', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#ec4899' },
  { systemId: asSystemId('PT000010'), id: asBusinessId('PVGN11'), name: 'Chi phí nhân công', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#3b82f6' },
  { systemId: asSystemId('PT000011'), id: asBusinessId('PVGN10'), name: 'Chi phí bán hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#a855f7' },
  { systemId: asSystemId('PT000012'), id: asBusinessId('PVGN9'), name: 'Chi phí quản lý cửa hàng', description: '', isBusinessResult: true, createdAt: '2024-12-31', isActive: true, color: '#06b6d4' },
  { systemId: asSystemId('PT000013'), id: asBusinessId('TUDONG'), name: 'Tự động', description: '', isBusinessResult: false, createdAt: '2024-12-31', isActive: true, color: '#6b7280' },
  { systemId: asSystemId('PT000016'), id: asBusinessId('BUTRU_KHIEUNAI'), name: 'Bù trừ khiếu nại', description: 'Chi phí bù trừ cho khách hàng do khiếu nại đơn hàng', isBusinessResult: false, createdAt: '2025-11-10', isActive: true, color: '#dc2626' },
];
