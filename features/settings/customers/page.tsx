'use client'

import * as React from 'react';
import { Plus } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '@/components/settings/SettingsVerticalTabs';
import { useTabActionRegistry } from '../use-tab-action-registry';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { BaseSetting, CustomerType, CustomerGroup, CustomerSource, PaymentTerm, CreditRating, LifecycleStage, CustomerSlaSetting } from './types';
import { useCustomerTypeStore } from './customer-types-store';
import { useCustomerGroupStore } from './customer-groups-store';
import { useCustomerSourceStore } from './customer-sources-store';
import { usePaymentTermStore } from './payment-terms-store';
import { useCreditRatingStore } from './credit-ratings-store';
import { useLifecycleStageStore } from './lifecycle-stages-store';
import { useCustomerSlaStore } from './sla-settings-store';
import { CustomerTypeFormDialog, CustomerGroupFormDialog, CustomerSourceFormDialog, PaymentTermFormDialog, CreditRatingFormDialog, LifecycleStageFormDialog, CustomerSlaSettingFormDialog } from './setting-form-dialog';
import { TypesTab } from './tabs/types-tab';
import { GroupsTab } from './tabs/groups-tab';
import { SourcesTab } from './tabs/sources-tab';
import { PaymentTermsTab } from './tabs/payment-terms-tab';
import { CreditRatingsTab } from './tabs/credit-ratings-tab';
import { LifecycleStagesTab } from './tabs/lifecycle-stages-tab';
import { SlaTab } from './tabs/sla-tab';

const TAB_LABELS: Record<string, string> = { types: 'Loại KH', groups: 'Nhóm KH', sources: 'Nguồn KH', 'payment-terms': 'Hạn thanh toán', 'credit-ratings': 'Xếp hạng TD', 'lifecycle-stages': 'Giai đoạn', sla: 'SLA' };
const TAB_ADD_LABELS: Record<string, string> = { types: 'Thêm loại KH', groups: 'Thêm nhóm KH', sources: 'Thêm nguồn KH', 'payment-terms': 'Thêm hạn TT', 'credit-ratings': 'Thêm xếp hạng', 'lifecycle-stages': 'Thêm giai đoạn' };
const TABS = [{ value: 'types', label: 'Loại khách hàng' }, { value: 'groups', label: 'Nhóm khách hàng' }, { value: 'sources', label: 'Nguồn khách hàng' }, { value: 'lifecycle-stages', label: 'Giai đoạn vòng đời' }, { value: 'payment-terms', label: 'Hạn thanh toán' }, { value: 'credit-ratings', label: 'Xếp hạng tín dụng' }, { value: 'sla', label: 'Cài đặt SLA' }];

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('types');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BaseSetting | null>(null);
  const [deleteDialog, setDeleteDialog] = React.useState<{ isOpen: boolean; item: BaseSetting | null }>({ isOpen: false, item: null });

  const customerTypes = useCustomerTypeStore();
  const customerGroups = useCustomerGroupStore();
  const customerSources = useCustomerSourceStore();
  const paymentTerms = usePaymentTermStore();
  const creditRatings = useCreditRatingStore();
  const lifecycleStages = useLifecycleStageStore();
  const slaSettings = useCustomerSlaStore();

  const activeDataMap = React.useMemo(() => ({ types: customerTypes.getActive(), groups: customerGroups.getActive(), sources: customerSources.getActive(), 'payment-terms': paymentTerms.getActive(), 'credit-ratings': creditRatings.getActive(), 'lifecycle-stages': lifecycleStages.getActive(), sla: slaSettings.getActive() }), [customerTypes.data, customerGroups.data, customerSources.data, paymentTerms.data, creditRatings.data, lifecycleStages.data, slaSettings.data]);

  const handleAdd = React.useCallback(() => { setEditingItem(null); setDialogOpen(true); }, []);
  const handleEdit = React.useCallback((item: BaseSetting) => { setEditingItem(item); setDialogOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((item: BaseSetting) => setDeleteDialog({ isOpen: true, item }), []);

  const handleToggleActive = React.useCallback((item: BaseSetting, value: boolean) => {
    const upd = { ...item, isActive: value };
    if (activeTab === 'types') customerTypes.update(item.systemId, upd as CustomerType);
    else if (activeTab === 'groups') customerGroups.update(item.systemId, upd as CustomerGroup);
    else if (activeTab === 'sources') customerSources.update(item.systemId, upd as CustomerSource);
    else if (activeTab === 'payment-terms') paymentTerms.update(item.systemId, upd as PaymentTerm);
    else if (activeTab === 'credit-ratings') creditRatings.update(item.systemId, upd as CreditRating);
    else if (activeTab === 'lifecycle-stages') lifecycleStages.update(item.systemId, upd as LifecycleStage);
    else if (activeTab === 'sla') slaSettings.update(item.systemId, upd as CustomerSlaSetting);
    toast.success(value ? 'Đã kích hoạt' : 'Đã tắt');
  }, [activeTab, customerTypes, customerGroups, customerSources, paymentTerms, creditRatings, lifecycleStages, slaSettings]);

  const handleToggleDefault = React.useCallback((item: BaseSetting & { isDefault?: boolean }, value: boolean) => {
    if (activeTab === 'sla') return;
    if (value) { const data = activeDataMap[activeTab as keyof typeof activeDataMap] || []; data.forEach((o: BaseSetting & { isDefault?: boolean }) => { if (o.systemId !== item.systemId && o.isDefault) { const u = { ...o, isDefault: false }; if (activeTab === 'types') customerTypes.update(o.systemId, u); else if (activeTab === 'groups') customerGroups.update(o.systemId, u); else if (activeTab === 'sources') customerSources.update(o.systemId, u); else if (activeTab === 'payment-terms') paymentTerms.update(o.systemId, u); else if (activeTab === 'credit-ratings') creditRatings.update(o.systemId, u); else if (activeTab === 'lifecycle-stages') lifecycleStages.update(o.systemId, u); } }); }
    const upd = { ...item, isDefault: value };
    if (activeTab === 'types') customerTypes.update(item.systemId, upd as CustomerType);
    else if (activeTab === 'groups') customerGroups.update(item.systemId, upd as CustomerGroup);
    else if (activeTab === 'sources') customerSources.update(item.systemId, upd as CustomerSource);
    else if (activeTab === 'payment-terms') paymentTerms.update(item.systemId, upd as PaymentTerm);
    else if (activeTab === 'credit-ratings') creditRatings.update(item.systemId, upd as CreditRating);
    else if (activeTab === 'lifecycle-stages') lifecycleStages.update(item.systemId, upd as LifecycleStage);
    toast.success(value ? 'Đã đặt làm mặc định' : 'Đã bỏ mặc định');
  }, [activeTab, activeDataMap, customerTypes, customerGroups, customerSources, paymentTerms, creditRatings, lifecycleStages]);

  const confirmDelete = () => {
    if (!deleteDialog.item) return;
    if (activeTab === 'sla') { toast.error('Không thể xóa cài đặt SLA'); setDeleteDialog({ isOpen: false, item: null }); return; }
    const { systemId } = deleteDialog.item;
    if (activeTab === 'types') customerTypes.remove(asSystemId(systemId));
    else if (activeTab === 'groups') customerGroups.remove(asSystemId(systemId));
    else if (activeTab === 'sources') customerSources.remove(asSystemId(systemId));
    else if (activeTab === 'payment-terms') paymentTerms.remove(asSystemId(systemId));
    else if (activeTab === 'credit-ratings') creditRatings.remove(asSystemId(systemId));
    else if (activeTab === 'lifecycle-stages') lifecycleStages.remove(asSystemId(systemId));
    toast.success('Đã xóa thành công');
    setDeleteDialog({ isOpen: false, item: null });
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    try {
      if (activeTab === 'types') { if (editingItem) customerTypes.update(editingItem.systemId, { ...editingItem, ...data }); else customerTypes.add(data as Omit<CustomerType, 'systemId'>); }
      else if (activeTab === 'groups') { if (editingItem) customerGroups.update(editingItem.systemId, { ...editingItem, ...data }); else customerGroups.add(data as Omit<CustomerGroup, 'systemId'>); }
      else if (activeTab === 'sources') { if (editingItem) customerSources.update(editingItem.systemId, { ...editingItem, ...data }); else customerSources.add(data as Omit<CustomerSource, 'systemId'>); }
      else if (activeTab === 'payment-terms') { if (editingItem) paymentTerms.update(editingItem.systemId, { ...editingItem, ...data }); else paymentTerms.add(data as Omit<PaymentTerm, 'systemId'>); }
      else if (activeTab === 'credit-ratings') { if (editingItem) creditRatings.update(editingItem.systemId, { ...editingItem, ...data }); else creditRatings.add(data as Omit<CreditRating, 'systemId'>); }
      else if (activeTab === 'lifecycle-stages') { if (editingItem) lifecycleStages.update(editingItem.systemId, { ...editingItem, ...data }); else lifecycleStages.add(data as Omit<LifecycleStage, 'systemId'>); }
      else if (activeTab === 'sla' && editingItem) slaSettings.update(editingItem.systemId, { ...editingItem, ...data });
      toast.success(editingItem ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setDialogOpen(false);
    } catch (error) { toast.error('Có lỗi xảy ra', { description: error instanceof Error ? error.message : 'Lỗi không xác định' }); }
  };

  const getExistingIds = React.useCallback((): string[] => (activeDataMap[activeTab as keyof typeof activeDataMap] || []).map(i => i.id), [activeDataMap, activeTab]);

  // Register tab actions
  const regTypes = React.useMemo(() => registerActions('types'), [registerActions]);
  const regGroups = React.useMemo(() => registerActions('groups'), [registerActions]);
  const regSources = React.useMemo(() => registerActions('sources'), [registerActions]);
  const regPayment = React.useMemo(() => registerActions('payment-terms'), [registerActions]);
  const regCredit = React.useMemo(() => registerActions('credit-ratings'), [registerActions]);
  const regLifecycle = React.useMemo(() => registerActions('lifecycle-stages'), [registerActions]);
  const regSla = React.useMemo(() => registerActions('sla'), [registerActions]);
  React.useEffect(() => { if (activeTab === 'types') regTypes([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS.types}</SettingsActionButton>]); }, [activeTab, handleAdd, regTypes]);
  React.useEffect(() => { if (activeTab === 'groups') regGroups([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS.groups}</SettingsActionButton>]); }, [activeTab, handleAdd, regGroups]);
  React.useEffect(() => { if (activeTab === 'sources') regSources([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS.sources}</SettingsActionButton>]); }, [activeTab, handleAdd, regSources]);
  React.useEffect(() => { if (activeTab === 'payment-terms') regPayment([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS['payment-terms']}</SettingsActionButton>]); }, [activeTab, handleAdd, regPayment]);
  React.useEffect(() => { if (activeTab === 'credit-ratings') regCredit([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS['credit-ratings']}</SettingsActionButton>]); }, [activeTab, handleAdd, regCredit]);
  React.useEffect(() => { if (activeTab === 'lifecycle-stages') regLifecycle([<SettingsActionButton key="add" onClick={handleAdd}><Plus className="h-4 w-4" />{TAB_ADD_LABELS['lifecycle-stages']}</SettingsActionButton>]); }, [activeTab, handleAdd, regLifecycle]);
  React.useEffect(() => { if (activeTab === 'sla') regSla([]); }, [activeTab, regSla]);

  useSettingsPageHeader({ title: 'Cài đặt khách hàng', actions: headerActions });

  const handlers = { onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleActive: handleToggleActive, onToggleDefault: handleToggleDefault };

  return (
    <div className="space-y-6">
      <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={TABS}>
        <TabsContent value="types" className="mt-0"><TypesTab data={activeDataMap.types} {...handlers} /></TabsContent>
        <TabsContent value="groups" className="mt-0"><GroupsTab data={activeDataMap.groups} {...handlers} /></TabsContent>
        <TabsContent value="sources" className="mt-0"><SourcesTab data={activeDataMap.sources} {...handlers} /></TabsContent>
        <TabsContent value="lifecycle-stages" className="mt-0"><LifecycleStagesTab data={activeDataMap['lifecycle-stages']} {...handlers} /></TabsContent>
        <TabsContent value="payment-terms" className="mt-0"><PaymentTermsTab data={activeDataMap['payment-terms']} {...handlers} /></TabsContent>
        <TabsContent value="credit-ratings" className="mt-0"><CreditRatingsTab data={activeDataMap['credit-ratings']} {...handlers} /></TabsContent>
        <TabsContent value="sla" className="mt-0"><SlaTab data={activeDataMap.sla} {...handlers} /></TabsContent>
      </SettingsVerticalTabs>

      {activeTab === 'types' && <CustomerTypeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'groups' && <CustomerGroupFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'sources' && <CustomerSourceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'payment-terms' && <PaymentTermFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem as PaymentTerm | null} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'credit-ratings' && <CreditRatingFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem as CreditRating | null} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'lifecycle-stages' && <LifecycleStageFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={getExistingIds()} />}
      {activeTab === 'sla' && <CustomerSlaSettingFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem as CustomerSlaSetting | null} onSubmit={handleSubmit} existingIds={getExistingIds()} />}

      <AlertDialog open={deleteDialog.isOpen} onOpenChange={o => setDeleteDialog(p => ({ isOpen: o, item: o ? p.item : null }))}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa {TAB_LABELS[activeTab]}</AlertDialogTitle><AlertDialogDescription>Bạn sắp xóa "{deleteDialog.item?.name}" ({deleteDialog.item?.id}). Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9" onClick={() => setDeleteDialog({ isOpen: false, item: null })}>Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
