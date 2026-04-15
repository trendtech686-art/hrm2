import type { Metadata } from 'next'
import { TemplateFormPage } from '@/features/tasks/components/template-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa mẫu công việc',
  description: 'Chỉnh sửa mẫu công việc',
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params;
  return <TemplateFormPage systemId={systemId} />
}
