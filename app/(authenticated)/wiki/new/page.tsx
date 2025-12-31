import type { Metadata } from 'next'
import { WikiFormPage } from '@/features/wiki/form-page'

export const metadata: Metadata = {
  title: 'Tạo bài viết mới',
  description: 'Tạo bài viết wiki mới',
}

export default function Page() {
  return <WikiFormPage />
}
