'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from './skeleton'
import { Card, CardContent, CardHeader } from './card'

// Loading component that matches the chart card structure
function ChartLoading({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full" style={{ height }} />
      </CardContent>
    </Card>
  )
}

// Dynamic imports with SSR disabled and loading states
export const DynamicChartLine = dynamic(
  () => import('./chart').then(mod => mod.ChartLine),
  { 
    ssr: false, 
    loading: () => <ChartLoading /> 
  }
)

export const DynamicChartBar = dynamic(
  () => import('./chart').then(mod => mod.ChartBar),
  { 
    ssr: false, 
    loading: () => <ChartLoading /> 
  }
)

export const DynamicChartArea = dynamic(
  () => import('./chart').then(mod => mod.ChartArea),
  { 
    ssr: false, 
    loading: () => <ChartLoading /> 
  }
)

export const DynamicChartPie = dynamic(
  () => import('./chart').then(mod => mod.ChartPie),
  { 
    ssr: false, 
    loading: () => <ChartLoading /> 
  }
)

// Re-export types for convenience
export type { 
  // These would come from chart.tsx if exported
} from './chart'
