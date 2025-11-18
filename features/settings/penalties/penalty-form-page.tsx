import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { usePenaltyStore } from './store.ts';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../../hooks/use-route-meta';
import { PenaltyForm } from './form.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function PenaltyFormPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const routeMeta = useRouteMeta();
  const { findById, add, update, remove } = usePenaltyStore();

  const penalty = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  const isEdit = !!systemId;

  const handleCancel = React.useCallback(() => {
    navigate('/penalties');
  }, [navigate]);

  const actions = React.useMemo(() => [
    <Button 
      key="cancel" 
      type="button"
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="submit"
      size="sm"
      className="h-9"
      form="penalty-form"
    >
      Lưu
    </Button>
  ], [handleCancel]);

  usePageHeader({
    actions,
    breadcrumb: isEdit ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      { label: penalty?.id || 'Chi tiết', href: `/penalties/${systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      { label: 'Thêm mới', href: '', isCurrent: true }
    ]
  });

  const handleSubmit = (values: any) => {
    if (isEdit && penalty) {
      update(penalty.systemId, { ...penalty, ...values });
      toast.success('Đã cập nhật phiếu phạt');
    } else {
      add(values);
      toast.success('Đã tạo phiếu phạt mới');
    }
    navigate('/penalties');
  };

  const handleDelete = (systemId: string) => {
    remove(systemId);
    toast.success('Đã xóa phiếu phạt');
    navigate('/penalties');
  };

  if (isEdit && !penalty) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy phiếu phạt</h2>
        <Button onClick={() => navigate('/penalties')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về danh sách
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <PenaltyForm
          initialData={penalty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
}
