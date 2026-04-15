import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentFormPage } from '@/features/payments/form-page'
import { getPaymentFormOptions } from '@/lib/data/payment-form-options'
import { FormSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Tạo phiếu chi mới',
  description: 'Tạo phiếu chi mới',
}

async function PaymentFormWithData() {
  const options = await getPaymentFormOptions()
  return <PaymentFormPage initialOptions={options} />
}

export default function Page() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PaymentFormWithData />
    </Suspense>
  )
}
