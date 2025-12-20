import * as React from 'react';
import { SettingsPlaceholder } from '../../components/settings/SettingsPlaceholder';
import { useSettingsPageHeader } from './use-settings-page-header';
import { Card, CardContent } from '../../components/ui/card';
import { ReceiptCent } from 'lucide-react';

export function TaxesPage() {
  useSettingsPageHeader({
    title: 'Thuế',
  });

  return (
    <Card>
      <CardContent className="p-6">
        <SettingsPlaceholder
          icon={ReceiptCent}
          title="Quản lý thuế"
          description="Chức năng đang được phát triển"
        >
          <p>
            Module thuế sẽ hỗ trợ khai báo thuế suất đầu vào/đầu ra, map sản phẩm và đồng bộ với chứng từ bán hàng.
            Chúng tôi đang triển khai bảng thuế linh hoạt trước khi mở cho người dùng.
          </p>
        </SettingsPlaceholder>
      </CardContent>
    </Card>
  );
}
