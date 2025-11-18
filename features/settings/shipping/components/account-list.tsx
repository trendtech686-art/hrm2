/**
 * Account List Component - V2
 * Display and manage multiple accounts per partner
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { MoreVertical, Plus, Star, StarOff, Pencil, Trash2, Power, PowerOff } from 'lucide-react';
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
  onSelectAccountForAddresses?: (accountId: string) => void; // Optional callback to switch to addresses tab
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

  const handleSetDefault = (accountId: string) => {
    try {
      const config = loadShippingConfig();
      const newConfig = setDefaultAccount(config, partnerCode, accountId);
      saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success('Đặt làm mặc định thành công');
    } catch (error) {
      console.error('Failed to set default account:', error);
      toast.error('Lỗi', { description: 'Không thể đặt làm mặc định' });
    }
  };

  const handleToggleActive = (account: PartnerAccount) => {
    try {
      const config = loadShippingConfig();
      const newConfig = updatePartnerAccount(config, partnerCode, account.id, {
        ...account,
        active: !account.active,
      });
      saveShippingConfig(newConfig);
      onAccountsChange();
      toast.success(account.active ? 'Đã tắt tài khoản' : 'Đã bật tài khoản');
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
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Chưa có tài khoản nào</p>
        <Button onClick={onAddAccount}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tài khoản
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Danh sách tài khoản</h3>
            <p className="text-sm text-muted-foreground">
              Quản lý nhiều tài khoản cho đối tác này
            </p>
          </div>
          <Button onClick={onAddAccount}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài khoản
          </Button>
        </div>

        <div className="grid gap-3">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{account.name}</h4>
                    {account.isDefault && (
                      <Badge variant="default" className="gap-1">
                        <Star className="w-3 h-3" />
                        Mặc định
                      </Badge>
                    )}
                    {account.active ? (
                      <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                        <Power className="w-3 h-3" />
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 bg-gray-50 text-gray-500 border-gray-200">
                        <PowerOff className="w-3 h-3" />
                        Tắt
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Địa chỉ lấy hàng:</span>{' '}
                      {account.pickupAddresses?.length || 0} địa chỉ
                      {onSelectAccountForAddresses && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 ml-2 text-xs"
                          onClick={() => onSelectAccountForAddresses(account.id)}
                        >
                          Quản lý →
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Cập nhật: {new Date(account.updatedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditAccount(account.id)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    
                    {!account.isDefault && account.active && (
                      <DropdownMenuItem onClick={() => handleSetDefault(account.id)}>
                        <Star className="w-4 h-4 mr-2" />
                        Đặt làm mặc định
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => handleToggleActive(account)}>
                      {account.active ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Tắt tài khoản
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Bật tài khoản
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(account.id)}
                      className="text-red-600"
                      disabled={account.isDefault}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa tài khoản
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
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
