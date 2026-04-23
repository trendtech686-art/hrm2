'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '../../components/ui/skeleton'
import { Card, CardContent, CardHeader } from '../../components/ui/card'

// Loading skeleton that matches the reports page layout
function ReportsPageLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex gap-4 flex-wrap">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Summary cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-75 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Dynamic import of the reports page with SSR disabled to defer recharts loading
export const DynamicCashbookReportsPage = dynamic(
  () => import('./reports-page').then(mod => mod.CashbookReportsPage),
  { 
    ssr: false, 
    loading: () => <ReportsPageLoading /> 
  }
)

export default DynamicCashbookReportsPage
