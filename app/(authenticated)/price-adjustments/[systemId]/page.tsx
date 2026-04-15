import type { Metadata } from 'next';
import { PriceAdjustmentDetailPage } from '@/features/price-adjustments/detail-page';

interface PageProps {
  params: Promise<{ systemId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { systemId } = await params;
  return {
    title: `Điều chỉnh giá bán ${systemId}`,
    description: 'Xem thông tin phiếu điều chỉnh giá bán',
  };
}

export default async function Page({ params }: PageProps) {
  await params;
  return <PriceAdjustmentDetailPage />;
}
