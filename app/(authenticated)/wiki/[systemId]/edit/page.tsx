import type { Metadata } from 'next'
import { WikiFormPage } from '@/features/wiki/form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết',
  description: 'Chỉnh sửa nội dung bài viết wiki',
}

export default function Page() {
  return <WikiFormPage />
}
