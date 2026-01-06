import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getCustomerTypeColumns } from '../columns';
import type { CustomerType, BaseSetting } from '../types';

interface Props { data: CustomerType[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; }

export function TypesTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault }: Props) {
  return (
    <Card><CardHeader><CardTitle>Loại khách hàng</CardTitle><CardDescription>Quản lý các loại khách hàng: Cá nhân, Doanh nghiệp</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getCustomerTypeColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có loại khách hàng" emptyDescription="Tạo loại mới để nhóm khách hàng theo tiêu chí phù hợp" /></CardContent></Card>
  );
}
