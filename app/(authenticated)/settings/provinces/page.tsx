import type { Metadata } from 'next'
import { ProvincesPage } from '@/features/settings/provinces/page'

export const metadata: Metadata = {
  title: 'Tỉnh/Thành phố',
  description: 'Quản lý danh sách tỉnh thành',
}

export default function Page() {
  return <ProvincesPage />
}
