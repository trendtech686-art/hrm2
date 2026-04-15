import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load entire org chart page — ReactFlow (~150KB) is only needed here
const OrganizationChartPage = dynamic(
  () => import('@/features/settings/departments/organization-chart/page').then(m => ({ default: m.OrganizationChartPage })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-9rem)] flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="flex-1 rounded-lg" />
      </div>
    ),
  }
)

export const metadata: Metadata = {
  title: 'Sơ đồ tổ chức',
  description: 'Xem sơ đồ cấu trúc tổ chức công ty',
}

export default function Page() {
  return <OrganizationChartPage />
}
