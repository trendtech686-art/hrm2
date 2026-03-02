import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { getCreditRatingColumns } from '../columns';
import type { CreditRating, BaseSetting } from '../types';

interface Props { data: CreditRating[]; onEdit: (item: BaseSetting) => void; onDelete: (item: BaseSetting) => void; onToggleActive: (item: BaseSetting, value: boolean) => void; onToggleDefault: (item: BaseSetting & { isDefault?: boolean }, value: boolean) => void; onBulkDelete?: (items: BaseSetting[]) => void; }

export function CreditRatingsTab({ data, onEdit, onDelete, onToggleActive, onToggleDefault, onBulkDelete }: Props) {
  return (
    <Card><CardHeader><CardTitle>Xếp hạng tín dụng</CardTitle><CardDescription>Quản lý các mức xếp hạng tín dụng: AAA, AA, A, B, C, D</CardDescription></CardHeader><CardContent><SimpleSettingsTable data={data} columns={getCreditRatingColumns({ onEdit, onDelete, onToggleActive, onToggleDefault })} emptyTitle="Chưa có xếp hạng tín dụng" emptyDescription="Thiết lập thang điểm để đánh giá khách hàng vay nợ" enableSelection enablePagination pagination={{ pageSize: 10, showInfo: true }} onBulkDelete={onBulkDelete} /></CardContent></Card>
  );
}
