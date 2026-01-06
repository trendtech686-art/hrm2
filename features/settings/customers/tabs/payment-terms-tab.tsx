import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getPaymentTermColumns } from '../columns';
import type { PaymentTerm, BaseSetting } from '../types';

interface Props { data: PaymentTerm[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; }

export function PaymentTermsTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault }: Props) {
  return (
    <Card><CardHeader><CardTitle>Hạn thanh toán</CardTitle><CardDescription>Quản lý các điều khoản thanh toán: COD, Net 7, Net 15, Net 30...</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getPaymentTermColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có hạn thanh toán" emptyDescription="Cấu hình điều khoản thanh toán để đồng bộ với báo giá" /></CardContent></Card>
  );
}
