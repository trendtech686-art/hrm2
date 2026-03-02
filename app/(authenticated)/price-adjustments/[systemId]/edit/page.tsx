'use client';

import { useParams } from 'next/navigation';
import { PriceAdjustmentFormPage } from '@/features/price-adjustments/form-page';

export default function EditPriceAdjustmentPage() {
  const params = useParams();
  const systemId = params?.systemId as string;
  
  return <PriceAdjustmentFormPage systemId={systemId} />;
}
