import type { Metadata } from 'next';
import { PriceAdjustmentFormPage } from '@/features/price-adjustments/form-page';

type Props = { params: Promise<{ systemId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params;
  return {
    title: `Chỉnh sửa ${systemId}`,
    description: 'Sửa thông tin phiếu điều chỉnh giá bán',
  };
}

export default async function EditPriceAdjustmentPage({ params }: Props) {
  const { systemId } = await params;
  
  return <PriceAdjustmentFormPage systemId={systemId} />;
}
