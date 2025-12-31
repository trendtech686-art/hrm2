import type { Metadata } from 'next'
import { ComplaintFormPage } from '@/features/complaints/components/form-page'

export const metadata: Metadata = {
  title: 'Tạo khiếu nại mới',
  description: 'Tạo phiếu khiếu nại mới',
}

export default function Page() {
  return <ComplaintFormPage />
}
