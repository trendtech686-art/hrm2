'use client'

import * as React from 'react';
import { Plus, MoreHorizontal, Edit, Star, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { PartnerConfigDialog, ShippingPartner } from './partner-config-dialog';
import { 
  loadShippingConfig, 
  loadShippingConfigAsync,
  saveShippingConfig,
  updatePartnerAccount,
  setDefaultAccount,
  deletePartnerAccount,
} from '@/lib/utils/shipping-config-migration';
import type { PartnerAccount } from '@/lib/types/shipping-config';
import type { RegisterTabActions } from '../use-tab-action-registry';
import type { ColumnDef } from '@/components/data-table/types';
import { toast } from 'sonner';

type PartnerConnectionsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

// Partner info
const PARTNER_INFO: Record<ShippingPartner, { name: string; description: string }> = {
  'GHN': { name: 'Giao Hàng Nhanh', description: 'Kết nối giao hàng, thu hộ chuyên nghiệp.' },
  'GHTK': { name: 'Giao Hàng Tiết Kiệm', description: 'Dịch vụ giao hàng thu tiền hộ.' },
  'VTP': { name: 'Viettel Post', description: 'Dịch vụ vận chuyển Viettel.' },
  'J&T': { name: 'J&T Express', description: 'Giao nhận hàng hóa nhanh chóng.' },
  'SPX': { name: 'SPX Express', description: 'Vận chuyển Shopee.' },
  'VNPOST': { name: 'Vietnam Post', description: 'Bưu chính quốc gia.' },
  'NINJA_VAN': { name: 'Ninja Van', description: 'Giao hàng Đông Nam Á.' },
  'AHAMOVE': { name: 'Ahamove', description: 'Giao hàng nội thành.' },
};

const PARTNER_CODES: ShippingPartner[] = ['GHN', 'GHTK', 'VTP', 'J&T', 'SPX', 'VNPOST', 'NINJA_VAN', 'AHAMOVE'];

// Extended type for table display
type AccountRow = PartnerAccount & {
  systemId: string; // Required by SimpleSettingsTable
  partnerCode: ShippingPartner;
  partnerName: string;
};

export const PartnerConnectionsPageContent: React.FC<PartnerConnectionsPageContentProps> = ({ isActive, onRegisterActions }) => {
  const [shippingConfig, setShippingConfig] = React.useState(() => loadShippingConfig());
  const [isLoading, setIsLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<ShippingPartner | null>(null);
  const [editingAccountId, setEditingAccountId] = React.useState<string | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [accountToDelete, setAccountToDelete] = React.useState<AccountRow | null>(null);

  // Load config from API on mount
  React.useEffect(() => {
    loadShippingConfigAsync().then((config) => {
      setShippingConfig(config);
      setIsLoading(false);
    });
  }, []);

  const refreshConfig = React.useCallback(async () => {
    const config = await loadShippingConfigAsync();
    setShippingConfig(config);
  }, []);

  // === FLATTEN DATA FOR TABLE ===
  const tableData = React.useMemo((): AccountRow[] => {
    const rows: AccountRow[] = [];
    for (const code of PARTNER_CODES) {
      const accounts = shippingConfig.partners[code]?.accounts || [];
      for (const account of accounts) {
        rows.push({
          ...account,
          systemId: account.id, // Use account.id as systemId for table
          partnerCode: code,
          partnerName: PARTNER_INFO[code].name,
        });
      }
    }
    return rows;
  }, [shippingConfig]);

  // === HANDLERS ===
  const handleAddAccount = React.useCallback(() => {
    setSelectedPartner(null); // Will show partner selection in dialog
    setEditingAccountId(undefined);
    setDialogOpen(true);
  }, []);

  const handleEditAccount = React.useCallback((row: AccountRow) => {
    setSelectedPartner(row.partnerCode);
    setEditingAccountId(row.id);
    setDialogOpen(true);
  }, []);

  const handleToggleActive = React.useCallback((row: AccountRow, value: boolean) => {
    try {
      const config = loadShippingConfig();
      const account = config.partners[row.partnerCode]?.accounts.find(a => a.id === row.id);
      if (account) {
        const newConfig = updatePartnerAccount(config, row.partnerCode, row.id, { ...account, active: value });
        saveShippingConfig(newConfig);
        refreshConfig();
        toast.success(value ? 'Đã bật tài khoản' : 'Đã tắt tài khoản');
      }
    } catch (error) {
      console.error('Failed to toggle account:', error);
      toast.error('Không thể thay đổi trạng thái');
    }
  }, [refreshConfig]);

  const handleSetDefault = React.useCallback((row: AccountRow) => {
    try {
      const config = loadShippingConfig();
      const newConfig = setDefaultAccount(config, row.partnerCode, row.id);
      saveShippingConfig(newConfig);
      refreshConfig();
      toast.success('Đã đặt làm mặc định');
    } catch (error) {
      console.error('Failed to set default:', error);
      toast.error('Không thể đặt mặc định');
    }
  }, [refreshConfig]);

  const handleDeleteRequest = React.useCallback((row: AccountRow) => {
    setAccountToDelete(row);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = React.useCallback(() => {
    if (!accountToDelete) return;
    try {
      const config = loadShippingConfig();
      const newConfig = deletePartnerAccount(config, accountToDelete.partnerCode, accountToDelete.id);
      saveShippingConfig(newConfig);
      refreshConfig();
      toast.success('Đã xóa tài khoản');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Không thể xóa tài khoản');
    }
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  }, [accountToDelete, refreshConfig]);

  const handleDialogSave = React.useCallback(() => {
    refreshConfig();
    setDialogOpen(false);
  }, [refreshConfig]);

  // === ACTIONS REF ===
  const actionsRef = React.useRef({ handleAddAccount });
  actionsRef.current.handleAddAccount = handleAddAccount;

  // === REGISTER HEADER ACTIONS ===
  React.useLayoutEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add" onClick={() => actionsRef.current.handleAddAccount()}>
        <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

  // === COLUMNS ===
  const columns = React.useMemo((): ColumnDef<AccountRow>[] => [
    {
      id: 'partnerName',
      header: 'Đối tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.partnerName}</span>
          <Badge variant="outline" className="text-xs">{row.partnerCode}</Badge>
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Tên tài khoản',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.name}</span>
          {row.isDefault && (
            <Badge variant="secondary" className="text-xs">Mặc định</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'pickupAddresses',
      header: 'Địa chỉ lấy hàng',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.pickupAddresses?.length || 0}</span>
      ),
    },
    {
      id: 'active',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Switch
          checked={row.active}
          onCheckedChange={(value) => handleToggleActive(row, value)}
          aria-label="Trạng thái"
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditAccount(row)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            {!row.isDefault && (
              <DropdownMenuItem onClick={() => handleSetDefault(row)}>
                <Star className="h-4 w-4 mr-2" />
                Đặt làm mặc định
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteRequest(row)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleToggleActive, handleEditAccount, handleSetDefault, handleDeleteRequest]);

  // === RENDER ===
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Đang tải...</span>
      </div>
    );
  }

  return (
    <>
      <SimpleSettingsTable
        data={tableData}
        columns={columns}
        emptyTitle="Chưa có tài khoản vận chuyển"
        emptyDescription="Thêm tài khoản đối tác vận chuyển để bắt đầu"
        enablePagination
        pagination={{ pageSize: 10, showInfo: true }}
      />

      {/* Account Config Dialog - với partner selection */}
      <PartnerConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partnerCode={selectedPartner}
        partnerName={selectedPartner ? PARTNER_INFO[selectedPartner]?.name : undefined}
        accountId={editingAccountId}
        onSave={handleDialogSave}
        partnerOptions={PARTNER_CODES.map(code => ({ code, name: PARTNER_INFO[code].name }))}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tài khoản "{accountToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
