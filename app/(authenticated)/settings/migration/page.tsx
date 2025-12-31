import type { Metadata } from 'next'
import { DataMigrationTool } from '@/components/settings/data-migration-tool'

export const metadata: Metadata = {
  title: 'Di chuyển dữ liệu',
  description: 'Công cụ di chuyển dữ liệu',
}

export default function Page() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Data Migration: localStorage → PostgreSQL
      </h1>
      <DataMigrationTool />
    </div>
  )
}
