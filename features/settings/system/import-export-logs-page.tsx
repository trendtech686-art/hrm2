import * as React from 'react';
import { SettingsPlaceholder } from '../../../components/settings/SettingsPlaceholder.tsx';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { Card, CardContent } from '../../../components/ui/card.tsx';
import { Upload } from 'lucide-react';

export function ImportExportLogsPage() {
  useSettingsPageHeader({
    title: 'Lịch sử nhập xuất',
  });

  return (
    <Card>
      <CardContent className="p-6">
        <SettingsPlaceholder
          icon={Upload}
          title="Lịch sử nhập xuất dữ liệu"
          description="Chức năng đang được phát triển"
        >
          <p>
            Trang lịch sử sẽ hiển thị hàng đợi import/export, trạng thái xử lý và file log tải về. Module đang
            được hoàn thiện để đồng bộ với chuẩn audit nội bộ.
          </p>
        </SettingsPlaceholder>
      </CardContent>
    </Card>
  );
}
