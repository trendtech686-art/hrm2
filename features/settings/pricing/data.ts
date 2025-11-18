import type { PricingPolicy } from './types.ts';

export const data: PricingPolicy[] = [
  { systemId: 'PP000001', id: '10', name: '10', description: 'Giá mặc định', type: 'Bán hàng', isDefault: true, isActive: true },
  { systemId: 'PP000002', id: 'GIANHAP', name: 'Giá nhập', description: 'Giá nhập hàng từ nhà cung cấp', type: 'Nhập hàng', isDefault: true, isActive: true },
  { systemId: 'PP000003', id: 'BANLE', name: 'Giá bán lẻ', description: 'Giá bán cho khách lẻ', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: 'PP000004', id: 'BANBUON', name: 'Giá bán buôn', description: 'Giá bán sỉ cho đại lý', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: 'PP000005', id: 'shopee', name: 'shopee', description: 'Giá bán trên Shopee', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: 'PP000006', id: 'tiktok', name: 'tiktok', description: 'Giá bán trên TikTok', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: 'PP000007', id: 'ace', name: 'ace', description: 'Giá bán ACE', type: 'Bán hàng', isDefault: false, isActive: false },
  { systemId: 'PP000008', id: 'idweb', name: 'idweb', description: 'Giá bán web', type: 'Bán hàng', isDefault: false, isActive: true },
];
