import type { Metadata } from 'next'
import { CreateReconciliationSheetPage } from '@/features/reconciliation/create-sheet-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu đối soát',
  description: 'Tạo phiếu đối soát COD',
}

export default function Page() {
  return <CreateReconciliationSheetPage />
}
