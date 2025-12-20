import * as React from 'react';
import { Plus, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { toast } from 'sonner';
import type { RegisterTabActions } from '../use-tab-action-registry';

type ShippingFeeConfigPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export const ShippingFeeConfigPageContent: React.FC<ShippingFeeConfigPageContentProps> = ({ isActive, onRegisterActions }) => {
  const handleAddFee = React.useCallback(() => {
    toast.info('Tính năng thêm biểu phí đang được phát triển');
  }, []);

  const handleImportFees = React.useCallback(() => {
    toast.info('Nhập bảng phí sẽ khả dụng sau khi hoàn thiện API');
  }, []);

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add" onClick={handleAddFee}>
        <Plus className="h-4 w-4 mr-2" /> Thêm biểu phí
      </SettingsActionButton>,
      <SettingsActionButton key="import" variant="outline" onClick={handleImportFees}>
        <Upload className="h-4 w-4 mr-2" /> Nhập bảng phí
      </SettingsActionButton>,
    ]);
  }, [handleAddFee, handleImportFees, isActive, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình phí vận chuyển</CardTitle>
        <CardDescription>Thiết lập bảng giá và chính sách phí giao hàng</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
      </CardContent>
    </Card>
  );
};
