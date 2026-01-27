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
import { 
  useCustomerTypes, useCustomerTypeMutations,
  useCustomerGroups, useCustomerGroupMutations,
  useCustomerSources, useCustomerSourceMutations,
  usePaymentTerms, usePaymentTermMutations,
  useCreditRatings, useCreditRatingMutations,
  useLifecycleStages, useLifecycleStageMutations,
  useCustomerSlaSettings, useCustomerSlaSettingMutations
} from './hooks/use-customer-settings';
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

  // React Query hooks
  const { data: customerTypes = [] } = useCustomerTypes();
  const { data: customerGroups = [] } = useCustomerGroups();
  const { data: customerSources = [] } = useCustomerSources();
  const { data: paymentTerms = [] } = usePaymentTerms();
  const { data: creditRatings = [] } = useCreditRatings();
  const { data: lifecycleStages = [] } = useLifecycleStages();
  const { data: slaSettings = [] } = useCustomerSlaSettings();

  // Mutations
  const customerTypeMutations = useCustomerTypeMutations({ onSuccess: () => toast.success('Thành công') });
  const customerGroupMutations = useCustomerGroupMutations({ onSuccess: () => toast.success('Thành công') });
  const customerSourceMutations = useCustomerSourceMutations({ onSuccess: () => toast.success('Thành công') });
  const paymentTermMutations = usePaymentTermMutations({ onSuccess: () => toast.success('Thành công') });
  const creditRatingMutations = useCreditRatingMutations({ onSuccess: () => toast.success('Thành công') });
  const lifecycleStageMutations = useLifecycleStageMutations({ onSuccess: () => toast.success('Thành công') });
  const slaSettingMutations = useCustomerSlaSettingMutations({ onSuccess: () => toast.success('Thành công') });

  const activeDataMap = React.useMemo(() => ({ 
    types: customerTypes.filter(t => t.isActive), 
    groups: customerGroups.filter(g => g.isActive), 
    sources: customerSources.filter(s => s.isActive), 
    'payment-terms': paymentTerms.filter(p => p.isActive), 
    'credit-ratings': creditRatings.filter(c => c.isActive), 
    'lifecycle-stages': lifecycleStages.filter(l => l.isActive), 
    sla: slaSettings.filter(s => s.isActive) 
  }), [customerTypes, customerGroups, customerSources, paymentTerms, creditRatings, lifecycleStages, slaSettings]);

  const handleAdd = React.useCallback(() => { setEditingItem(null); setDialogOpen(true); }, []);
  const handleEdit = React.useCallback((item: BaseSetting) => { setEditingItem(item); setDialogOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((item: BaseSetting) => setDeleteDialog({ isOpen: true, item }), []);

  const handleToggleActive = React.useCallback((item: BaseSetting, value: boolean) => {
    const upd = { ...item, isActive: value };
    if (activeTab === 'types') customerTypeMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerType });
    else if (activeTab === 'groups') customerGroupMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerGroup });
    else if (activeTab === 'sources') customerSourceMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerSource });
    else if (activeTab === 'payment-terms') paymentTermMutations.update.mutate({ systemId: item.systemId, data: upd as PaymentTerm });
    else if (activeTab === 'credit-ratings') creditRatingMutations.update.mutate({ systemId: item.systemId, data: upd as CreditRating });
    else if (activeTab === 'lifecycle-stages') lifecycleStageMutations.update.mutate({ systemId: item.systemId, data: upd as LifecycleStage });
    else if (activeTab === 'sla') slaSettingMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerSlaSetting });
  }, [activeTab, customerTypeMutations, customerGroupMutations, customerSourceMutations, paymentTermMutations, creditRatingMutations, lifecycleStageMutations, slaSettingMutations]);

  const handleToggleDefault = React.useCallback((item: BaseSetting & { isDefault?: boolean }, value: boolean) => {
    if (activeTab === 'sla') return;
    if (value) { 
      const data = activeDataMap[activeTab as keyof typeof activeDataMap] || []; 
      data.forEach((o: BaseSetting & { isDefault?: boolean }) => { 
        if (o.systemId !== item.systemId && o.isDefault) { 
          const u = { ...o, isDefault: false }; 
          if (activeTab === 'types') customerTypeMutations.update.mutate({ systemId: o.systemId, data: u }); 
          else if (activeTab === 'groups') customerGroupMutations.update.mutate({ systemId: o.systemId, data: u }); 
          else if (activeTab === 'sources') customerSourceMutations.update.mutate({ systemId: o.systemId, data: u }); 
          else if (activeTab === 'payment-terms') paymentTermMutations.update.mutate({ systemId: o.systemId, data: u }); 
          else if (activeTab === 'credit-ratings') creditRatingMutations.update.mutate({ systemId: o.systemId, data: u }); 
          else if (activeTab === 'lifecycle-stages') lifecycleStageMutations.update.mutate({ systemId: o.systemId, data: u }); 
        } 
      }); 
    }
    const upd = { ...item, isDefault: value };
    if (activeTab === 'types') customerTypeMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerType });
    else if (activeTab === 'groups') customerGroupMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerGroup });
    else if (activeTab === 'sources') customerSourceMutations.update.mutate({ systemId: item.systemId, data: upd as CustomerSource });
    else if (activeTab === 'payment-terms') paymentTermMutations.update.mutate({ systemId: item.systemId, data: upd as PaymentTerm });
    else if (activeTab === 'credit-ratings') creditRatingMutations.update.mutate({ systemId: item.systemId, data: upd as CreditRating });
    else if (activeTab === 'lifecycle-stages') lifecycleStageMutations.update.mutate({ systemId: item.systemId, data: upd as LifecycleStage });
  }, [activeTab, activeDataMap, customerTypeMutations, customerGroupMutations, customerSourceMutations, paymentTermMutations, creditRatingMutations, lifecycleStageMutations]);

  const confirmDelete = () => {
    if (!deleteDialog.item) return;
    if (activeTab === 'sla') { toast.error('Không thể xóa cài đặt SLA'); setDeleteDialog({ isOpen: false, item: null }); return; }
    const { systemId } = deleteDialog.item;
    if (activeTab === 'types') customerTypeMutations.remove.mutate(asSystemId(systemId));
    else if (activeTab === 'groups') customerGroupMutations.remove.mutate(asSystemId(systemId));
    else if (activeTab === 'sources') customerSourceMutations.remove.mutate(asSystemId(systemId));
    else if (activeTab === 'payment-terms') paymentTermMutations.remove.mutate(asSystemId(systemId));
    else if (activeTab === 'credit-ratings') creditRatingMutations.remove.mutate(asSystemId(systemId));
    else if (activeTab === 'lifecycle-stages') lifecycleStageMutations.remove.mutate(asSystemId(systemId));
    setDeleteDialog({ isOpen: false, item: null });
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    try {
      if (activeTab === 'types') { 
        if (editingItem) customerTypeMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else customerTypeMutations.create.mutate(data as Omit<CustomerType, 'systemId'>); 
      }
      else if (activeTab === 'groups') { 
        if (editingItem) customerGroupMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else customerGroupMutations.create.mutate(data as Omit<CustomerGroup, 'systemId'>); 
      }
      else if (activeTab === 'sources') { 
        if (editingItem) customerSourceMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else customerSourceMutations.create.mutate(data as Omit<CustomerSource, 'systemId'>); 
      }
      else if (activeTab === 'payment-terms') { 
        if (editingItem) paymentTermMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else paymentTermMutations.create.mutate(data as Omit<PaymentTerm, 'systemId'>); 
      }
      else if (activeTab === 'credit-ratings') { 
        if (editingItem) creditRatingMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else creditRatingMutations.create.mutate(data as Omit<CreditRating, 'systemId'>); 
      }
      else if (activeTab === 'lifecycle-stages') { 
        if (editingItem) lifecycleStageMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } }); 
        else lifecycleStageMutations.create.mutate(data as Omit<LifecycleStage, 'systemId'>); 
      }
      else if (activeTab === 'sla' && editingItem) slaSettingMutations.update.mutate({ systemId: editingItem.systemId, data: { ...editingItem, ...data } });
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
