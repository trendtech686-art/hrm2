import type { Metadata } from 'next'
import { ReconciliationPage } from '@/features/reconciliation/page'

export const metadata: Metadata = {
  title: 'Đối chiếu công nợ',
  description: 'Quản lý đối chiếu công nợ khách hàng',
}

export default function Page() {
  return <ReconciliationPage />
}
