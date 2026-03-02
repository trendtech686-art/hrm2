import { TableSkeleton } from '@/components/shared/table-skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted/50 animate-pulse rounded mt-2" />
        </div>
      </div>
      <div className="h-10 bg-muted/50 animate-pulse rounded" />
      <TableSkeleton rows={10} columns={6} />
    </div>
  )
}
