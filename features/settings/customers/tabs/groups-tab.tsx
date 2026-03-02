import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getCustomerGroupColumns } from '../columns';
import type { CustomerGroup, BaseSetting } from '../types';

interface Props { data: CustomerGroup[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; onBulkDelete?: (items: BaseSetting[]) => void; }

export function GroupsTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault, onBulkDelete }: Props) {
  return (
    <Card><CardHeader><CardTitle>Nhóm khách hàng</CardTitle><CardDescription>Quản lý các nhóm khách hàng: VIP, Thường xuyên, Mới, Tiềm năng</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getCustomerGroupColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có nhóm khách hàng" emptyDescription="Tạo nhóm để phân loại khách hàng theo độ ưu tiên" enableSelection enablePagination pagination={{ pageSize: 10, showInfo: true }} onBulkDelete={onBulkDelete} /></CardContent></Card>
  );
}
