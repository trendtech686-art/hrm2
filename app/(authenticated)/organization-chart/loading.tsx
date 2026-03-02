import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationChartLoading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Org Chart */}
      <div className="border rounded-lg p-8 flex flex-col items-center">
        {/* Top Level */}
        <Skeleton className="h-20 w-48 rounded-lg mb-8" />
        
        {/* Second Level */}
        <div className="flex gap-8 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-40 rounded-lg" />
          ))}
        </div>

        {/* Third Level */}
        <div className="flex gap-4 flex-wrap justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-36 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
