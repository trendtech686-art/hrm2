import type { Metadata } from 'next';
import { PriceAdjustmentDetailPage } from '@/features/price-adjustments/detail-page';

export const metadata: Metadata = {
  title: 'Chi tiết điều chỉnh giá bán',
  description: 'Xem thông tin phiếu điều chỉnh giá bán',
};

export default function Page() {
  return <PriceAdjustmentDetailPage />;
}
