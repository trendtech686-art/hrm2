import * as React from "react";
import { useCashbookStore } from "../../cashbook/store.ts";
import { useReceiptStore } from "../../receipts/store.ts";
import { usePaymentStore } from "../../payments/store.ts";
import { useBranchStore } from "../branches/store.ts";
import type { CashAccount } from "../../cashbook/types.ts";
import { CashAccountForm, type CashAccountFormValues } from "./form.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal, Pencil, Trash2, PowerOff, Power, Star } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { toast } from "sonner";

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export function CashAccountsPageContent() {
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
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  
  const handleEdit = (item: CashAccount) => { setEditingItem(item); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: string) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleStatus = (item: CashAccount) => {
    update(item.systemId, { ...item, isActive: !item.isActive });
    toast.success(item.isActive ? "Đã ngừng hoạt động" : "Đã kích hoạt");
  };
  
  const handleSetDefault = (item: CashAccount) => {
    setDefault(item.systemId);
    toast.success(`Đã đặt ${item.name} làm tài khoản mặc định`);
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success("Đã xóa thành công");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleFormSubmit = (values: CashAccountFormValues) => {
    try {
      if (editingItem) {
        update(editingItem.systemId, { ...editingItem, ...values });
        toast.success("Cập nhật thành công");
      } else {
        add(values);
        toast.success("Thêm mới thành công");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

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
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Mặc định</TableHead>
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
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.isDefault ? (
                        <span className="text-sm font-medium">Mặc định</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {!item.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(item)}>
                              <Star className="mr-2 h-4 w-4" />
                              Đặt làm mặc định
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleStatus(item)}>
                            {item.isActive ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Ngừng hoạt động
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(item.systemId)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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
