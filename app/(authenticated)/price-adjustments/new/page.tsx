import type { Metadata } from 'next';
import { PriceAdjustmentFormPage } from '@/features/price-adjustments/form-page';

export const metadata: Metadata = {
  title: 'Tạo phiếu điều chỉnh giá bán',
  description: 'Tạo phiếu điều chỉnh giá bán mới',
};

export default function NewPriceAdjustmentPage() {
  return <PriceAdjustmentFormPage />;
}
