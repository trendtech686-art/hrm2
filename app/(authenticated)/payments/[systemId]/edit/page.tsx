import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentFormPage } from '@/features/payments/form-page'
import { getPaymentFormOptions } from '@/lib/data/payment-form-options'
import { FormSkeleton } from '@/components/shared/table-skeleton'

type Props = { params: Promise<{ systemId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  return {
    title: `Chỉnh sửa phiếu chi ${systemId}`,
    description: 'Chỉnh sửa thông tin phiếu chi',
  }
}

async function PaymentFormWithData({ systemId }: { systemId: string }) {
  const initialOptions = await getPaymentFormOptions()
  return <PaymentFormPage systemId={systemId} initialOptions={initialOptions} />
}

export default async function Page({ params }: Props) {
  const { systemId } = await params
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PaymentFormWithData systemId={systemId} />
    </Suspense>
  )
}
