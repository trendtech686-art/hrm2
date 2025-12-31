import type { Metadata } from 'next'
import { CashbookPage } from '@/features/cashbook/page'

export const metadata: Metadata = {
  title: 'Sổ quỹ',
  description: 'Quản lý sổ quỹ tiền mặt',
}

export default function Page() {
  return <CashbookPage />
}
