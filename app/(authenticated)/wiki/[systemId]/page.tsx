import type { Metadata } from 'next'
import { WikiDetailPage } from '@/features/wiki/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết bài viết',
  description: 'Xem nội dung bài viết',
}

export default function Page() {
  return <WikiDetailPage />
}
