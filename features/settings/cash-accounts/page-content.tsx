import * as React from "react";
import { Plus } from "lucide-react";
import { useCashAccountMutations } from "../../cashbook/hooks/use-cashbook";
import { useAllCashAccounts } from "./hooks/use-cash-accounts";
import { useAccountBalances } from "../../cashbook/hooks/use-account-balances";
import { useAllBranches } from "../branches/hooks/use-all-branches";
import { useAllPaymentMethods } from "../payments/hooks/use-all-payment-methods";
import type { CashAccount } from "../../cashbook/types";
import { CashAccountForm, type CashAccountFormValues } from "./form";
import { getCashAccountColumns } from "./columns";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { asBusinessId, asSystemId, type SystemId } from "../../../lib/id-types";
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

type CashAccountsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function CashAccountsPageContent({ isActive, onRegisterActions }: CashAccountsPageContentProps) {
  const { data: queryData } = useAllCashAccounts();
  const data = React.useMemo(() => (queryData?.data ?? []) as unknown as CashAccount[], [queryData?.data]);
  const { create, update, remove, setDefault, isLoading: isMutating } = useCashAccountMutations({
    onSuccess: () => {},
    onError: (error) => toast.error(error.message),
  });
  // ✅ Use server-side API for balance calculation (optimized)
  const { data: accountBalances } = useAccountBalances();
  const { data: branches } = useAllBranches();
  const { data: paymentMethods } = useAllPaymentMethods();
  
  // Merge account data with server-calculated balances
  const accountsWithBalance = React.useMemo(() => {
    if (!accountBalances) {
      // Fallback: return accounts without balance calculation while loading
      return data.map(account => ({
        ...account,
        currentBalance: account.initialBalance,
        isLowBalance: false,
        isHighBalance: false,
      }));
    }
    
    // Create a map for quick lookup
    const balanceMap = new Map(accountBalances.map(b => [b.systemId, b]));
    
    return data.map(account => {
      const balance = balanceMap.get(account.systemId);
      if (balance) {
        return {
          ...account,
          currentBalance: balance.currentBalance,
          isLowBalance: balance.isLowBalance,
          isHighBalance: balance.isHighBalance,
        };
      }
      return {
        ...account,
        currentBalance: account.initialBalance,
        isLowBalance: false,
        isHighBalance: false,
      };
    });
  }, [data, accountBalances]);
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CashAccount | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: CashAccount) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = (systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleStatus = React.useCallback((item: CashAccount, isActive: boolean) => {
    update.mutate(
      { systemId: item.systemId, data: { isActive } },
      { onSuccess: () => toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`) }
    );
  }, [update]);
  
  const handleToggleDefault = React.useCallback((item: CashAccount, checked: boolean) => {
    if (checked) {
      setDefault.mutate(item.systemId, { onSuccess: () => toast.success(`Đã đặt "${item.name}" làm mặc định`) });
    } else {
      const otherAccounts = data.filter(a => a.systemId !== item.systemId);
      if (otherAccounts.length > 0) {
        setDefault.mutate(otherAccounts[0].systemId, { 
          onSuccess: () => toast.success(`Đã đặt "${otherAccounts[0].name}" làm mặc định`) 
        });
      } else {
        toast.error('Phải có ít nhất một tài khoản mặc định');
      }
    }
  }, [data, setDefault]);
  
  const handleSetDefault = React.useCallback((item: CashAccount) => {
    setDefault.mutate(item.systemId, { onSuccess: () => toast.success(`Đã đặt "${item.name}" làm mặc định`) });
  }, [setDefault]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(a => a.systemId === idToDelete);
      remove.mutate(idToDelete, { onSuccess: () => toast.success(`Đã xóa "${item?.name}"`) });
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const normalizeFormValues = (values: CashAccountFormValues): Omit<CashAccount, 'systemId'> & { accountType?: string } => {
    const sanitizedId = values.id.trim().toUpperCase();
    const sanitizedName = values.name.trim();
    const branchId = values.branchSystemId ? asSystemId(values.branchSystemId) : undefined;
    const managerId = values.managedBy ? asSystemId(values.managedBy) : undefined;

    const trimmed = (input?: string) => {
      if (!input) return undefined;
      const next = input.trim();
      return next.length > 0 ? next : undefined;
    };

    const bankAccountNumber = trimmed(values.bankAccountNumber);
    const bankBranch = trimmed(values.bankBranch);
    const bankName = trimmed(values.bankName);
    const bankCode = trimmed(values.bankCode);
    const accountHolder = trimmed(values.accountHolder);

    // Suy ra type (cash/bank) từ thông tin ngân hàng
    const type = bankAccountNumber ? 'bank' as const : 'cash' as const;

    return {
      id: asBusinessId(sanitizedId),
      name: sanitizedName,
      initialBalance: values.initialBalance,
      type,
      accountType: values.paymentMethodSystemId,
      isActive: values.isActive,
      ...(values.isDefault !== undefined ? { isDefault: values.isDefault } : {}),
      ...(bankAccountNumber ? { bankAccountNumber } : {}),
      ...(bankBranch ? { bankBranch } : {}),
      ...(bankName ? { bankName } : {}),
      ...(bankCode ? { bankCode } : {}),
      ...(accountHolder ? { accountHolder } : {}),
      ...(values.minBalance !== undefined ? { minBalance: values.minBalance } : {}),
      ...(values.maxBalance !== undefined ? { maxBalance: values.maxBalance } : {}),
      ...(branchId ? { branchSystemId: branchId } : {}),
      ...(managerId ? { managedBy: managerId } : {}),
    };
  };

  const handleFormSubmit = (values: CashAccountFormValues) => {
    try {
      const payload = normalizeFormValues(values);
      if (editingItem) {
        update.mutate(
          { systemId: editingItem.systemId, data: payload },
          { onSuccess: () => toast.success("Cập nhật thành công") }
        );
      } else {
        create.mutate(payload, { onSuccess: () => toast.success("Thêm mới thành công") });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  // Register header actions - use ref to avoid stale closures
  const handleAddNewRef = React.useRef(handleAddNew);
  handleAddNewRef.current = handleAddNew;
  
  React.useLayoutEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add-cash-account" onClick={() => handleAddNewRef.current()}>
        <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản quỹ
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    for (const id of selectedIds) {
      await remove.mutateAsync(id as SystemId);
    }
    toast.success(`Đã xóa ${selectedIds.length} tài khoản`);
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };

  const getBranchName = React.useCallback((branchSystemId?: string) => {
    if (!branchSystemId) return '';
    const branch = branches.find(b => b.systemId === branchSystemId);
    return branch?.name || '';
  }, [branches]);

  const getPaymentMethodName = React.useCallback((accountType?: string | null, type?: string) => {
    // Ưu tiên: tìm theo accountType (systemId của hình thức thanh toán)
    if (accountType) {
      const method = paymentMethods.find(pm => String(pm.systemId) === accountType);
      if (method) return method.name;
    }
    // Fallback cho dữ liệu cũ: suy luận từ type (cash/bank)
    if (type) {
      const isCash = type === 'cash';
      const method = paymentMethods.find(pm => {
        const name = pm.name.toLowerCase();
        return isCash
          ? (name.includes('tiền mặt') || name === 'cash')
          : (name.includes('chuyển khoản') || name.includes('bank'));
      });
      if (method) return method.name;
    }
    return '—';
  }, [paymentMethods]);

  const columns = React.useMemo(
    () => getCashAccountColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
      onSetDefault: handleSetDefault,
      getBranchName,
      getPaymentMethodName,
    }),
    [handleEdit, handleToggleStatus, handleToggleDefault, handleSetDefault, getBranchName, getPaymentMethodName]
  );

  return (
    <div className="space-y-4">
      <SimpleSettingsTable
        data={accountsWithBalance}
        columns={columns}
        emptyTitle="Chưa có tài khoản quỹ"
        emptyDescription="Thêm tài khoản quỹ đầu tiên để bắt đầu"
        emptyAction={
          <Button size="sm" onClick={handleAddNew}>
            Thêm tài khoản quỹ
          </Button>
        }
        enableSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onBulkDelete={handleBulkDelete}
        enablePagination
        pagination={{ pageSize: 10, showInfo: true }}
      />
      
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!isMutating) setIsFormOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật tài khoản quỹ' : 'Thêm tài khoản quỹ'}</DialogTitle>
          </DialogHeader>
          <CashAccountForm key={editingItem?.systemId ?? 'new'} initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isMutating}>Hủy</Button>
            <Button type="submit" form="cash-account-form" disabled={isMutating}>
              {isMutating ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài khoản quỹ sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {selectedCount} tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các tài khoản đã chọn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
