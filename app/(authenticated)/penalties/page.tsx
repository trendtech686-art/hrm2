import type { Metadata } from 'next'
import { PenaltiesPage } from '@/features/settings/penalties/page'

export const metadata: Metadata = {
  title: 'Quản lý phạt',
  description: 'Quản lý các loại phạt và phiếu phạt',
}

export default function Page() {
  return <PenaltiesPage />
}
