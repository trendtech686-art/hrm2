import type { Metadata } from 'next'
import { StoreInfoPage } from '@/features/settings/store-info/store-info-page'

export const metadata: Metadata = {
  title: 'Thông tin cửa hàng',
  description: 'Quản lý thông tin cửa hàng',
}

export default function Page() {
  return <StoreInfoPage />
}
