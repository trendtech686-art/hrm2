/**
 * Account List Component - V2
 * Display and manage multiple accounts per partner using Table
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';
import { formatDateForDisplay } from '@/lib/date-utils';
import type { PartnerAccount } from '@/lib/types/shipping-config';
import { 
  deletePartnerAccount, 
  setDefaultAccount,
  updatePartnerAccount,
  loadShippingConfig,
  saveShippingConfig
} from '@/lib/utils/shipping-config-migration';
import { toast } from 'sonner';

interface AccountListProps {
  partnerCode: 'GHN' | 'GHTK' | 'VTP' | 'J&T' | 'SPX' | 'VNPOST' | 'NINJA_VAN' | 'AHAMOVE';
  accounts: PartnerAccount[];
  onAddAccount: () => void;
  onEditAccount: (accountId: string) => void;
  onAccountsChange: () => void;
  onSelectAccountForAddresses?: ((accountId: string) => void) | undefined;
}

export function AccountList({
  partnerCode,
  accounts,
  onAddAccount,
  onEditAccount,
  onAccountsChange,
  onSelectAccountForAddresses,
}: AccountListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const handleSetDefault = (accountId: string, value: boolean) => {
    try {
      const config = loadShippingConfig();
      if (value) {
        // Đặt làm mặc định
        const newConfig = setDefaultAccount(config, partnerCode, accountId);
        saveShippingConfig(newConfig);
        onAccountsChange();
        const account = accounts.find(a => a.id === accountId);
        toast.success('Đã đặt mặc định', { description: `"${account?.name}" là tài khoản mặc định.` });
      } else {
        // Bỏ mặc định - tự động chọn account đầu tiên khác làm mặc định
        const otherAccounts = accounts.filter(a => a.id !== accountId);
        if (otherAccounts.length > 0) {
          const newDefaultAccount = otherAccounts[0];
          const newConfig = setDefaultAccount(config, partnerCode, newDefaultAccount.id);
          saveShippingConfig(newConfig);
          onAccountsChange();
          toast.success('Đã bỏ mặc định', { description: `"${newDefaultAccount.name}" đã được đặt làm mặc định.` });
        }
      }
    } catch (error) {
      console.error('Failed to set default account:', error);
      toast.error('Lỗi', { description: 'Không thể đặt làm mặc định' });
    }
  };

  const handleToggleActive = (account: PartnerAccount, value: boolean) => {
    try {
      const config = loadShippingConfig();
      const newConfig = updatePartnerAccount(config, partnerCode, account.id, {
        ...account,
        active: value,
      });
      saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success(value ? 'Đã bật tài khoản' : 'Đã tắt tài khoản');
    } catch (error) {
      console.error('Failed to toggle account:', error);
      toast.error('Lỗi', { description: 'Không thể thay đổi trạng thái' });
    }
  };

  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!accountToDelete) return;

    try {
      const config = loadShippingConfig();
      const newConfig = deletePartnerAccount(config, partnerCode, accountToDelete);
      saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success('Xóa tài khoản thành công');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Lỗi', { description: 'Không thể xóa tài khoản' });
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-4">Chưa có tài khoản nào</p>
        <Button onClick={onAddAccount}>
          Thêm tài khoản
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Danh sách tài khoản</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý nhiều tài khoản cho đối tác này
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tài khoản</TableHead>
                <TableHead>Địa chỉ lấy hàng</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="w-[100px]">Mặc định</TableHead>
                <TableHead className="w-[100px]">Trạng thái</TableHead>
                <TableHead className="w-[80px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    {account.pickupAddresses?.length || 0} địa chỉ
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDateForDisplay(account.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={account.isDefault}
                      onCheckedChange={(value) => handleSetDefault(account.id, value)}
                      aria-label="Đặt làm mặc định"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={account.active}
                      onCheckedChange={(value) => handleToggleActive(account, value)}
                      aria-label="Trạng thái hoạt động"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEditAccount(account.id)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(account.id)}
                          className="text-destructive"
                          disabled={account.isDefault}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
              Tất cả địa chỉ lấy hàng của tài khoản này cũng sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
