import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PricingPolicy } from './types.ts';

export const data: PricingPolicy[] = [
  { systemId: asSystemId('PP000001'), id: asBusinessId('10'), name: '10', description: 'Giá mặc định', type: 'Bán hàng', isDefault: true, isActive: true },
  { systemId: asSystemId('PP000002'), id: asBusinessId('GIANHAP'), name: 'Giá nhập', description: 'Giá nhập hàng từ nhà cung cấp', type: 'Nhập hàng', isDefault: true, isActive: true },
  { systemId: asSystemId('PP000003'), id: asBusinessId('BANLE'), name: 'Giá bán lẻ', description: 'Giá bán cho khách lẻ', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: asSystemId('PP000004'), id: asBusinessId('BANBUON'), name: 'Giá bán buôn', description: 'Giá bán sỉ cho đại lý', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: asSystemId('PP000005'), id: asBusinessId('SHOPEE'), name: 'shopee', description: 'Giá bán trên Shopee', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: asSystemId('PP000006'), id: asBusinessId('TIKTOK'), name: 'tiktok', description: 'Giá bán trên TikTok', type: 'Bán hàng', isDefault: false, isActive: true },
  { systemId: asSystemId('PP000007'), id: asBusinessId('ACE'), name: 'ace', description: 'Giá bán ACE', type: 'Bán hàng', isDefault: false, isActive: false },
  { systemId: asSystemId('PP000008'), id: asBusinessId('IDWEB'), name: 'idweb', description: 'Giá bán web', type: 'Bán hàng', isDefault: false, isActive: true },
];
