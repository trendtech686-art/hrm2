import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { useCashbookStore } from "../../cashbook/store";
import { useReceiptStore } from "../../receipts/store";
import { usePaymentStore } from "../../payments/store";
import { useBranchStore } from "../branches/store";
import type { CashAccount } from "../../cashbook/types";
import { CashAccountForm, type CashAccountFormValues } from "./form";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { asBusinessId, asSystemId, type SystemId } from "../../../lib/id-types";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

type CashAccountsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function CashAccountsPageContent({ isActive, onRegisterActions }: CashAccountsPageContentProps) {
  const { accounts: data, add, update, remove, setDefault } = useCashbookStore();
  const { data: receipts } = useReceiptStore();
  const { data: payments } = usePaymentStore();
  const { data: branches } = useBranchStore();
  
  // Tính số dư hiện tại cho mỗi tài khoản
  const accountsWithBalance = React.useMemo(() => {
    return data.map(account => {
      const accountReceipts = receipts.filter(r => r.accountSystemId === account.systemId);
      const accountPayments = payments.filter(p => p.accountSystemId === account.systemId);
      
      const totalIn = accountReceipts.reduce((sum, r) => sum + r.amount, 0);
      const totalOut = accountPayments.reduce((sum, p) => sum + p.amount, 0);
      const currentBalance = account.initialBalance + totalIn - totalOut;
      
      // Kiểm tra cảnh báo
      const isLowBalance = account.minBalance && currentBalance < account.minBalance;
      const isHighBalance = account.maxBalance && currentBalance > account.maxBalance;
      
      return { ...account, currentBalance, isLowBalance, isHighBalance };
    });
  }, [data, receipts, payments]);
  
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
  
  const handleToggleStatus = (item: CashAccount, isActive: boolean) => {
    update(item.systemId, { ...item, isActive });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  };
  
  const handleToggleDefault = React.useCallback((item: CashAccount, checked: boolean) => {
    if (checked) {
      setDefault(item.systemId);
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      const otherAccounts = data.filter(a => a.systemId !== item.systemId);
      if (otherAccounts.length > 0) {
        setDefault(otherAccounts[0].systemId);
        toast.success(`Đã đặt "${otherAccounts[0].name}" làm mặc định`);
      } else {
        toast.error('Phải có ít nhất một tài khoản mặc định');
      }
    }
  }, [data, setDefault]);
  
  const handleSetDefault = (item: CashAccount) => {
    setDefault(item.systemId);
    toast.success(`Đã đặt "${item.name}" làm mặc định`);
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(a => a.systemId === idToDelete);
      remove(idToDelete);
      toast.success(`Đã xóa "${item?.name}"`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const normalizeFormValues = (values: CashAccountFormValues): Omit<CashAccount, 'systemId'> => {
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

    return {
      id: asBusinessId(sanitizedId),
      name: sanitizedName,
      initialBalance: values.initialBalance,
      type: values.type,
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
        update(editingItem.systemId, { ...editingItem, ...payload });
        toast.success("Cập nhật thành công");
      } else {
        add(payload);
        toast.success("Thêm mới thành công");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-cash-account" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản quỹ
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã tài khoản</TableHead>
              <TableHead>Tên tài khoản</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ngân hàng</TableHead>
              <TableHead>Chi nhánh</TableHead>
              <TableHead className="text-right">Số dư hiện tại</TableHead>
              <TableHead>Mặc định</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountsWithBalance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              accountsWithBalance.map((item) => {
                const branch = branches.find(b => b.systemId === item.branchSystemId);
                return (
                  <TableRow key={item.systemId}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'cash' ? 'default' : 'secondary'}>
                        {item.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.type === 'bank' && item.bankName ? (
                        <div>
                          <div className="font-medium">{item.bankName}</div>
                          {item.bankAccountNumber && (
                            <div className="text-xs text-muted-foreground">
                              {item.bankAccountNumber}
                            </div>
                          )}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {branch?.name || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        {formatCurrency(item.currentBalance)}
                      </div>
                      {(item.isLowBalance || item.isHighBalance) && (
                        <div className="text-xs text-orange-600">
                          {item.isLowBalance && '⚠ Dưới mức tối thiểu'}
                          {item.isHighBalance && '⚠ Vượt mức tối đa'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={item.isDefault} 
                        onCheckedChange={(checked) => handleToggleDefault(item, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={item.isActive} 
                        onCheckedChange={(checked) => handleToggleStatus(item, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {!item.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(item)}>
                              Đặt làm mặc định
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(item.systemId)}
                            className="text-destructive"
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật tài khoản quỹ' : 'Thêm tài khoản quỹ'}</DialogTitle>
          </DialogHeader>
          <CashAccountForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" form="cash-account-form">Lưu</Button>
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
    </div>
  );
}
