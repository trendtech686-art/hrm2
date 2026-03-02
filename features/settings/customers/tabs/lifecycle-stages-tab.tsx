import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getLifecycleStageColumns } from '../columns';
import type { LifecycleStage, BaseSetting } from '../types';

interface Props { data: LifecycleStage[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; onBulkDelete?: (items: BaseSetting[]) => void; }

export function LifecycleStagesTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault, onBulkDelete }: Props) {
  return (
    <Card><CardHeader><CardTitle>Giai đoạn vòng đời</CardTitle><CardDescription>Quản lý các giai đoạn: Tiềm năng, Cơ hội, Khách hàng, Rời bỏ...</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getLifecycleStageColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có giai đoạn" emptyDescription="Thiết lập các giai đoạn để theo dõi hành trình khách hàng" enableSelection enablePagination pagination={{ pageSize: 10, showInfo: true }} onBulkDelete={onBulkDelete} /></CardContent></Card>
  );
}
