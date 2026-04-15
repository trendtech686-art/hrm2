import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReceiptFormPage } from '@/features/receipts/form-page'
import { getReceiptFormOptions } from '@/lib/data/payment-form-options'
import { FormSkeleton } from '@/components/shared/table-skeleton'

type Props = { params: Promise<{ systemId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  return {
    title: `Chỉnh sửa phiếu thu ${systemId}`,
    description: 'Chỉnh sửa thông tin phiếu thu',
  }
}

async function ReceiptFormWithData({ systemId }: { systemId: string }) {
  const initialOptions = await getReceiptFormOptions()
  return <ReceiptFormPage systemId={systemId} initialOptions={initialOptions} />
}

export default async function Page({ params }: Props) {
  const { systemId } = await params
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ReceiptFormWithData systemId={systemId} />
    </Suspense>
  )
}
