/**
 * Dynamic Report Chart
 * 
 * Lazy loads ReportChart to reduce initial bundle size
 * recharts library is ~200KB
 */

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Loading skeleton for chart
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-[400px]" />
      </CardContent>
    </Card>
  );
}

// Dynamic import with loading state
export const DynamicReportChart = dynamic(
  () => import('./report-chart').then(mod => mod.ReportChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Charts don't need SSR
  }
);

export default DynamicReportChart;
