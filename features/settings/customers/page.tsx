import * as React from 'react';
import { asSystemId } from '@/lib/id-types';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { TabsContent } from '../../../components/ui/tabs';
import { SimpleSettingsTable } from '../../../components/settings/SimpleSettingsTable';
import {
  getCustomerTypeColumns,
  getCustomerGroupColumns,
  getCustomerSourceColumns,
  getPaymentTermColumns,
  getCreditRatingColumns,
  getLifecycleStageColumns,
  getCustomerSlaColumns,
} from './columns';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { useCustomerTypeStore } from './customer-types-store';
import { useCustomerGroupStore } from './customer-groups-store';
import { useCustomerSourceStore } from './customer-sources-store';
import { usePaymentTermStore } from './payment-terms-store';
import { useCreditRatingStore } from './credit-ratings-store';
import { useLifecycleStageStore } from './lifecycle-stages-store';
import { useCustomerSlaStore } from './sla-settings-store';
import { 
  CustomerTypeFormDialog,
  CustomerGroupFormDialog,
  CustomerSourceFormDialog,
  PaymentTermFormDialog,
  CreditRatingFormDialog,
  LifecycleStageFormDialog,
  CustomerSlaSettingFormDialog,
} from './setting-form-dialog';
import type { 
  CustomerType, 
  CustomerGroup, 
  CustomerSource, 
  PaymentTerm, 
  CreditRating,
  LifecycleStage,
  CustomerSlaSetting,
} from './types';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';
import type { BaseSetting } from './types';
import { useTabActionRegistry } from '../use-tab-action-registry';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('types');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerTypeActions = React.useMemo(() => registerActions('types'), [registerActions]);
  const registerGroupActions = React.useMemo(() => registerActions('groups'), [registerActions]);
  const registerSourceActions = React.useMemo(() => registerActions('sources'), [registerActions]);
  const registerPaymentTermActions = React.useMemo(() => registerActions('payment-terms'), [registerActions]);
  const registerCreditRatingActions = React.useMemo(() => registerActions('credit-ratings'), [registerActions]);
  const registerLifecycleStageActions = React.useMemo(() => registerActions('lifecycle-stages'), [registerActions]);
  const registerSlaActions = React.useMemo(() => registerActions('sla'), [registerActions]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);

  // Stores
  const customerTypes = useCustomerTypeStore();
  const customerGroups = useCustomerGroupStore();
  const customerSources = useCustomerSourceStore();
  const paymentTerms = usePaymentTermStore();
  const creditRatings = useCreditRatingStore();
  const lifecycleStages = useLifecycleStageStore();
  const slaSettings = useCustomerSlaStore();

  // Data map - moved up to be available for handlers
  const activeDataMap = React.useMemo(() => ({
    types: customerTypes.getActive(),
    groups: customerGroups.getActive(),
    sources: customerSources.getActive(),
    'payment-terms': paymentTerms.getActive(),
    'credit-ratings': creditRatings.getActive(),
    'lifecycle-stages': lifecycleStages.getActive(),
    'sla': slaSettings.getActive(),
  }), [
    customerTypes.data,
    customerGroups.data,
    customerSources.data,
    paymentTerms.data,
    creditRatings.data,
    lifecycleStages.data,
    slaSettings.data,
  ]);

  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const [deleteDialog, setDeleteDialog] = React.useState<{ isOpen: boolean; item: BaseSetting | null }>({ isOpen: false, item: null });

  const tabLabels: Record<string, string> = {
    types: 'Loại khách hàng',
    groups: 'Nhóm khách hàng',
    sources: 'Nguồn khách hàng',
    'payment-terms': 'Hạn thanh toán',
    'credit-ratings': 'Xếp hạng tín dụng',
    'lifecycle-stages': 'Giai đoạn vòng đời',
    'sla': 'Cài đặt SLA',
  };

  // Page header
  useSettingsPageHeader({
    title: 'Cài đặt khách hàng',
    actions: headerActions,
  });

  const handleEdit = React.useCallback((item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((item: BaseSetting) => {
    setDeleteDialog({ isOpen: true, item });
  }, []);

  // Toggle isActive inline
  const handleToggleActive = React.useCallback((item: BaseSetting, value: boolean) => {
    const updatedItem = { ...item, isActive: value };
    switch (activeTab) {
      case 'types':
        customerTypes.update(item.systemId, updatedItem as CustomerType);
        break;
      case 'groups':
        customerGroups.update(item.systemId, updatedItem as CustomerGroup);
        break;
      case 'sources':
        customerSources.update(item.systemId, updatedItem as CustomerSource);
        break;
      case 'payment-terms':
        paymentTerms.update(item.systemId, updatedItem as PaymentTerm);
        break;
      case 'credit-ratings':
        creditRatings.update(item.systemId, updatedItem as CreditRating);
        break;
      case 'lifecycle-stages':
        lifecycleStages.update(item.systemId, updatedItem as LifecycleStage);
        break;
      case 'sla':
        slaSettings.update(item.systemId, updatedItem as CustomerSlaSetting);
        break;
    }
    toast.success(value ? 'Đã kích hoạt' : 'Đã tắt');
  }, [activeTab, customerTypes, customerGroups, customerSources, paymentTerms, creditRatings, lifecycleStages, slaSettings]);

  // Toggle isDefault inline
  // SLA không cần toggle default (chỉ có 1 record mỗi loại)
  const handleToggleDefault = React.useCallback((item: BaseSetting & { isDefault?: boolean }, value: boolean) => {
    // SLA không có isDefault nữa
    if (activeTab === 'sla') return;

    // If turning on, turn off others in the same group
    if (value) {
      const currentData = activeDataMap[activeTab as keyof typeof activeDataMap] || [];
      currentData.forEach((otherItem: any) => {
        if (otherItem.systemId !== item.systemId && otherItem.isDefault) {
          const updatedOther = { ...otherItem, isDefault: false };
          switch (activeTab) {
            case 'types':
              customerTypes.update(otherItem.systemId, updatedOther);
              break;
            case 'groups':
              customerGroups.update(otherItem.systemId, updatedOther);
              break;
            case 'sources':
              customerSources.update(otherItem.systemId, updatedOther);
              break;
            case 'payment-terms':
              paymentTerms.update(otherItem.systemId, updatedOther);
              break;
            case 'credit-ratings':
              creditRatings.update(otherItem.systemId, updatedOther);
              break;
            case 'lifecycle-stages':
              lifecycleStages.update(otherItem.systemId, updatedOther);
              break;
          }
        }
      });
    }

    // Update the clicked item
    const updatedItem = { ...item, isDefault: value };
    switch (activeTab) {
      case 'types':
        customerTypes.update(item.systemId, updatedItem as CustomerType);
        break;
      case 'groups':
        customerGroups.update(item.systemId, updatedItem as CustomerGroup);
        break;
      case 'sources':
        customerSources.update(item.systemId, updatedItem as CustomerSource);
        break;
      case 'payment-terms':
        paymentTerms.update(item.systemId, updatedItem as PaymentTerm);
        break;
      case 'credit-ratings':
        creditRatings.update(item.systemId, updatedItem as CreditRating);
        break;
      case 'lifecycle-stages':
        lifecycleStages.update(item.systemId, updatedItem as LifecycleStage);
        break;
    }
    toast.success(value ? 'Đã đặt làm mặc định' : 'Đã bỏ mặc định');
  }, [activeTab, activeDataMap, customerTypes, customerGroups, customerSources, paymentTerms, creditRatings, lifecycleStages]);

  const confirmDelete = () => {
    if (!deleteDialog.item) return;
    // SLA không cho xóa
    if (activeTab === 'sla') {
      toast.error('Không thể xóa cài đặt SLA');
      setDeleteDialog({ isOpen: false, item: null });
      return;
    }
    
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
      case 'lifecycle-stages':
        lifecycleStages.remove(asSystemId(systemId));
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
        case 'lifecycle-stages':
          if (editingItem) {
            lifecycleStages.update(editingItem.systemId, { ...editingItem, ...data });
          } else {
            lifecycleStages.add(data);
          }
          break;
        case 'sla':
          // SLA chỉ cho edit, không cho thêm mới
          if (editingItem) {
            slaSettings.update(editingItem.systemId, { ...editingItem, ...data });
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

  const getExistingIds = React.useCallback((): string[] => {
    const dataset = activeDataMap[activeTab as keyof typeof activeDataMap];
    return dataset ? dataset.map((item) => item.id) : [];
  }, [activeDataMap, activeTab]);

  React.useEffect(() => {
    if (activeTab !== 'types') {
      return;
    }

    registerTypeActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm loại khách hàng
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerTypeActions]);

  React.useEffect(() => {
    if (activeTab !== 'groups') {
      return;
    }

    registerGroupActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm nhóm khách hàng
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerGroupActions]);

  React.useEffect(() => {
    if (activeTab !== 'sources') {
      return;
    }

    registerSourceActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm nguồn khách hàng
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerSourceActions]);

  React.useEffect(() => {
    if (activeTab !== 'payment-terms') {
      return;
    }

    registerPaymentTermActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm hạn thanh toán
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerPaymentTermActions]);

  React.useEffect(() => {
    if (activeTab !== 'credit-ratings') {
      return;
    }

    registerCreditRatingActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm xếp hạng tín dụng
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerCreditRatingActions]);

  React.useEffect(() => {
    if (activeTab !== 'lifecycle-stages') {
      return;
    }

    registerLifecycleStageActions([
      <SettingsActionButton key="add" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Thêm giai đoạn
      </SettingsActionButton>,
    ]);
  }, [activeTab, handleAdd, registerLifecycleStageActions]);

  // SLA: không có nút thêm mới (chỉ có 3 loại cố định)
  React.useEffect(() => {
    if (activeTab !== 'sla') {
      return;
    }
    // Không đăng ký action nào - không cho thêm mới SLA
    registerSlaActions([]);
  }, [activeTab, registerSlaActions]);

  const tabs = React.useMemo(
    () => [
      { value: 'types', label: 'Loại khách hàng' },
      { value: 'groups', label: 'Nhóm khách hàng' },
      { value: 'sources', label: 'Nguồn khách hàng' },
      { value: 'lifecycle-stages', label: 'Giai đoạn vòng đời' },
      { value: 'payment-terms', label: 'Hạn thanh toán' },
      { value: 'credit-ratings', label: 'Xếp hạng tín dụng' },
      { value: 'sla', label: 'Cài đặt SLA' },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>

        {/* Loại khách hàng */}
        <TabsContent value="types" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Loại khách hàng</CardTitle>
              <CardDescription>
                Quản lý các loại khách hàng: Cá nhân, Doanh nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap.types}
                columns={getCustomerTypeColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có loại khách hàng"
                emptyDescription="Tạo loại mới để nhóm khách hàng theo tiêu chí phù hợp"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nhóm khách hàng */}
        <TabsContent value="groups" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nhóm khách hàng</CardTitle>
              <CardDescription>
                Quản lý các nhóm khách hàng: VIP, Thường xuyên, Mới, Tiềm năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap.groups}
                columns={getCustomerGroupColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có nhóm khách hàng"
                emptyDescription="Tạo nhóm để phân loại khách hàng theo độ ưu tiên"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nguồn khách hàng */}
        <TabsContent value="sources" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nguồn khách hàng</CardTitle>
              <CardDescription>
                Quản lý các kênh tiếp cận khách hàng: Website, Facebook, Zalo, Giới thiệu...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap.sources}
                columns={getCustomerSourceColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có nguồn khách hàng"
                emptyDescription="Thêm nguồn để theo dõi hiệu quả từng kênh"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Giai đoạn vòng đời */}
        <TabsContent value="lifecycle-stages" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Giai đoạn vòng đời</CardTitle>
              <CardDescription>
                Quản lý các giai đoạn trong vòng đời khách hàng: Tiềm năng, Cơ hội, Khách hàng, Rời bỏ...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap['lifecycle-stages']}
                columns={getLifecycleStageColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có giai đoạn"
                emptyDescription="Thiết lập các giai đoạn để theo dõi hành trình khách hàng"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hạn thanh toán */}
        <TabsContent value="payment-terms" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Hạn thanh toán</CardTitle>
              <CardDescription>
                Quản lý các điều khoản thanh toán: COD, Net 7, Net 15, Net 30...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap['payment-terms']}
                columns={getPaymentTermColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có hạn thanh toán"
                emptyDescription="Cấu hình điều khoản thanh toán để đồng bộ với báo giá"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Xếp hạng tín dụng */}
        <TabsContent value="credit-ratings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Xếp hạng tín dụng</CardTitle>
              <CardDescription>
                Quản lý các mức xếp hạng tín dụng: AAA, AA, A, B, C, D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap['credit-ratings']}
                columns={getCreditRatingColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có xếp hạng tín dụng"
                emptyDescription="Thiết lập thang điểm để đánh giá khách hàng vay nợ"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cài đặt SLA */}
        <TabsContent value="sla" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SLA</CardTitle>
              <CardDescription>
                Quản lý thời gian và ngưỡng cảnh báo SLA: Liên hệ định kỳ, Kích hoạt lại, Nhắc công nợ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={activeDataMap['sla']}
                columns={getCustomerSlaColumns({
                  onEdit: handleEdit,
                  onDelete: handleDeleteRequest,
                  onToggleActive: handleToggleActive,
                  onToggleDefault: handleToggleDefault,
                })}
                emptyTitle="Chưa có cài đặt SLA"
                emptyDescription="Thiết lập thời gian và ngưỡng cảnh báo cho từng loại SLA"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </SettingsVerticalTabs>

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

      {activeTab === 'lifecycle-stages' && (
        <LifecycleStageFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSubmit={handleSubmit}
          existingIds={getExistingIds()}
        />
      )}

      {activeTab === 'sla' && (
        <CustomerSlaSettingFormDialog
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
