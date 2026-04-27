import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ComplaintFormPage } from '@/features/complaints/components/form-page'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Tạo khiếu nại mới',
  description: 'Tạo phiếu khiếu nại mới',
}

function FormPageSkeleton() {
  return (
    <div className="container py-6 space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-60 w-full" />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<FormPageSkeleton />}>
      <ComplaintFormPage />
    </Suspense>
  )
}
