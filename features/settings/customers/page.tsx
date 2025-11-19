import * as React from 'react';
import { asSystemId } from '@/lib/id-types';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { SettingsTable } from './settings-table';
import { usePageHeader } from '../../../contexts/page-header-context';
import { useCustomerTypeStore } from './customer-types-store';
import { useCustomerGroupStore } from './customer-groups-store';
import { useCustomerSourceStore } from './customer-sources-store';
import { usePaymentTermStore } from './payment-terms-store';
import { useCreditRatingStore } from './credit-ratings-store';
import { 
  CustomerTypeFormDialog,
  CustomerGroupFormDialog,
  CustomerSourceFormDialog,
  PaymentTermFormDialog,
  CreditRatingFormDialog,
} from './setting-form-dialog';
import type { 
  CustomerType, 
  CustomerGroup, 
  CustomerSource, 
  PaymentTerm, 
  CreditRating 
} from './types';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.tsx';
import type { BaseSetting } from './types';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('types');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);

  // Stores
  const customerTypes = useCustomerTypeStore();
  const customerGroups = useCustomerGroupStore();
  const customerSources = useCustomerSourceStore();
  const paymentTerms = usePaymentTermStore();
  const creditRatings = useCreditRatingStore();

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const [deleteDialog, setDeleteDialog] = React.useState<{ isOpen: boolean; item: BaseSetting | null }>({ isOpen: false, item: null });

  const tabLabels: Record<string, string> = {
    types: 'Loại khách hàng',
    groups: 'Nhóm khách hàng',
    sources: 'Nguồn khách hàng',
    'payment-terms': 'Hạn thanh toán',
    'credit-ratings': 'Xếp hạng tín dụng',
  };

  // Memo actions to prevent infinite loop
  const headerActions = React.useMemo(() => [
    <Button key="add" onClick={handleAdd} className="h-9">
      <Plus className="h-4 w-4 mr-2" />
      Thêm mới
    </Button>
  ], []);

  // Page header
  usePageHeader({
    title: 'Cài đặt khách hàng',
    breadcrumb: [
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cài đặt khách hàng', href: '/customers/settings' },
    ],
    actions: headerActions,
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (item: BaseSetting) => {
    setDeleteDialog({ isOpen: true, item });
  };

  const confirmDelete = () => {
    if (!deleteDialog.item) return;
    const { systemId } = deleteDialog.item;
    switch (activeTab) {
      case 'types':
        customerTypes.remove(asSystemId(systemId));
        break;
      case 'groups':
        customerGroups.remove(asSystemId(systemId));
        break;
      case 'sources':
        customerSources.remove(asSystemId(systemId));
        break;
      case 'payment-terms':
        paymentTerms.remove(asSystemId(systemId));
        break;
      case 'credit-ratings':
        creditRatings.remove(asSystemId(systemId));
        break;
    }
    toast.success('Đã xóa thành công');
    setDeleteDialog({ isOpen: false, item: null });
  };

  const handleSubmit = (data: any) => {
    try {
      switch (activeTab) {
        case 'types':
          if (editingItem) {
            customerTypes.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            customerTypes.add(data);
          }
          break;
        case 'groups':
          if (editingItem) {
            customerGroups.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            customerGroups.add(data);
          }
          break;
        case 'sources':
          if (editingItem) {
            customerSources.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            customerSources.add(data);
          }
          break;
        case 'payment-terms':
          if (editingItem) {
            paymentTerms.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            paymentTerms.add(data);
          }
          break;
        case 'credit-ratings':
          if (editingItem) {
            creditRatings.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            creditRatings.add(data);
          }
          break;
      }
      toast.success(editingItem ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định',
      });
    }
  };

  const getExistingIds = (): string[] => {
    switch (activeTab) {
      case 'types':
        return customerTypes.getActive().map((t) => t.id);
      case 'groups':
        return customerGroups.getActive().map((t) => t.id);
      case 'sources':
        return customerSources.getActive().map((t) => t.id);
      case 'payment-terms':
        return paymentTerms.getActive().map((t) => t.id);
      case 'credit-ratings':
        return creditRatings.getActive().map((t) => t.id);
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1">
          <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
            <TabsTrigger value="types" className="flex-shrink-0">
              Loại khách hàng
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-shrink-0">
              Nhóm khách hàng
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex-shrink-0">
              Nguồn khách hàng
            </TabsTrigger>
            <TabsTrigger value="payment-terms" className="flex-shrink-0">
              Hạn thanh toán
            </TabsTrigger>
            <TabsTrigger value="credit-ratings" className="flex-shrink-0">
              Xếp hạng tín dụng
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Loại khách hàng */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Loại khách hàng</CardTitle>
              <CardDescription>
                Quản lý các loại khách hàng: Cá nhân, Doanh nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTable<CustomerType>
                data={customerTypes.getActive()}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nhóm khách hàng */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Nhóm khách hàng</CardTitle>
              <CardDescription>
                Quản lý các nhóm khách hàng: VIP, Thường xuyên, Mới, Tiềm năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTable<CustomerGroup>
                data={customerGroups.getActive()}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                renderExtraColumns={(item) => (
                  <div className="flex items-center gap-2">
                    {item.color && (
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nguồn khách hàng */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Nguồn khách hàng</CardTitle>
              <CardDescription>
                Quản lý các kênh tiếp cận khách hàng: Website, Facebook, Zalo, Giới thiệu...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTable<CustomerSource>
                data={customerSources.getActive()}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                renderExtraColumns={(item) => (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hạn thanh toán */}
        <TabsContent value="payment-terms">
          <Card>
            <CardHeader>
              <CardTitle>Hạn thanh toán</CardTitle>
              <CardDescription>
                Quản lý các điều khoản thanh toán: COD, Net 7, Net 15, Net 30...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTable<PaymentTerm>
                data={paymentTerms.getActive()}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                renderExtraColumns={(item) => (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.days} ngày</Badge>
                    {item.isDefault && <Badge>Mặc định</Badge>}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Xếp hạng tín dụng */}
        <TabsContent value="credit-ratings">
          <Card>
            <CardHeader>
              <CardTitle>Xếp hạng tín dụng</CardTitle>
              <CardDescription>
                Quản lý các mức xếp hạng tín dụng: AAA, AA, A, B, C, D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTable<CreditRating>
                data={creditRatings.getActive()}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                renderExtraColumns={(item) => (
                  <div className="flex items-center gap-2">
                    {item.color && (
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <Badge variant="outline">Level {item.level}</Badge>
                    {item.maxCreditLimit !== undefined && (
                      <Badge variant="secondary">
                        {(item.maxCreditLimit / 1000000).toLocaleString('vi-VN')}tr
                      </Badge>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialogs */}
      {activeTab === 'types' && (
        <CustomerTypeFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      {activeTab === 'groups' && (
        <CustomerGroupFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      {activeTab === 'sources' && (
        <CustomerSourceFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      {activeTab === 'payment-terms' && (
        <PaymentTermFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      {activeTab === 'credit-ratings' && (
        <CreditRatingFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialog((prev) => ({ isOpen, item: isOpen ? prev.item : null }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa {tabLabels[activeTab] || 'mục'}</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa "{deleteDialog.item?.name}" ({deleteDialog.item?.id}). Hành động này không thể hoàn tác và có thể ảnh hưởng tới các chứng từ đang dùng loại cấu hình này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9" onClick={() => setDeleteDialog({ isOpen: false, item: null })}>Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
