'use client'

import type { Employee } from '@/lib/types/prisma-extended'
import { EntityActivityTable } from '@/components/shared/entity-activity-table'

interface HistoryTabProps {
  employee: Employee
}

export function HistoryTab({ employee }: HistoryTabProps) {
  return (
    <div className="space-y-4">
      <EntityActivityTable entityType="employee" entityId={employee.systemId} />
    </div>
  )
}
