import type { Metadata } from 'next'
import { TaxesPage } from '@/features/settings/taxes-page'

export const metadata: Metadata = {
  title: 'Thuế',
  description: 'Quản lý cài đặt thuế',
}

export default function Page() {
  return <TaxesPage />
}
