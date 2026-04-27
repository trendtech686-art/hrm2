import type { Metadata } from 'next'
import { WarrantyDetailPage } from '@/features/warranty/warranty-detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết bảo hành',
  description: 'Xem thông tin phiếu bảo hành',
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params;

  // Prefetch warranty data server-side for faster initial render
  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.warranty.findUnique({
      where: { systemId },
      select: { systemId: true },
    });
  } catch {
    // Fall through — client will fetch via React Query
  }

  return <WarrantyDetailPage />
}
