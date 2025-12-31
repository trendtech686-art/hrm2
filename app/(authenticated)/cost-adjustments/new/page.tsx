import type { Metadata } from 'next'
import { CostAdjustmentFormPage } from '@/features/cost-adjustments/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu điều chỉnh giá',
  description: 'Tạo phiếu điều chỉnh giá sản phẩm',
}

export default function Page() {
  return <CostAdjustmentFormPage />
}
