import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getCustomerSourceColumns } from '../columns';
import type { CustomerSource, BaseSetting } from '../types';

interface Props { data: CustomerSource[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; onBulkDelete?: (items: BaseSetting[]) => void; }

export function SourcesTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault, onBulkDelete }: Props) {
  return (
    <Card><CardHeader><CardTitle>Nguồn khách hàng</CardTitle><CardDescription>Quản lý các kênh tiếp cận: Website, Facebook, Zalo, Giới thiệu...</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getCustomerSourceColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có nguồn khách hàng" emptyDescription="Thêm nguồn để theo dõi hiệu quả từng kênh" enableSelection enablePagination pagination={{ pageSize: 10, showInfo: true }} onBulkDelete={onBulkDelete} /></CardContent></Card>
  );
}
