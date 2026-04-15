import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReceiptFormPage } from '@/features/receipts/form-page'
import { getReceiptFormOptions } from '@/lib/data/payment-form-options'
import { FormSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Tạo phiếu thu mới',
  description: 'Tạo phiếu thu tiền mới',
}

async function ReceiptFormWithData() {
  const initialOptions = await getReceiptFormOptions()
  return <ReceiptFormPage initialOptions={initialOptions} />
}

export default function Page() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ReceiptFormWithData />
    </Suspense>
  )
}
