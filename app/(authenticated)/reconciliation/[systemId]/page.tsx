import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SheetDetailPage } from '@/features/reconciliation/sheet-detail-page'

type Props = {
  params: Promise<{ systemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params

  try {
    const sheet = await prisma.reconciliationSheet.findUnique({
      where: { systemId },
      select: { id: true, carrier: true },
    })

    if (!sheet) {
      return { title: 'Phiếu đối soát không tồn tại' }
    }

    return {
      title: `Phiếu đối soát ${sheet.id}`,
      description: `Chi tiết phiếu đối soát ${sheet.id} — ${sheet.carrier}`,
    }
  } catch {
    return { title: 'Chi tiết phiếu đối soát' }
  }
}

export default function Page() {
  return <SheetDetailPage />
}
