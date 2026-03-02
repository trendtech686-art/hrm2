import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsLoading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Tree View */}
      <div className="border rounded-lg p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="py-2" style={{ paddingLeft: `${(i % 4) * 24}px` }}>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
