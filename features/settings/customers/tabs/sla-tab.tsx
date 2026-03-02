import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getCustomerSlaColumns } from '../columns';
import type { CustomerSlaSetting, BaseSetting } from '../types';

interface Props { data: CustomerSlaSetting[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; onBulkDelete?: (items: BaseSetting[]) => void; }

export function SlaTab({ data, onEdit, onDelete, onToggleActive, onBulkDelete }: Props) {
  return (
    <Card><CardHeader><CardTitle>Cài đặt SLA</CardTitle><CardDescription>Quản lý thời gian và ngưỡng cảnh báo SLA: Liên hệ định kỳ, Kích hoạt lại, Nhắc công nợ</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getCustomerSlaColumns({ onEdit, onDelete, onToggleActive })} emptyTitle="Chưa có cài đặt SLA" emptyDescription="Thiết lập thời gian và ngưỡng cảnh báo cho từng loại SLA" enableSelection enablePagination pagination={{ pageSize: 10, showInfo: true }} onBulkDelete={onBulkDelete} /></CardContent></Card>
  );
}
