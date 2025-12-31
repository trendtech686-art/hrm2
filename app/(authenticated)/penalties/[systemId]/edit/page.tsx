import type { Metadata } from 'next'
import { PenaltyFormPage } from '@/features/settings/penalties/penalty-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phiếu phạt',
  description: 'Chỉnh sửa thông tin phiếu phạt',
}

export default function Page() {
  return <PenaltyFormPage />
}
