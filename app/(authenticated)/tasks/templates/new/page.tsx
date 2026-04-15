import type { Metadata } from 'next'
import { TemplateFormPage } from '@/features/tasks/components/template-form-page'

export const metadata: Metadata = {
  title: 'Tạo mẫu công việc mới',
  description: 'Tạo mẫu công việc mới',
}

export default function Page() {
  return <TemplateFormPage />
}
