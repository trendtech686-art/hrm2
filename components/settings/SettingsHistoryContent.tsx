'use client'

import { EntityActivityTable } from '@/components/shared/entity-activity-table'

interface SettingsHistoryContentProps {
  entityTypes: string[]
  title?: string
}

export function SettingsHistoryContent({ entityTypes, title = 'Lịch sử thay đổi' }: SettingsHistoryContentProps) {
  return (
    <EntityActivityTable
      entityTypes={entityTypes}
      title={title}
    />
  )
}
