import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentsPage } from '@/features/payments/page'
import { getPaymentSummary } from '@/lib/data/payments'
import { TableSkeleton } from '@/components/shared/table-skeleton'

export const metadata: Metadata = {
  title: 'Thanh toán',
  description: 'Quản lý phiếu thanh toán',
}

export const dynamic = 'force-dynamic'

async function PaymentsPageWithData() {
  const stats = await getPaymentSummary()
  return <PaymentsPage initialStats={stats} />
}

export default function Page() {
  return (
    <Suspense fallback={<PaymentsSkeleton />}>
      <PaymentsPageWithData />
    </Suspense>
  )
}

function PaymentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={7} />
    </div>
  )
}
