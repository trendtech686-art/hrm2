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
import { MobileCard, MobileCardBody, MobileCardFooter, MobileCardHeader } from '@/components/mobile/mobile-card';
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
import { logError } from '@/lib/logger'

interface AccountListProps {
  partnerCode: 'GHN' | 'GHTK' | 'VTP' | 'J&T' | 'SPX';
  accounts: PartnerAccount[];
  onAddAccount: () => void;
  onEditAccount: (accountId: string) => void;
  onAccountsChange: () => void;
  onSelectAccountForAddresses?: ((accountId: string) => void) | undefined;
}

export function AccountList({
  partnerCode,
  accounts,
  onAddAccount: _onAddAccount,
  onEditAccount,
  onAccountsChange,
  onSelectAccountForAddresses: _onSelectAccountForAddresses,
}: AccountListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const handleSetDefault = async (accountId: string, value: boolean) => {
    try {
      const config = loadShippingConfig();
      if (value) {
        // Đặt làm mặc định
        const newConfig = setDefaultAccount(config, partnerCode, accountId);
        await saveShippingConfig(newConfig);
        onAccountsChange();
        const account = accounts.find(a => a.id === accountId);
        toast.success('Đã đặt mặc định', { description: `"${account?.name}" là tài khoản mặc định.` });
      } else {
        // Bỏ mặc định - tự động chọn account đầu tiên khác làm mặc định
        const otherAccounts = accounts.filter(a => a.id !== accountId);
        if (otherAccounts.length > 0) {
          const newDefaultAccount = otherAccounts[0];
          const newConfig = setDefaultAccount(config, partnerCode, newDefaultAccount.id);
          await saveShippingConfig(newConfig);
          onAccountsChange();
          toast.success('Đã bỏ mặc định', { description: `"${newDefaultAccount.name}" đã được đặt làm mặc định.` });
        }
      }
    } catch (error) {
      logError('Failed to set default account', error);
      toast.error('Lỗi', { description: 'Không thể đặt làm mặc định' });
    }
  };

  const handleToggleActive = async (account: PartnerAccount, value: boolean) => {
    try {
      const config = loadShippingConfig();
      const newConfig = updatePartnerAccount(config, partnerCode, account.id, {
        ...account,
        active: value,
      });
      await saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success(value ? 'Đã bật tài khoản' : 'Đã tắt tài khoản');
    } catch (error) {
      logError('Failed to toggle account', error);
      toast.error('Lỗi', { description: 'Không thể thay đổi trạng thái' });
    }
  };

  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    try {
      const config = loadShippingConfig();
      const newConfig = deletePartnerAccount(config, partnerCode, accountToDelete);
      await saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success('Xóa tài khoản thành công');
    } catch (error) {
      logError('Failed to delete account', error);
      toast.error('Lỗi', { description: 'Không thể xóa tài khoản' });
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  if (accounts.length === 0) {
    // Empty state đã được xử lý ở parent component
    return null;
  }

  return (
    <>
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên tài khoản</TableHead>
              <TableHead>Địa chỉ lấy hàng</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="w-25">Mặc định</TableHead>
              <TableHead className="w-25">Trạng thái</TableHead>
              <TableHead className="w-20 text-right">Thao tác</TableHead>
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

      {/* Mobile: card stack */}
      <div className="md:hidden space-y-3">
        {accounts.map((account) => (
          <MobileCard
            key={account.id}
            inert
            emphasis={account.isDefault ? 'success' : 'none'}
          >
            <MobileCardHeader className="items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tên tài khoản
                </div>
                <div className="mt-0.5 text-sm font-semibold truncate">{account.name}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold leading-none">
                  {account.pickupAddresses?.length || 0}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Địa chỉ</div>
              </div>
            </MobileCardHeader>
            <MobileCardBody>
              <dl className="grid grid-cols-1 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Cập nhật</dt>
                  <dd className="font-medium">{formatDateForDisplay(account.updatedAt)}</dd>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Mặc định</span>
                  <Switch
                    checked={account.isDefault}
                    onCheckedChange={(value) => handleSetDefault(account.id, value)}
                    aria-label="Đặt làm mặc định"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Trạng thái</span>
                  <Switch
                    checked={account.active}
                    onCheckedChange={(value) => handleToggleActive(account, value)}
                    aria-label="Trạng thái hoạt động"
                  />
                </div>
              </dl>
            </MobileCardBody>
            <MobileCardFooter>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onEditAccount(account.id)}
              >
                Sửa
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteClick(account.id)}
                disabled={account.isDefault}
                className="text-destructive hover:text-destructive disabled:opacity-50"
              >
                Xóa
              </Button>
            </MobileCardFooter>
          </MobileCard>
        ))}
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
