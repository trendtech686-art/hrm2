import type { Metadata } from 'next'
import { ComplaintFormPage } from '@/features/complaints/components/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa khiếu nại',
  description: 'Chỉnh sửa thông tin khiếu nại',
}

export default function Page() {
  return <ComplaintFormPage />
}
