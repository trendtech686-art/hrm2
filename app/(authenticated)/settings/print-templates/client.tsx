'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const PrintTemplatesPage = dynamic(
  () => import('@/features/settings/printer/print-templates-page').then(m => ({ default: m.PrintTemplatesPage })),
  { ssr: false, loading: () => <div className="p-4 space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-[60vh] w-full" /></div> }
)

export default function PrintTemplatesClient() {
  return <PrintTemplatesPage />
}
