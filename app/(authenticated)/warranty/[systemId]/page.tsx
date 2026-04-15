import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { WarrantyDetailPage } from '@/features/warranty/warranty-detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết bảo hành',
  description: 'Xem thông tin phiếu bảo hành',
}

// Serialize Prisma Decimal fields to numbers for client
function serializeWarranty(warranty: Record<string, unknown>) {
  const decimalFields = ['partsCost', 'laborCost', 'totalCost', 'shippingFee'];
  const result = { ...warranty };
  for (const field of decimalFields) {
    if (result[field] !== null && result[field] !== undefined) {
      result[field] = Number(result[field]);
    } else {
      result[field] = 0;
    }
  }
  return result;
}

export default async function Page({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params;

  let initialData: Record<string, unknown> | null = null;
  try {
    const warranty = await prisma.warranty.findUnique({
      where: { systemId },
      include: {
        product: true,
        order: {
          select: { systemId: true, id: true, orderDate: true },
        },
        customers: {
          select: { systemId: true, id: true, name: true, phone: true },
        },
      },
    });
    if (warranty) {
      initialData = serializeWarranty(warranty as unknown as Record<string, unknown>);
    }
  } catch {
    // Fall through — client will fetch via React Query
  }

  return <WarrantyDetailPage />
}
