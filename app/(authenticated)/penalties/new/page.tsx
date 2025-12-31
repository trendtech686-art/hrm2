import type { Metadata } from 'next'
import { PenaltyFormPage } from '@/features/settings/penalties/penalty-form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu phạt mới',
  description: 'Tạo phiếu phạt nhân viên',
}

export default function Page() {
  return <PenaltyFormPage />
}
