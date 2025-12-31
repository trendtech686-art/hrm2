import type { Metadata } from 'next'
import { WorkflowTemplatesPage } from '@/features/settings/printer/workflow-templates-page'

export const metadata: Metadata = {
  title: 'Mẫu quy trình',
  description: 'Quản lý mẫu quy trình làm việc',
}

export default function Page() {
  return <WorkflowTemplatesPage />
}
